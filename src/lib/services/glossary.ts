import { createServerClient } from '../supabase'

export interface GlossaryTerm {
  term: string
  translation: string
  context: string | null
}

/**
 * Fetch glossary terms for a target language.
 * Returns terms mapped from source to target.
 */
export async function getGlossaryTerms(targetLang: string): Promise<GlossaryTerm[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('glossary')
    .select('term, translation, context')
    .eq('language_code', targetLang)

  if (error || !data) return []
  return data
}

/**
 * Format glossary terms for injection into translation prompts.
 */
export function formatGlossaryForPrompt(terms: GlossaryTerm[]): string {
  if (terms.length === 0) return ''

  const lines = terms.map(t => {
    const ctx = t.context ? ` (${t.context})` : ''
    return `- "${t.term}" -> "${t.translation}"${ctx}`
  })

  return `\nGlossary (use these translations consistently):\n${lines.join('\n')}\n`
}

/**
 * CRUD operations for glossary management
 */
export async function addGlossaryTerm(
  term: string,
  languageCode: string,
  translation: string,
  context?: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Server client not configured' }

  const { error } = await supabase
    .from('glossary')
    .upsert(
      { term, language_code: languageCode, translation, context: context || null },
      { onConflict: 'term,language_code' }
    )

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function deleteGlossaryTerm(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'Server client not configured' }

  const { error } = await supabase
    .from('glossary')
    .delete()
    .eq('id', id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function getAllGlossaryTerms(): Promise<(GlossaryTerm & { id: string; language_code: string })[]> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('glossary')
    .select('id, term, language_code, translation, context')
    .order('term')

  if (error || !data) return []
  return data as any
}
