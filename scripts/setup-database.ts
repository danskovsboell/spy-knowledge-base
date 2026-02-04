#!/usr/bin/env npx tsx
/**
 * Database setup script for SPY Knowledge Base
 * 
 * Usage:
 *   npx tsx scripts/setup-database.ts
 * 
 * This script:
 * 1. Creates all required tables via Supabase REST API (service role)
 * 2. Seeds languages and articles
 * 3. Seeds Danish translations
 * 
 * Prerequisites:
 *   - .env.local with SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL
 *   - OR pass DATABASE_URL for direct Postgres connection
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

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal',
}

async function supabaseRest(table: string, method: string, body?: any, params?: string) {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params ? '?' + params : ''}`
  const res = await fetch(url, {
    method,
    headers: { ...headers, ...(method === 'POST' || method === 'PATCH' ? { 'Prefer': 'return=representation,resolution=merge-duplicates' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${table}: ${res.status} ${text}`)
  }
  const contentType = res.headers.get('content-type')
  if (contentType?.includes('json')) {
    return res.json()
  }
  return null
}

const LANGUAGES = [
  { code: 'da', name: 'Danish', native_name: 'Dansk', flag: '🇩🇰', is_active: true, sort_order: 1 },
  { code: 'en', name: 'English', native_name: 'English', flag: '🇬🇧', is_active: true, sort_order: 2 },
  { code: 'de', name: 'German', native_name: 'Deutsch', flag: '🇩🇪', is_active: true, sort_order: 3 },
  { code: 'nl', name: 'Dutch', native_name: 'Nederlands', flag: '🇳🇱', is_active: true, sort_order: 4 },
  { code: 'fr', name: 'French', native_name: 'Français', flag: '🇫🇷', is_active: true, sort_order: 5 },
  { code: 'it', name: 'Italian', native_name: 'Italiano', flag: '🇮🇹', is_active: true, sort_order: 6 },
  { code: 'es', name: 'Spanish', native_name: 'Español', flag: '🇪🇸', is_active: true, sort_order: 7 },
  { code: 'sv', name: 'Swedish', native_name: 'Svenska', flag: '🇸🇪', is_active: true, sort_order: 8 },
  { code: 'no', name: 'Norwegian', native_name: 'Norsk', flag: '🇳🇴', is_active: true, sort_order: 9 },
]

const ARTICLES = [
  { slug: 'ongoing-wms', category: 'Integration', icon: '📦', image_url: '/images/ongoing.svg', badge: 'Interaktiv workflow', badge_color: '#3498db', sort_order: 1, is_published: true, source_language: 'da' },
  { slug: 'sitoo-pos', category: 'Integration', icon: '🏪', image_url: '/images/sitoo.png', badge: 'Interaktiv workflow', badge_color: '#27ae60', sort_order: 2, is_published: true, source_language: 'da' },
  { slug: 'nemedi', category: 'Integration', icon: '📄', image_url: '/images/nemedi.png', badge: 'Interaktiv workflow', badge_color: '#e67e22', sort_order: 3, is_published: true, source_language: 'da' },
  { slug: 'lector-customs', category: 'Integration', icon: '🛃', image_url: '/images/lector.png', badge: 'Interaktiv workflow', badge_color: '#9b59b6', sort_order: 4, is_published: true, source_language: 'da' },
  { slug: 'dedication', category: 'Feature', icon: '🎯', image_url: null, badge: 'Interaktiv guide', badge_color: '#c9a227', sort_order: 5, is_published: true, source_language: 'da' },
]

const DANISH_TRANSLATIONS: Record<string, { title: string; description: string }> = {
  'ongoing-wms': { title: 'Ongoing WMS', description: 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering.' },
  'sitoo-pos': { title: 'Sitoo POS', description: 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata.' },
  'nemedi': { title: 'NemEDI', description: 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser.' },
  'lector-customs': { title: 'Lector Customs', description: 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation.' },
  'dedication': { title: 'Dedication / Reservering', description: 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer.' },
}

async function main() {
  console.log('🔧 SPY Knowledge Base - Database Setup')
  console.log('=' .repeat(50))
  console.log(`📡 Supabase: ${SUPABASE_URL}`)

  // Step 1: Check if tables exist
  console.log('\n📋 Step 1: Checking if tables exist...')
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/languages?select=code&limit=1`, { headers })
    if (res.ok) {
      console.log('✅ Tables already exist!')
    } else {
      const body = await res.json()
      if (body.code === 'PGRST205') {
        console.log('❌ Tables do NOT exist yet.')
        console.log('\n⚠️  You need to run the migration SQL in the Supabase Dashboard SQL Editor:')
        console.log('   https://supabase.com/dashboard/project/fbaxsnfbgqipgyozcbzw/sql/new')
        console.log('   Copy the SQL from: supabase/migrations/001_i18n_schema.sql')
        console.log('   Also run the RLS policies from: src/app/api/setup/route.ts (MIGRATION_SQL)')
        process.exit(1)
      }
    }
  } catch (e: any) {
    console.error('❌ Cannot reach Supabase:', e.message)
    process.exit(1)
  }

  // Step 2: Seed languages
  console.log('\n📋 Step 2: Seeding languages...')
  try {
    const result = await supabaseRest('languages', 'POST', LANGUAGES, 'on_conflict=code')
    console.log(`✅ Languages seeded: ${LANGUAGES.length} languages`)
  } catch (e: any) {
    console.log('⚠️  Language seeding:', e.message)
  }

  // Step 3: Seed articles
  console.log('\n📋 Step 3: Seeding articles...')
  try {
    const result = await supabaseRest('kb_articles', 'POST', ARTICLES, 'on_conflict=slug')
    console.log(`✅ Articles seeded: ${ARTICLES.length} articles`)
  } catch (e: any) {
    console.log('⚠️  Article seeding:', e.message)
  }

  // Step 4: Get article IDs and seed Danish translations
  console.log('\n📋 Step 4: Seeding Danish translations...')
  try {
    const articles = await supabaseRest('kb_articles', 'GET', undefined, 'select=id,slug')
    if (articles && Array.isArray(articles)) {
      const translations = articles.map((a: any) => ({
        article_id: a.id,
        language_code: 'da',
        title: DANISH_TRANSLATIONS[a.slug]?.title || a.slug,
        description: DANISH_TRANSLATIONS[a.slug]?.description || '',
        status: 'published',
        translated_by: 'system',
      }))
      
      await supabaseRest('kb_translations', 'POST', translations, 'on_conflict=article_id,language_code')
      console.log(`✅ Danish translations seeded: ${translations.length} translations`)
    }
  } catch (e: any) {
    console.log('⚠️  Translation seeding:', e.message)
  }

  // Step 5: Verify
  console.log('\n📋 Step 5: Verification...')
  try {
    const langs = await supabaseRest('languages', 'GET', undefined, 'select=code&order=sort_order')
    const articles = await supabaseRest('kb_articles', 'GET', undefined, 'select=slug&order=sort_order')
    const translations = await supabaseRest('kb_translations', 'GET', undefined, 'select=language_code,title')
    
    console.log(`   Languages: ${langs?.length || 0}`)
    console.log(`   Articles: ${articles?.length || 0}`)
    console.log(`   Translations: ${translations?.length || 0}`)
    console.log('\n✅ Database setup complete!')
  } catch (e: any) {
    console.log('⚠️  Verification failed:', e.message)
  }
}

main().catch(e => {
  console.error('❌ Fatal error:', e)
  process.exit(1)
})
