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

const subtitles = {
  'sitoo-pos': {
    da: "Visualisering af SPY's integration med Sitoo kassesystem",
    en: "Visualization of SPY's integration with Sitoo point-of-sale system",
    nl: "Visualisatie van SPY's integratie met Sitoo kassasysteem"
  },
  'ongoing-wms': {
    da: "Visualisering af SPY's integration med Ongoing Warehouse Management System",
    en: "Visualization of SPY's integration with Ongoing Warehouse Management System",
    nl: "Visualisatie van SPY's integratie met Ongoing Warehouse Management System"
  },
  'nemedi': {
    da: "Visualisering af SPY's EDI dokumentflow med NemEDI",
    en: "Visualization of SPY's EDI document flow with NemEDI",
    nl: "Visualisatie van SPY's EDI-documentstroom met NemEDI"
  }
}

for (const [slug, translations] of Object.entries(subtitles)) {
  console.log(`\nProcessing ${slug}...`)

  const { data: article } = await supabase
    .from('kb_articles')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!article) {
    console.log(`  ❌ Article not found: ${slug}`)
    continue
  }

  for (const [lang, subtitle] of Object.entries(translations)) {
    const { data: existing } = await supabase
      .from('kb_translations')
      .select('content')
      .eq('article_id', article.id)
      .eq('language_code', lang)
      .single()

    if (!existing || !existing.content) {
      console.log(`  ⚠️  No existing translation for ${lang}, skipping`)
      continue
    }

    // Parse existing content
    let content = JSON.parse(existing.content)

    // Add subtitle key
    content[subtitles[slug].da] = subtitle

    // Update database
    const { error } = await supabase
      .from('kb_translations')
      .update({
        content: JSON.stringify(content),
        translated_at: new Date().toISOString()
      })
      .eq('article_id', article.id)
      .eq('language_code', lang)

    if (error) {
      console.log(`  ❌ Error updating ${lang}:`, error.message)
    } else {
      console.log(`  ✅ Added subtitle to ${lang} (now ${Object.keys(content).length} keys)`)
    }
  }
}

console.log('\n✨ Done!')
