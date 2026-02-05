import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase'

// Migration SQL for setting up the database schema
const MIGRATION_SQL = `
-- Supported languages
CREATE TABLE IF NOT EXISTS languages (
  code VARCHAR(5) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  native_name VARCHAR(50) NOT NULL,
  flag VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Articles (language-independent metadata)
CREATE TABLE IF NOT EXISTS kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  image_url VARCHAR(500),
  badge VARCHAR(100),
  badge_color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  source_language VARCHAR(5) DEFAULT 'da' REFERENCES languages(code),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Translations (content per language)
CREATE TABLE IF NOT EXISTS kb_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  translated_by VARCHAR(50),
  translated_at TIMESTAMPTZ,
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  source_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(article_id, language_code)
);

-- UI translations
CREATE TABLE IF NOT EXISTS ui_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Translation jobs (tracking)
CREATE TABLE IF NOT EXISTS translation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES kb_articles(id),
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  model VARCHAR(50) DEFAULT 'gpt-5-mini',
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Glossary
CREATE TABLE IF NOT EXISTS glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  translation VARCHAR(255) NOT NULL,
  context TEXT,
  UNIQUE(term, language_code)
);

-- Indexes (use IF NOT EXISTS where possible)
CREATE INDEX IF NOT EXISTS idx_translations_article ON kb_translations(article_id);
CREATE INDEX IF NOT EXISTS idx_translations_lang ON kb_translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_status ON kb_translations(status);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON translation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON kb_articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON kb_articles(slug);

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;

-- RLS policies for read access with anon key
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'languages_read' AND tablename = 'languages') THEN
    CREATE POLICY languages_read ON languages FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'articles_read' AND tablename = 'kb_articles') THEN
    CREATE POLICY articles_read ON kb_articles FOR SELECT USING (is_published = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'translations_read' AND tablename = 'kb_translations') THEN
    CREATE POLICY translations_read ON kb_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'ui_translations_read' AND tablename = 'ui_translations') THEN
    CREATE POLICY ui_translations_read ON ui_translations FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'jobs_read' AND tablename = 'translation_jobs') THEN
    CREATE POLICY jobs_read ON translation_jobs FOR SELECT USING (true);
  END IF;
END $$;

-- Service role policies for full access
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_languages' AND tablename = 'languages') THEN
    CREATE POLICY service_role_all_languages ON languages FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_articles' AND tablename = 'kb_articles') THEN
    CREATE POLICY service_role_all_articles ON kb_articles FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_translations' AND tablename = 'kb_translations') THEN
    CREATE POLICY service_role_all_translations ON kb_translations FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_ui' AND tablename = 'ui_translations') THEN
    CREATE POLICY service_role_all_ui ON ui_translations FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_jobs' AND tablename = 'translation_jobs') THEN
    CREATE POLICY service_role_all_jobs ON translation_jobs FOR ALL USING (true) WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'service_role_all_glossary' AND tablename = 'glossary') THEN
    CREATE POLICY service_role_all_glossary ON glossary FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;
`

// Seed data
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
  { slug: 'ongoing-wms', category: 'Integration', icon: '📦', image_url: '/images/ongoing.svg', badge: 'Interaktiv workflow', badge_color: '#3498db', sort_order: 1 },
  { slug: 'sitoo-pos', category: 'Integration', icon: '🏪', image_url: '/images/sitoo.png', badge: 'Interaktiv workflow', badge_color: '#27ae60', sort_order: 2 },
  { slug: 'nemedi', category: 'Integration', icon: '📄', image_url: '/images/nemedi.png', badge: 'Interaktiv workflow', badge_color: '#e67e22', sort_order: 3 },
  { slug: 'lector-customs', category: 'Integration', icon: '🛃', image_url: '/images/lector.png', badge: 'Interaktiv workflow', badge_color: '#9b59b6', sort_order: 4 },
  { slug: 'dedication', category: 'Feature', icon: '🎯', image_url: null, badge: 'Interaktiv guide', badge_color: '#c9a227', sort_order: 5 },
]

const DANISH_TRANSLATIONS: Record<string, { title: string, description: string }> = {
  'ongoing-wms': { title: 'Ongoing WMS', description: 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering.' },
  'sitoo-pos': { title: 'Sitoo POS', description: 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata.' },
  'nemedi': { title: 'NemEDI', description: 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser.' },
  'lector-customs': { title: 'Lector Customs', description: 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation.' },
  'dedication': { title: 'Dedication / Reservering', description: 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer.' },
}

/**
 * POST /api/setup - Run database migration and seed data
 * Requires service role key as Bearer token for security
 */
export async function POST(request: NextRequest) {
  // Verify authentication with service role key
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createServerClient()
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server client not configured. Check SUPABASE env vars.' }, { status: 500 })
  }
  const results: string[] = []

  try {
    // Step 1: Seed languages via REST API
    const { error: langError } = await supabaseAdmin
      .from('languages')
      .upsert(LANGUAGES, { onConflict: 'code' })

    if (langError) {
      // If table doesn't exist, we need to run migration SQL first
      if (langError.message.includes('does not exist') || langError.code === 'PGRST204') {
        return NextResponse.json({
          error: 'Tables do not exist yet. Please run the migration SQL in the Supabase Dashboard SQL Editor first.',
          migrationSql: MIGRATION_SQL,
          instructions: [
            '1. Go to https://supabase.com/dashboard/project/fbaxsnfbgqipgyozcbzw/sql/new',
            '2. Paste the migration SQL from the "migrationSql" field',
            '3. Click "Run"',
            '4. Call this endpoint again to seed the data'
          ]
        }, { status: 422 })
      }
      throw langError
    }
    results.push('✅ Languages seeded')

    // Step 2: Seed articles
    const { error: artError } = await supabaseAdmin
      .from('kb_articles')
      .upsert(
        ARTICLES.map(a => ({ ...a, is_published: true, source_language: 'da' })),
        { onConflict: 'slug' }
      )

    if (artError) throw artError
    results.push('✅ Articles seeded')

    // Step 3: Get article IDs
    const { data: articles } = await supabaseAdmin
      .from('kb_articles')
      .select('id, slug')

    if (!articles) throw new Error('Failed to fetch articles after insert')

    // Step 4: Seed Danish translations
    const translations = articles.map(a => ({
      article_id: a.id,
      language_code: 'da',
      title: DANISH_TRANSLATIONS[a.slug]?.title || a.slug,
      description: DANISH_TRANSLATIONS[a.slug]?.description || '',
      status: 'published',
      translated_by: 'system',
    }))

    const { error: transError } = await supabaseAdmin
      .from('kb_translations')
      .upsert(translations, { onConflict: 'article_id,language_code' })

    if (transError) throw transError
    results.push('✅ Danish translations seeded')

    return NextResponse.json({
      success: true,
      results,
      message: 'Database setup complete! You can now use /api/translate to translate content to other languages.'
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Setup failed',
      details: error.message,
      results,
    }, { status: 500 })
  }
}

/**
 * GET /api/setup - Get migration SQL and setup status
 */
export async function GET(request: NextRequest) {
  // Check auth
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check current status
  const supabaseAdmin = createServerClient()
  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Server client not configured. Check SUPABASE env vars.' }, { status: 500 })
  }
  let tablesExist = false
  let articleCount = 0
  let translationCount = 0

  try {
    const { count: langCount } = await supabaseAdmin.from('languages').select('*', { count: 'exact', head: true })
    tablesExist = true
    const { count: artCount } = await supabaseAdmin.from('kb_articles').select('*', { count: 'exact', head: true })
    articleCount = artCount || 0
    const { count: transCount } = await supabaseAdmin.from('kb_translations').select('*', { count: 'exact', head: true })
    translationCount = transCount || 0
  } catch {
    tablesExist = false
  }

  return NextResponse.json({
    status: tablesExist ? 'ready' : 'needs_migration',
    tablesExist,
    articleCount,
    translationCount,
    migrationSql: MIGRATION_SQL,
    instructions: tablesExist ? [
      'Tables exist! Run POST /api/setup to seed data if needed.',
      'Run POST /api/translate to translate content to other languages.'
    ] : [
      '1. Go to https://supabase.com/dashboard/project/fbaxsnfbgqipgyozcbzw/sql/new',
      '2. Paste the migration SQL below',
      '3. Click "Run"',
      '4. Call POST /api/setup to seed data',
      '5. Call POST /api/translate to translate content'
    ]
  })
}
