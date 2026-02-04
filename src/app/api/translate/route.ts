import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase'
import { translateArticle, translateAllLanguages } from '../../../lib/services/translation'
import { markOutdatedTranslations } from '../../../lib/services/outdated'

function authorize(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  return !!(authHeader && serviceKey && authHeader === `Bearer ${serviceKey}`)
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', de: 'German', nl: 'Dutch', fr: 'French',
  it: 'Italian', es: 'Spanish', sv: 'Swedish', no: 'Norwegian',
  da: 'Danish',
}

/**
 * POST /api/translate - Translate articles
 * Body: { article_id?: string, slug?: string, target_languages?: string[] }
 */
export async function POST(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Server client not configured' }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const { article_id, slug, target_languages } = body

  try {
    // Resolve article_id from slug if needed
    let articleId = article_id
    if (!articleId && slug) {
      const { data } = await supabase
        .from('kb_articles')
        .select('id')
        .eq('slug', slug)
        .single()
      if (!data) return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      articleId = data.id
    }

    // If specific article
    if (articleId) {
      if (target_languages && target_languages.length > 0) {
        // Translate to specific languages
        const results = []
        for (const langCode of target_languages) {
          try {
            const result = await translateArticle(
              articleId, 'da', langCode, LANGUAGE_NAMES[langCode] || langCode
            )
            results.push({ lang: langCode, status: 'success', title: result.title, tokensUsed: result.tokensUsed })
          } catch (err: any) {
            results.push({ lang: langCode, status: 'failed', error: err.message })
          }
        }
        return NextResponse.json({ success: true, results })
      } else {
        // Translate to all languages
        const { results } = await translateAllLanguages(articleId)
        return NextResponse.json({ success: true, results })
      }
    }

    // Translate ALL articles
    const { data: articles } = await supabase
      .from('kb_articles')
      .select('id, slug')
      .eq('is_published', true)

    if (!articles || articles.length === 0) {
      return NextResponse.json({ error: 'No articles found' }, { status: 404 })
    }

    const allResults = []
    for (const art of articles) {
      const { results } = await translateAllLanguages(art.id)
      allResults.push({ slug: art.slug, results })
    }

    return NextResponse.json({ success: true, articles: allResults })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * GET /api/translate - Get translation coverage and status
 */
export async function GET(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Server client not configured' }, { status: 500 })
  }

  try {
    const [
      { data: translations },
      { data: jobs },
      { data: articles },
    ] = await Promise.all([
      supabase.from('kb_translations').select('article_id, language_code, status, translated_by, translated_at, source_hash'),
      supabase.from('translation_jobs').select('*').order('created_at', { ascending: false }).limit(50),
      supabase.from('kb_articles').select('id, slug'),
    ])

    const coverage: Record<string, Record<string, { status: string; translated_by: string | null }>> = {}
    if (translations && articles) {
      for (const article of articles) {
        coverage[article.slug] = {}
        const articleTranslations = translations.filter(t => t.article_id === article.id)
        for (const t of articleTranslations) {
          coverage[article.slug][t.language_code] = {
            status: t.status,
            translated_by: t.translated_by,
          }
        }
      }
    }

    return NextResponse.json({
      coverage,
      recentJobs: jobs || [],
      totalTranslations: translations?.length || 0,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/**
 * PUT /api/translate - Update article and check for outdated translations
 * Body: { article_id: string, title?: string, description?: string, content?: string }
 */
export async function PUT(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Server client not configured' }, { status: 500 })
  }

  const body = await request.json().catch(() => ({}))
  const { article_id, title, description, content } = body

  if (!article_id) {
    return NextResponse.json({ error: 'article_id required' }, { status: 400 })
  }

  try {
    // Update the source (Danish) translation
    const updateFields: Record<string, any> = { updated_at: new Date().toISOString() }
    if (title !== undefined) updateFields.title = title
    if (description !== undefined) updateFields.description = description
    if (content !== undefined) updateFields.content = content

    const { error: updateError } = await supabase
      .from('kb_translations')
      .update(updateFields)
      .eq('article_id', article_id)
      .eq('language_code', 'da')

    if (updateError) throw updateError

    // Check for outdated translations
    const outdatedLangs = await markOutdatedTranslations(article_id)

    return NextResponse.json({
      success: true,
      outdatedLanguages: outdatedLangs,
      message: outdatedLangs.length > 0
        ? `${outdatedLangs.length} translations marked as outdated`
        : 'No translations affected',
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
