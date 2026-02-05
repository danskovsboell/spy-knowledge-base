#!/usr/bin/env node
/**
 * Translate a single workflow HTML file
 * Usage: node scripts/translate-single-workflow.mjs <filename>
 * Example: node scripts/translate-single-workflow.mjs ongoing-workflow.html
 */

import fs from 'fs';
import path from 'path';

const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.error('Error: OPENAI_API_KEY environment variable is required');
  process.exit(1);
}
const WORKFLOWS_DIR = '/home/clawdbot/clawd/spy-knowledge-base/public/workflows';
const filename = process.argv[2];

if (!filename) {
  console.error('Usage: node translate-single-workflow.mjs <filename>');
  process.exit(1);
}

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

// Skip languages already done (check for existing translation JSON)
const transFile = path.join(WORKFLOWS_DIR, filename.replace('.html', '-translations.json'));
let existingTrans = {};
if (fs.existsSync(transFile)) {
  try {
    existingTrans = JSON.parse(fs.readFileSync(transFile, 'utf8'));
    console.log(`  Found existing translations for: ${Object.keys(existingTrans).join(', ')}`);
  } catch { }
}

async function callOpenAI(messages, maxTokens = 16000, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 180000); // 3 min timeout

    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-5-mini',
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
      if (attempt < retries) {
        console.log(`    Retry ${attempt}/${retries}: ${err.message}`);
        await new Promise(r => setTimeout(r, 2000 * attempt));
      } else {
        throw err;
      }
    }
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
  // Split into chunks of 50 strings for reliability
  const CHUNK_SIZE = 50;
  const allResults = {};
  
  for (let i = 0; i < strings.length; i += CHUNK_SIZE) {
    const chunk = strings.slice(i, i + CHUNK_SIZE);
    const chunkNum = Math.floor(i / CHUNK_SIZE) + 1;
    const totalChunks = Math.ceil(strings.length / CHUNK_SIZE);
    
    if (totalChunks > 1) {
      process.stdout.write(` chunk ${chunkNum}/${totalChunks}`);
    }
    
    const result = await callOpenAI([
      {
        role: 'system',
        content: `Translate Danish text to ${langName}. Return JSON object mapping Danish→${langName}: { "Danish text": "${langName} text", ... }

Keep unchanged: SPY, Ongoing, Ongoing WMS, Sitoo, NemEDI, Lector, PRICAT, DESADV, ORDERS, ORDRSP, INVOIC, RECADV, INVRPT, STKUPD, SLSRPT, REST API, JSON, Guzzle, webhook, POST, PUT, GET, SFTP
Keep status names: CustomerSpecific, Open, Released, Allocated, Picked, Sent, Retrieved, Returned, Shredded, Notified, ArrivalAtLocation, HandOver, Deviation, Received, Completed, InProgress, Error
Keep emojis at start of strings
Translate naturally and professionally. Translate ALL ${chunk.length} strings.`
      },
      {
        role: 'user',
        content: JSON.stringify(chunk)
      }
    ]);
    
    Object.assign(allResults, result);
    
    // Rate limit pause between chunks
    if (i + CHUNK_SIZE < strings.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  return allResults;
}

function generateI18nScript(translations) {
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

async function processWorkflow() {
  console.log(`\n--- ${filename} ---`);
  const filePath = path.join(WORKFLOWS_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    console.error(`  File not found: ${filePath}`);
    process.exit(1);
  }
  
  const content = fs.readFileSync(filePath, 'utf8');

  const babelMatch = content.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
  if (!babelMatch) { console.error('  No babel script!'); return; }

  // Clean existing i18n script
  let cleanContent = content;
  cleanContent = cleanContent.replace(/\s*<script>\s*\(function\(\)\{[\s\S]*?var L=new URLSearchParams[\s\S]*?<\/script>/g, '');
  cleanContent = cleanContent.replace(/<body[^>]*>/, '<body>');

  // Step 1: Extract strings
  console.log('  Extracting strings...');
  const strings = await extractStrings(babelMatch[1]);
  console.log(`  Found ${strings.length} strings`);

  // Step 2: Translate to each language (skip already done)
  const allTranslations = { ...existingTrans };
  
  for (const [code, name] of Object.entries(LANGUAGES)) {
    if (existingTrans[code] && Object.keys(existingTrans[code]).length > 10) {
      console.log(`  ${code} (${name})... ✓ (already done, ${Object.keys(existingTrans[code]).length} strings)`);
      continue;
    }
    
    process.stdout.write(`  ${code} (${name})...`);
    try {
      const trans = await translateBatch(strings, code, name);
      allTranslations[code] = trans;
      console.log(` ✓ (${Object.keys(trans).length} strings)`);
      
      // Save progress after each language
      fs.writeFileSync(transFile, JSON.stringify(allTranslations, null, 2));
    } catch (err) {
      console.log(` ✗ ${err.message}`);
    }
    
    // Pause between languages
    await new Promise(r => setTimeout(r, 1000));
  }

  // Step 3: Save final translations JSON
  fs.writeFileSync(transFile, JSON.stringify(allTranslations, null, 2));

  // Step 4: Modify HTML
  let modified = cleanContent;
  modified = modified.replace(/<body[^>]*>/, '<body style="opacity:0;transition:opacity .15s">');
  modified = modified.replace('</body>', generateI18nScript(allTranslations) + '\n</body>');

  fs.writeFileSync(filePath, modified);
  console.log(`  ✅ Done: ${filename}`);
}

processWorkflow().catch(err => { console.error('Fatal:', err); process.exit(1); });
