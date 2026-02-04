import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../../lib/supabase'

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return !!(authHeader && serviceKey && authHeader === `Bearer ${serviceKey}`)
}

export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  try {
    const [
      { data: articles },
      { data: translations },
      { data: languages },
      { data: recentJobs },
      { data: glossaryTerms },
    ] = await Promise.all([
      supabase.from('kb_articles').select('id, slug, category, icon, sort_order, is_published, source_language').order('sort_order'),
      supabase.from('kb_translations').select('article_id, language_code, status, translated_by, translated_at'),
      supabase.from('languages').select('code, name, native_name, flag, is_active').eq('is_active', true).order('sort_order'),
      supabase.from('translation_jobs').select('id, article_id, target_language, status, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('glossary').select('id'),
    ])

    // Build matrix: articles x languages with status
    const matrix: Record<string, Record<string, string>> = {}
    if (articles && translations) {
      for (const article of articles) {
        matrix[article.slug] = {}
        const articleTranslations = translations.filter(t => t.article_id === article.id)
        for (const t of articleTranslations) {
          matrix[article.slug][t.language_code] = t.status
        }
      }
    }

    // Stats
    const totalArticles = articles?.length || 0
    const totalLanguages = languages?.length || 0
    const totalTranslations = translations?.length || 0
    const expectedTranslations = totalArticles * totalLanguages
    const published = translations?.filter(t => t.status === 'published' || t.status === 'translated' || t.status === 'auto_translated').length || 0
    const outdated = translations?.filter(t => t.status === 'outdated').length || 0
    const missing = expectedTranslations - totalTranslations

    return NextResponse.json({
      articles: articles || [],
      languages: languages || [],
      matrix,
      stats: {
        totalArticles,
        totalLanguages,
        totalTranslations,
        expectedTranslations,
        published,
        outdated,
        missing,
        glossaryTerms: glossaryTerms?.length || 0,
      },
      recentJobs: recentJobs || [],
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
