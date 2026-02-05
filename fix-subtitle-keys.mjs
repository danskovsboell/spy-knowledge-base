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

// The KEY should always be the Danish text (what the HTML file has)
// The VALUE should be the translation in that language
const subtitles = {
  'sitoo-pos': {
    key: "Visualisering af SPY's integration med Sitoo kassesystem",
    translations: {
      da: "Visualisering af SPY's integration med Sitoo kassesystem",
      en: "Visualization of SPY's integration with Sitoo point-of-sale system",
      nl: "Visualisatie van SPY's integratie met Sitoo kassasysteem"
    }
  },
  'ongoing-wms': {
    key: "Visualisering af SPY's integration med Ongoing Warehouse Management System",
    translations: {
      da: "Visualisering af SPY's integration med Ongoing Warehouse Management System",
      en: "Visualization of SPY's integration with Ongoing Warehouse Management System",
      nl: "Visualisatie van SPY's integratie met Ongoing Warehouse Management System"
    }
  },
  'nemedi': {
    key: "Visualisering af SPY's EDI dokumentflow med NemEDI",
    translations: {
      da: "Visualisering af SPY's EDI dokumentflow med NemEDI",
      en: "Visualization of SPY's EDI document flow with NemEDI",
      nl: "Visualisatie van SPY's EDI-documentstroom met NemEDI"
    }
  }
}

for (const [slug, subtitleData] of Object.entries(subtitles)) {
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

  for (const [lang, translatedText] of Object.entries(subtitleData.translations)) {
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

    // Use Danish key with translated value
    content[subtitleData.key] = translatedText

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
      console.log(`  ✅ Fixed subtitle for ${lang}: "${translatedText}"`)
    }
  }
}

console.log('\n✨ Done!')
