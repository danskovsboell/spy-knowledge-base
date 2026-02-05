/**
 * Translation Service - fetches translations from Supabase kb_translations table
 * Falls back to hardcoded translations if DB fetch fails
 */

import { supabase, createServerClient } from '../supabase'
import { Locale } from '../i18n'

export interface DBTranslation {
  id: string
  article_id: string
  language_code: string
  title: string
  description: string | null
  content: string | null // JSON string with key-value pairs
  status: string
  translated_by: string | null
  translated_at: string | null
}

export interface WorkflowTranslations {
  [key: string]: string
}

// Cache for translations (in-memory, refreshes on page load)
const translationCache = new Map<string, Map<string, WorkflowTranslations>>()
const cacheTimestamp = new Map<string, number>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetch workflow translations from database
 * @param workflowSlug - e.g., 'ongoing-wms', 'sitoo-pos'
 * @param locale - target language code
 * @returns Translation key-value pairs or null if not found
 */
export async function getWorkflowTranslations(
  workflowSlug: string,
  locale: Locale
): Promise<WorkflowTranslations | null> {
  // Check cache first
  const cacheKey = `${workflowSlug}-${locale}`
  const cached = translationCache.get(workflowSlug)?.get(locale)
  const timestamp = cacheTimestamp.get(cacheKey)
  
  if (cached && timestamp && Date.now() - timestamp < CACHE_TTL) {
    return cached
  }

  // Use server client for full access (bypasses RLS)
  const client = createServerClient() || supabase

  if (!client) {
    console.warn('[translation-service] Supabase not configured, using fallback')
    return null
  }

  try {
    // First get article_id from slug
    const { data: article, error: articleError } = await client
      .from('kb_articles')
      .select('id')
      .eq('slug', workflowSlug)
      .single()

    if (articleError || !article) {
      console.warn(`[translation-service] Article not found: ${workflowSlug}`)
      return null
    }

    // Then get translation for that article and locale
    const { data: translation, error: transError } = await client
      .from('kb_translations')
      .select('content, title, description')
      .eq('article_id', article.id)
      .eq('language_code', locale)
      .single()

    if (transError || !translation) {
      console.warn(`[translation-service] Translation not found: ${workflowSlug}/${locale}`)
      return null
    }

    console.log(`[translation-service] Found translation for ${workflowSlug}/${locale}:`, {
      hasContent: !!translation.content,
      contentLength: translation.content?.length || 0,
      title: translation.title,
      description: translation.description?.substring(0, 50)
    })

    // Parse content JSON
    let translations: WorkflowTranslations = {}
    if (translation.content) {
      try {
        translations = JSON.parse(translation.content)
        console.log(`[translation-service] Parsed ${Object.keys(translations).length} translation keys`)
      } catch (e) {
        console.error(`[translation-service] Failed to parse content JSON: ${workflowSlug}/${locale}`, e)
        return null
      }
    } else {
      console.warn(`[translation-service] No content field for ${workflowSlug}/${locale}`)
    }

    // Add title and description to translations
    if (translation.title) {
      translations['__title__'] = translation.title
    }
    if (translation.description) {
      translations['__description__'] = translation.description
    }

    // Update cache
    if (!translationCache.has(workflowSlug)) {
      translationCache.set(workflowSlug, new Map())
    }
    translationCache.get(workflowSlug)!.set(locale, translations)
    cacheTimestamp.set(cacheKey, Date.now())

    return translations
  } catch (error) {
    console.error('[translation-service] Database error:', error)
    return null
  }
}

/**
 * Get all available translations for a workflow (all locales)
 */
export async function getAllWorkflowTranslations(
  workflowSlug: string
): Promise<Map<Locale, WorkflowTranslations> | null> {
  if (!supabase) return null

  try {
    const { data: article } = await supabase
      .from('kb_articles')
      .select('id')
      .eq('slug', workflowSlug)
      .single()

    if (!article) return null

    const { data: translations } = await supabase
      .from('kb_translations')
      .select('language_code, content, title, description')
      .eq('article_id', article.id)

    if (!translations) return null

    const result = new Map<Locale, WorkflowTranslations>()
    for (const trans of translations) {
      let content: WorkflowTranslations = {}
      if (trans.content) {
        try {
          content = JSON.parse(trans.content)
        } catch { /* ignore */ }
      }
      if (trans.title) content['__title__'] = trans.title
      if (trans.description) content['__description__'] = trans.description
      result.set(trans.language_code as Locale, content)
    }

    return result
  } catch (error) {
    console.error('[translation-service] Error fetching all translations:', error)
    return null
  }
}

/**
 * Clear translation cache (call after updates)
 */
export function clearTranslationCache(workflowSlug?: string) {
  if (workflowSlug) {
    translationCache.delete(workflowSlug)
    // Clear all related cache timestamps
    for (const key of Array.from(cacheTimestamp.keys())) {
      if (key.startsWith(`${workflowSlug}-`)) {
        cacheTimestamp.delete(key)
      }
    }
  } else {
    translationCache.clear()
    cacheTimestamp.clear()
  }
}
