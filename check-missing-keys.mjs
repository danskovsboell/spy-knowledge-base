import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Load .env.local manually
const envContent = fs.readFileSync('.env.local', 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    envVars[key.trim()] = valueParts.join('=').trim()
  }
})

Object.assign(process.env, envVars)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const workflows = [
  { slug: 'sitoo-pos', key: "Visualisering af SPY's integration med Sitoo kassesystem" },
  { slug: 'ongoing-wms', key: "Visualisering af SPY's integration med Ongoing Warehouse Management System" },
  { slug: 'nemedi', key: "Visualisering af SPY's EDI dokumentflow med NemEDI" }
]

for (const workflow of workflows) {
  const { data: article } = await supabase
    .from('kb_articles')
    .select('id')
    .eq('slug', workflow.slug)
    .single()

  if (article) {
    const { data: translations } = await supabase
      .from('kb_translations')
      .select('language_code, content')
      .eq('article_id', article.id)
      .in('language_code', ['da', 'en', 'nl'])

    console.log(`\n${workflow.slug}:`)
    console.log(`Looking for key: "${workflow.key}"`)

    for (const trans of translations || []) {
      if (trans.content) {
        const parsed = JSON.parse(trans.content)
        const hasKey = workflow.key in parsed
        console.log(`  ${trans.language_code}: ${hasKey ? '✅ EXISTS' : '❌ MISSING'} (${Object.keys(parsed).length} total keys)`)

        if (!hasKey && trans.language_code === 'da') {
          // Show first 5 keys for debugging
          console.log('    First 5 keys:', Object.keys(parsed).slice(0, 5))
        }
      }
    }
  }
}
