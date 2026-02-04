#!/usr/bin/env npx tsx
/**
 * Auto-translate articles from Danish to all other languages using OpenAI
 * 
 * Usage:
 *   npx tsx scripts/translate-articles.ts                    # Translate all
 *   npx tsx scripts/translate-articles.ts --slug=ongoing-wms  # Translate one article
 *   npx tsx scripts/translate-articles.ts --lang=en,de        # Translate to specific languages
 *   npx tsx scripts/translate-articles.ts --dry-run            # Preview only
 */

import * as fs from 'fs'
import * as path from 'path'

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  for (const line of envContent.split('\n')) {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing SUPABASE credentials in .env.local')
  process.exit(1)
}
if (!OPENAI_API_KEY) {
  console.error('❌ Missing OPENAI_API_KEY in .env.local')
  process.exit(1)
}

// Parse CLI args
const args = process.argv.slice(2)
const getArg = (name: string) => args.find(a => a.startsWith(`--${name}=`))?.split('=')[1]
const hasFlag = (name: string) => args.includes(`--${name}`)

const filterSlug = getArg('slug')
const filterLangs = getArg('lang')?.split(',')
const dryRun = hasFlag('dry-run')

const TARGET_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'nl', name: 'Dutch' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
].filter(l => !filterLangs || filterLangs.includes(l.code))

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
}

async function supabaseGet(table: string, params: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers })
  if (!res.ok) throw new Error(`GET ${table}: ${res.status} ${await res.text()}`)
  return res.json()
}

async function supabaseUpsert(table: string, data: any, onConflict: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation,resolution=merge-duplicates' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error(`POST ${table}: ${res.status} ${await res.text()}`)
  return res.json()
}

// SPY-specific glossary terms that should NOT be translated
const KEEP_TERMS = [
  'SPY', 'SPY System', 'Ongoing WMS', 'Sitoo POS', 'NemEDI', 'Lector', 'PRICAT',
  'DESADV', 'INVOIC', 'ORDERS', 'HS-koder', 'webhooks', 'webhook', 'API', 'EDI',
  'NOOS', 'Pre-Dedication', 'Dedication', 'Stock', 'Pre', 'POS', 'WMS', 'EAN',
  'GTIN', 'SKU', 'B2B', 'REST', 'JSON', 'XML', 'CSV',
]

async function translateText(text: string, targetLang: string, targetLangName: string, context: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator for SPY System's knowledge base (fashion/retail ERP software).

Translate the following Danish text to ${targetLangName}.

RULES:
1. Keep these terms UNCHANGED: ${KEEP_TERMS.join(', ')}
2. Keep product/brand names unchanged
3. Maintain professional but accessible tone
4. If text contains HTML, preserve ALL tags and only translate text content
5. Return ONLY the translated text, nothing else (no quotes, no explanations)
6. Context: ${context}`
        },
        { role: 'user', content: text }
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`OpenAI: ${err.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

async function main() {
  console.log('🌐 SPY Knowledge Base - Auto Translation')
  console.log('=' .repeat(50))
  if (dryRun) console.log('🔍 DRY RUN - no changes will be made\n')
  if (filterSlug) console.log(`📄 Filtering: ${filterSlug}`)
  console.log(`🎯 Target languages: ${TARGET_LANGUAGES.map(l => l.code).join(', ')}`)

  // Fetch articles with Danish translations
  let articlesQuery = 'select=id,slug,kb_translations(title,description,content)&kb_translations.language_code=eq.da'
  if (filterSlug) articlesQuery += `&slug=eq.${filterSlug}`
  
  const articles = await supabaseGet('kb_articles', articlesQuery)
  
  if (!articles || articles.length === 0) {
    console.log('❌ No articles found with Danish translations')
    process.exit(1)
  }

  console.log(`\n📚 Found ${articles.length} article(s) to translate\n`)

  let totalSuccess = 0
  let totalFailed = 0

  for (const article of articles) {
    const daTrans = article.kb_translations?.[0]
    if (!daTrans) {
      console.log(`⏭️  ${article.slug}: No Danish translation, skipping`)
      continue
    }

    console.log(`\n📄 ${article.slug}`)
    console.log(`   DA: "${daTrans.title}" - ${daTrans.description?.substring(0, 60)}...`)

    for (const lang of TARGET_LANGUAGES) {
      process.stdout.write(`   → ${lang.code} (${lang.name})... `)

      if (dryRun) {
        console.log('(dry run, skipped)')
        continue
      }

      try {
        // Translate title
        const title = await translateText(daTrans.title, lang.code, lang.name, 'article title')
        
        // Translate description
        const description = await translateText(daTrans.description, lang.code, lang.name, 'article description (1-2 sentences)')
        
        // Translate content if present
        let content: string | null = null
        if (daTrans.content) {
          content = await translateText(daTrans.content, lang.code, lang.name, 'article body content (may contain HTML)')
        }

        // Upsert to database
        await supabaseUpsert('kb_translations', [{
          article_id: article.id,
          language_code: lang.code,
          title,
          description,
          content,
          status: 'translated',
          translated_by: 'openai/gpt-4.1-mini',
          translated_at: new Date().toISOString(),
        }], 'article_id,language_code')

        console.log(`✅ "${title}"`)
        totalSuccess++
        
        // Small delay to respect rate limits
        await new Promise(r => setTimeout(r, 500))
      } catch (e: any) {
        console.log(`❌ ${e.message}`)
        totalFailed++
      }
    }
  }

  console.log('\n' + '=' .repeat(50))
  console.log(`✅ Successful: ${totalSuccess}`)
  if (totalFailed > 0) console.log(`❌ Failed: ${totalFailed}`)
  console.log('Done!')
}

main().catch(e => {
  console.error('❌ Fatal:', e)
  process.exit(1)
})
