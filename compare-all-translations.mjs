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

const workflows = ['ongoing-wms', 'sitoo-pos', 'nemedi', 'lector-customs']

for (const slug of workflows) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`📦 ${slug.toUpperCase()}`)
  console.log('='.repeat(60))

  const { data: article } = await supabase
    .from('kb_articles')
    .select('id')
    .eq('slug', slug)
    .single()

  if (!article) {
    console.log('❌ Article not found')
    continue
  }

  // Get all translations
  const { data: translations } = await supabase
    .from('kb_translations')
    .select('language_code, content')
    .eq('article_id', article.id)
    .in('language_code', ['da', 'en', 'nl'])

  const parsedTranslations = {}

  for (const trans of translations || []) {
    if (trans.content) {
      try {
        parsedTranslations[trans.language_code] = JSON.parse(trans.content)
      } catch (e) {
        console.log(`❌ Failed to parse ${trans.language_code}`)
      }
    } else {
      parsedTranslations[trans.language_code] = {}
    }
  }

  const da = parsedTranslations.da || {}
  const en = parsedTranslations.en || {}
  const nl = parsedTranslations.nl || {}

  console.log(`\n📊 Key counts:`)
  console.log(`  DA: ${Object.keys(da).length} keys`)
  console.log(`  EN: ${Object.keys(en).length} keys`)
  console.log(`  NL: ${Object.keys(nl).length} keys`)

  // Find missing keys in EN
  const missingInEn = Object.keys(da).filter(key => !(key in en))
  if (missingInEn.length > 0) {
    console.log(`\n❌ Missing in EN (${missingInEn.length}):`)
    missingInEn.slice(0, 10).forEach(key => {
      console.log(`  - "${key}"`)
    })
    if (missingInEn.length > 10) {
      console.log(`  ... and ${missingInEn.length - 10} more`)
    }
  } else {
    console.log('\n✅ All Danish keys exist in English')
  }

  // Find missing keys in NL
  const missingInNl = Object.keys(da).filter(key => !(key in nl))
  if (missingInNl.length > 0) {
    console.log(`\n❌ Missing in NL (${missingInNl.length}):`)
    missingInNl.slice(0, 10).forEach(key => {
      console.log(`  - "${key}"`)
    })
    if (missingInNl.length > 10) {
      console.log(`  ... and ${missingInNl.length - 10} more`)
    }
  } else {
    console.log('\n✅ All Danish keys exist in Dutch')
  }

  // Find extra keys in EN
  const extraInEn = Object.keys(en).filter(key => !(key in da))
  if (extraInEn.length > 0) {
    console.log(`\n⚠️  Extra keys in EN not in DA (${extraInEn.length}):`)
    extraInEn.slice(0, 5).forEach(key => {
      console.log(`  - "${key}"`)
    })
  }

  // Find extra keys in NL
  const extraInNl = Object.keys(nl).filter(key => !(key in da))
  if (extraInNl.length > 0) {
    console.log(`\n⚠️  Extra keys in NL not in DA (${extraInNl.length}):`)
    extraInNl.slice(0, 5).forEach(key => {
      console.log(`  - "${key}"`)
    })
  }
}

console.log('\n' + '='.repeat(60))
console.log('✨ Comparison complete!')
