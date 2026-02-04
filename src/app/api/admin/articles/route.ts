import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../../lib/supabase'
import { markOutdatedTranslations, computeContentHash } from '../../../../lib/services/outdated'

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

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (id) {
    // Get single article with all translations
    const { data: article, error } = await supabase
      .from('kb_articles')
      .select(`
        id, slug, category, icon, image_url, badge, badge_color, sort_order, is_published, source_language,
        kb_translations(id, language_code, title, description, content, status, translated_by, translated_at, source_hash)
      `)
      .eq('id', id)
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ article })
  }

  // Get all articles with translation counts
  const { data: articles, error } = await supabase
    .from('kb_articles')
    .select(`
      id, slug, category, icon, badge, sort_order, is_published, source_language, created_at, updated_at,
      kb_translations(language_code, status, translated_by, translated_at)
    `)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ articles })
}

export async function PUT(request: NextRequest) {
  if (!authorize(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createServerClient()
  if (!supabase) return NextResponse.json({ error: 'Server not configured' }, { status: 500 })

  const body = await request.json()
  const { article_id, title, description, content } = body

  if (!article_id) {
    return NextResponse.json({ error: 'article_id required' }, { status: 400 })
  }

  // Compute new source hash
  const sourceHash = computeContentHash(`${title || ''}|${description || ''}|${content || ''}`)

  // Update the source (Danish) translation
  const { error: updateError } = await supabase
    .from('kb_translations')
    .update({
      title,
      description,
      content,
      source_hash: sourceHash,
      updated_at: new Date().toISOString(),
    })
    .eq('article_id', article_id)
    .eq('language_code', 'da')

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  // Update article's updated_at
  await supabase
    .from('kb_articles')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', article_id)

  // Mark outdated translations
  const outdatedLangs = await markOutdatedTranslations(article_id)

  return NextResponse.json({
    success: true,
    outdatedLanguages: outdatedLangs,
  })
}
