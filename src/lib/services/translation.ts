import { getOpenAIClient } from '../openai'
import { createServerClient } from '../supabase'
import { getGlossaryTerms, formatGlossaryForPrompt } from './glossary'
import { computeContentHash } from './outdated'

const MODEL = 'gpt-5-mini'

interface TranslationResult {
  title: string
  description: string
  content: string | null
  tokensUsed: number
}

/**
 * Build the system prompt for translation with glossary and SPY context.
 */
function buildTranslationPrompt(targetLangName: string, glossaryPrompt: string): string {
  return `You are a professional translator for SPY System – an ERP system for the textile and fashion industry. Translate accurately and preserve technical terms.
${glossaryPrompt}
Rules:
- Preserve markdown formatting exactly
- Do NOT translate SPY-specific names (SPY, Ongoing, Sitoo, NemEDI, Lector, PRICAT)
- Preserve code blocks and technical identifiers
- Use formal language appropriate for professional documentation
- If the text contains HTML, preserve all HTML tags and only translate text content
- Output ONLY the translation, no explanations or notes

Translate the following from Danish to ${targetLangName}:`
}

/**
 * Translate a single text with retry logic.
 */
async function translateText(
  text: string,
  targetLangName: string,
  glossaryPrompt: string,
  maxRetries: number = 3
): Promise<{ translated: string; tokens: number }> {
  const openai = getOpenAIClient()
  let lastError: Error | null = null

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: buildTranslationPrompt(targetLangName, glossaryPrompt) },
          { role: 'user', content: text },
        ],
        temperature: 0.3,
        max_tokens: 8000,
      })

      const translated = response.choices[0]?.message?.content?.trim() || ''
      const tokens = response.usage?.total_tokens || 0
      return { translated, tokens }
    } catch (err: any) {
      lastError = err
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Translation failed after retries')
}

/**
 * Translate a full article (title, description, content) to a target language.
 */
export async function translateArticle(
  articleId: string,
  sourceLang: string,
  targetLangCode: string,
  targetLangName: string
): Promise<TranslationResult> {
  const supabase = createServerClient()
  if (!supabase) throw new Error('Server client not configured')

  // Fetch source translation
  const { data: source, error: srcError } = await supabase
    .from('kb_translations')
    .select('title, description, content')
    .eq('article_id', articleId)
    .eq('language_code', sourceLang)
    .single()

  if (srcError || !source) throw new Error(`Source translation not found for ${sourceLang}`)

  // Get glossary
  const glossaryTerms = await getGlossaryTerms(targetLangCode)
  const glossaryPrompt = formatGlossaryForPrompt(glossaryTerms)

  let totalTokens = 0

  // Translate title
  const { translated: title, tokens: t1 } = await translateText(
    source.title, targetLangName, glossaryPrompt
  )
  totalTokens += t1

  // Translate description
  const { translated: description, tokens: t2 } = await translateText(
    source.description || '', targetLangName, glossaryPrompt
  )
  totalTokens += t2

  // Translate content if present
  let content: string | null = null
  if (source.content) {
    const { translated: translatedContent, tokens: t3 } = await translateText(
      source.content, targetLangName, glossaryPrompt
    )
    content = translatedContent
    totalTokens += t3
  }

  // Compute source hash for outdated detection
  const sourceHash = computeContentHash(
    `${source.title}|${source.description}|${source.content || ''}`
  )

  // Upsert translation
  const { error: upsertError } = await supabase
    .from('kb_translations')
    .upsert({
      article_id: articleId,
      language_code: targetLangCode,
      title,
      description,
      content,
      status: 'auto_translated',
      translated_by: `openai/${MODEL}`,
      translated_at: new Date().toISOString(),
      source_hash: sourceHash,
    }, { onConflict: 'article_id,language_code' })

  if (upsertError) throw upsertError

  return { title, description, content, tokensUsed: totalTokens }
}

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English', de: 'German', nl: 'Dutch', fr: 'French',
  it: 'Italian', es: 'Spanish', sv: 'Swedish', no: 'Norwegian',
  da: 'Danish',
}

/**
 * Translate an article to all active languages (except source).
 */
export async function translateAllLanguages(
  articleId: string,
  sourceLang: string = 'da'
): Promise<{ results: Array<{ lang: string; status: string; error?: string; tokensUsed?: number }> }> {
  const supabase = createServerClient()
  if (!supabase) throw new Error('Server client not configured')

  const { data: languages } = await supabase
    .from('languages')
    .select('code, name')
    .eq('is_active', true)
    .neq('code', sourceLang)

  if (!languages || languages.length === 0) {
    return { results: [] }
  }

  const results: Array<{ lang: string; status: string; error?: string; tokensUsed?: number }> = []

  for (const lang of languages) {
    // Create job record
    const { data: job } = await supabase
      .from('translation_jobs')
      .insert({
        article_id: articleId,
        source_language: sourceLang,
        target_language: lang.code,
        status: 'in_progress',
        model: MODEL,
        started_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    try {
      const result = await translateArticle(
        articleId, sourceLang, lang.code, lang.name || LANGUAGE_NAMES[lang.code] || lang.code
      )

      // Update job as completed
      if (job) {
        await supabase.from('translation_jobs').update({
          status: 'completed',
          tokens_used: result.tokensUsed,
          completed_at: new Date().toISOString(),
        }).eq('id', job.id)
      }

      results.push({ lang: lang.code, status: 'success', tokensUsed: result.tokensUsed })
    } catch (err: any) {
      if (job) {
        await supabase.from('translation_jobs').update({
          status: 'failed',
          error_message: err.message,
          completed_at: new Date().toISOString(),
        }).eq('id', job.id)
      }
      results.push({ lang: lang.code, status: 'failed', error: err.message })
    }
  }

  return { results }
}
