import { createHash } from 'crypto'
import { createServerClient } from '../supabase'

/**
 * Compute SHA-256 hash of content for change detection.
 */
export function computeContentHash(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}

/**
 * Check and mark translations as outdated when source content changes.
 * Returns the list of language codes that were marked outdated.
 */
export async function markOutdatedTranslations(articleId: string): Promise<string[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  // Get the source (Danish) translation
  const { data: article } = await supabase
    .from('kb_articles')
    .select('source_language')
    .eq('id', articleId)
    .single()

  const sourceLang = article?.source_language || 'da'

  const { data: sourceTranslation } = await supabase
    .from('kb_translations')
    .select('title, description, content')
    .eq('article_id', articleId)
    .eq('language_code', sourceLang)
    .single()

  if (!sourceTranslation) return []

  const currentHash = computeContentHash(
    `${sourceTranslation.title}|${sourceTranslation.description}|${sourceTranslation.content || ''}`
  )

  // Get all non-source translations
  const { data: translations } = await supabase
    .from('kb_translations')
    .select('id, language_code, source_hash, status')
    .eq('article_id', articleId)
    .neq('language_code', sourceLang)

  if (!translations) return []

  const outdatedLangs: string[] = []

  for (const t of translations) {
    // If hash differs, mark as outdated
    if (t.source_hash && t.source_hash !== currentHash && t.status !== 'outdated') {
      await supabase
        .from('kb_translations')
        .update({ status: 'outdated', updated_at: new Date().toISOString() })
        .eq('id', t.id)
      outdatedLangs.push(t.language_code)
    }
  }

  return outdatedLangs
}

/**
 * Get articles that have outdated translations.
 */
export async function getOutdatedArticles(): Promise<Array<{ articleId: string; slug: string; outdatedLangs: string[] }>> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data: outdated } = await supabase
    .from('kb_translations')
    .select('article_id, language_code, kb_articles!inner(slug)')
    .eq('status', 'outdated')

  if (!outdated) return []

  const grouped: Record<string, { slug: string; langs: string[] }> = {}
  for (const t of outdated as any[]) {
    const articleId = t.article_id
    if (!grouped[articleId]) {
      grouped[articleId] = { slug: t.kb_articles?.slug || '', langs: [] }
    }
    grouped[articleId].langs.push(t.language_code)
  }

  return Object.entries(grouped).map(([articleId, { slug, langs }]) => ({
    articleId,
    slug,
    outdatedLangs: langs,
  }))
}
