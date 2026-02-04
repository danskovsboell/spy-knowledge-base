#!/usr/bin/env node
/**
 * Translate workflow HTML files using OpenAI
 * Processes one language at a time for reliability
 */

import fs from 'fs';
import path from 'path';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}
const WORKFLOWS_DIR = '/home/clawdbot/clawd/spy-knowledge-base/public/workflows';

const WORKFLOWS = [
  'ongoing-workflow.html',
  'sitoo-workflow.html',
  'lector-customs-workflow.html',
  'nemedi-workflow.html'
];

const LANGUAGES = {
  en: 'English',
  de: 'German',
  nl: 'Dutch',
  fr: 'French',
  it: 'Italian',
  es: 'Spanish',
  sv: 'Swedish',
  no: 'Norwegian Bokmål'
};

async function callOpenAI(messages, maxTokens = 16000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120000); // 2 min timeout

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.15,
        max_tokens: maxTokens,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);
    const json = await resp.json();
    if (json.error) throw new Error(json.error.message);
    return JSON.parse(json.choices[0].message.content);
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

async function extractStrings(jsx) {
  const result = await callOpenAI([
    {
      role: 'system',
      content: `Extract ALL translatable user-facing Danish text from this React JSX code. Return JSON: { "strings": ["text1", "text2", ...] }

Rules:
- Decode HTML entities: ø not &oslash;, å not &aring;, æ not &aelig;, → not &rarr;, ← not &larr;, — not &mdash;
- Decode hex entities: &#x1F4E6; becomes the emoji 📦
- Include section titles WITH their leading emoji
- Include all FlowBox title/desc values
- Include all DocCard/WebhookItem/InfoCard text
- Include subtitles, notes, paragraphs, legend labels, list items
- Include footer text
- Exclude: CSS, JS code, file paths (like "OngoingExportPRICATTask"), class names
- Each string = exactly what a text node contains in rendered DOM`
    },
    {
      role: 'user',
      content: jsx
    }
  ]);
  return result.strings;
}

async function translateBatch(strings, langCode, langName) {
  const result = await callOpenAI([
    {
      role: 'system',
      content: `Translate Danish text to ${langName}. Return JSON object mapping Danish→${langName}: { "Danish text": "${langName} text", ... }

Keep unchanged: SPY, Ongoing, Ongoing WMS, Sitoo, NemEDI, Lector, PRICAT, DESADV, ORDERS, ORDRSP, INVOIC, RECADV, INVRPT, STKUPD, SLSRPT, REST API, JSON, Guzzle, webhook, POST, PUT, GET, SFTP
Keep status names: CustomerSpecific, Open, Released, Allocated, Picked, Sent, Retrieved, Returned, Shredded, Notified, ArrivalAtLocation, HandOver, Deviation, Received, Completed, InProgress, Error
Keep emojis at start of strings
Translate naturally and professionally. Translate ALL ${strings.length} strings.`
    },
    {
      role: 'user',
      content: JSON.stringify(strings)
    }
  ]);
  return result;
}

function generateI18nScript(translations) {
  // Compact the translations JSON
  const json = JSON.stringify(translations);
  
  return `
    <script>
    (function(){
      var L=new URLSearchParams(window.location.search).get('lang')||'da';
      if(L==='da'){document.body.style.opacity='1';return}
      var T=${json};
      var D=T[L];
      if(!D){document.body.style.opacity='1';return}
      function tr(){
        var r=document.getElementById('root');
        if(!r||!r.children.length)return false;
        var K=Object.keys(D).sort(function(a,b){return b.length-a.length});
        var w=document.createTreeWalker(r,NodeFilter.SHOW_TEXT,null,false);
        var N=[];while(w.nextNode())N.push(w.currentNode);
        N.forEach(function(n){
          var t=n.textContent,s=t.trim();
          if(!s)return;
          if(D[s]){n.textContent=t.replace(s,D[s]);return}
          for(var i=0;i<K.length;i++){
            var k=K[i];
            if(k.length>4&&s.indexOf(k)!==-1){n.textContent=n.textContent.replace(k,D[k])}
          }
        });
        document.documentElement.lang=L;
        return true
      }
      var done=false;
      var obs=new MutationObserver(function(m,o){
        if(!done&&tr()){done=true;o.disconnect();document.body.style.opacity='1'}
      });
      obs.observe(document.getElementById('root'),{childList:true,subtree:true});
      setTimeout(function(){obs.disconnect();if(!done){tr();document.body.style.opacity='1'}},4000);
    })();
    </script>`;
}

async function processWorkflow(filename) {
  console.log(`\n--- ${filename} ---`);
  const filePath = path.join(WORKFLOWS_DIR, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  const babelMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!babelMatch) { console.error('  No babel script!'); return; }

  // Check if already has i18n (for re-runs)
  let cleanContent = content;
  cleanContent = cleanContent.replace(/\s*<script>\s*\(function\(\)\{[\s\S]*?var L=new URLSearchParams[\s\S]*?<\/script>/g, '');
  cleanContent = cleanContent.replace(/<body[^>]*>/, '<body>');

  // Step 1: Extract strings
  console.log('  Extracting strings...');
  const strings = await extractStrings(babelMatch[1]);
  console.log(`  Found ${strings.length} strings`);

  // Step 2: Translate to each language
  const allTranslations = {};
  
  for (const [code, name] of Object.entries(LANGUAGES)) {
    process.stdout.write(`  ${code} (${name})...`);
    try {
      const trans = await translateBatch(strings, code, name);
      allTranslations[code] = trans;
      console.log(` ✓ (${Object.keys(trans).length} strings)`);
    } catch (err) {
      console.log(` ✗ ${err.message}`);
    }
  }

  // Step 3: Save translations JSON
  const transFile = path.join(WORKFLOWS_DIR, filename.replace('.html', '-translations.json'));
  fs.writeFileSync(transFile, JSON.stringify(allTranslations, null, 2));

  // Step 4: Modify HTML
  let modified = cleanContent;
  modified = modified.replace(/<body[^>]*>/, '<body style="opacity:0;transition:opacity .15s">');
  modified = modified.replace('</body>', generateI18nScript(allTranslations) + '\n</body>');

  fs.writeFileSync(filePath, modified);
  console.log(`  ✅ Done: ${filename}`);
}

async function main() {
  console.log('🌐 Workflow Translation Script\n');
  
  for (const filename of WORKFLOWS) {
    await processWorkflow(filename);
  }
  
  console.log('\n✅ All workflows translated!');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
