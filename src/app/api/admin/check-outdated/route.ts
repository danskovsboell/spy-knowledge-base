import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Check for outdated translations by comparing source_hash
 * GET: List all outdated translations
 * POST: Mark specific translations as outdated and optionally trigger re-translation
 */

export async function GET(request: NextRequest) {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    // Get all articles with their source translations (da)
    const { data: sourceTranslations, error: sourceError } = await supabase
      .from('kb_translations')
      .select('article_id, source_hash, title')
      .eq('language_code', 'da')

    if (sourceError) {
      return NextResponse.json({ error: sourceError.message }, { status: 500 })
    }

    // For each article, check if other translations have matching source_hash
    const outdated: Array<{
      article_id: string
      title: string
      language_code: string
      current_hash: string | null
      source_hash: string | null
    }> = []

    for (const source of sourceTranslations || []) {
      const { data: translations, error: transError } = await supabase
        .from('kb_translations')
        .select('language_code, source_hash, title')
        .eq('article_id', source.article_id)
        .neq('language_code', 'da')

      if (transError) continue

      for (const trans of translations || []) {
        if (trans.source_hash !== source.source_hash) {
          outdated.push({
            article_id: source.article_id,
            title: source.title,
            language_code: trans.language_code,
            current_hash: trans.source_hash,
            source_hash: source.source_hash
          })
        }
      }
    }

    return NextResponse.json({
      outdatedCount: outdated.length,
      outdated
    })
  } catch (error) {
    console.error('[check-outdated] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 500 })
  }

  try {
    const { articleId } = await request.json()

    if (!articleId) {
      return NextResponse.json({ error: 'articleId required' }, { status: 400 })
    }

    // Get source translation
    const { data: source, error: sourceError } = await supabase
      .from('kb_translations')
      .select('source_hash')
      .eq('article_id', articleId)
      .eq('language_code', 'da')
      .single()

    if (sourceError || !source) {
      return NextResponse.json({ error: 'Source translation not found' }, { status: 404 })
    }

    // Mark all non-matching translations as outdated
    const { data: updated, error: updateError } = await supabase
      .from('kb_translations')
      .update({ status: 'outdated' })
      .eq('article_id', articleId)
      .neq('language_code', 'da')
      .neq('source_hash', source.source_hash)
      .select('language_code')

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      markedOutdated: updated?.length || 0,
      languages: updated?.map(t => t.language_code) || []
    })
  } catch (error) {
    console.error('[check-outdated] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
