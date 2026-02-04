import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '../../../lib/supabase'

const TARGET_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'nl', name: 'Dutch' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'es', name: 'Spanish' },
  { code: 'sv', name: 'Swedish' },
  { code: 'no', name: 'Norwegian' },
]

interface TranslationResult {
  title: string
  description: string
  content: string | null
}

async function translateWithOpenAI(
  text: string,
  targetLang: string,
  targetLangName: string,
  context: string = 'SPY System knowledge base article'
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY not configured')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator for ${context}. Translate the following Danish text to ${targetLangName}. 
Keep technical terms (like "Ongoing WMS", "Sitoo POS", "NemEDI", "PRICAT", "HS-codes", "webhooks", "API", "EDI", "SPY") unchanged.
Keep product names unchanged.
Maintain the same tone - professional but accessible.
If the text contains HTML, preserve all HTML tags and only translate the text content.
Return ONLY the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content.trim()
}

async function translateArticle(
  danishTitle: string,
  danishDescription: string,
  danishContent: string | null,
  targetLangCode: string,
  targetLangName: string,
): Promise<TranslationResult> {
  // Translate title
  const title = await translateWithOpenAI(danishTitle, targetLangCode, targetLangName, 'SPY System knowledge base article title')
  
  // Translate description
  const description = await translateWithOpenAI(danishDescription, targetLangCode, targetLangName, 'SPY System knowledge base article description')
  
  // Translate content if present
  let content: string | null = null
  if (danishContent) {
    content = await translateWithOpenAI(danishContent, targetLangCode, targetLangName, 'SPY System knowledge base article content')
  }

  return { title, description, content }
}

/**
 * POST /api/translate - Translate all articles from Danish to other languages
 * Body: { slug?: string, languages?: string[] } - optional filters
 * Requires service role key
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const filterSlug = body.slug as string | undefined
  const filterLanguages = body.languages as string[] | undefined

  const supabaseAdmin = createServerClient()
  const results: any[] = []

  try {
    // Get all articles with their Danish translations
    let query = supabaseAdmin
      .from('kb_articles')
      .select(`
        id, slug,
        kb_translations!inner(title, description, content)
      `)
      .eq('kb_translations.language_code', 'da')

    if (filterSlug) {
      query = query.eq('slug', filterSlug)
    }

    const { data: articles, error: fetchError } = await query
    if (fetchError) throw fetchError
    if (!articles || articles.length === 0) {
      return NextResponse.json({ error: 'No Danish articles found to translate' }, { status: 404 })
    }

    const targetLangs = filterLanguages 
      ? TARGET_LANGUAGES.filter(l => filterLanguages.includes(l.code))
      : TARGET_LANGUAGES

    for (const article of articles) {
      const daTranslation = Array.isArray(article.kb_translations) 
        ? article.kb_translations[0] 
        : article.kb_translations

      if (!daTranslation) {
        results.push({ slug: article.slug, status: 'skipped', reason: 'No Danish translation found' })
        continue
      }

      for (const targetLang of targetLangs) {
        // Create translation job
        const { data: job } = await supabaseAdmin
          .from('translation_jobs')
          .insert({
            article_id: article.id,
            source_language: 'da',
            target_language: targetLang.code,
            status: 'processing',
            model: 'gpt-4.1-mini',
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single()

        try {
          const translated = await translateArticle(
            daTranslation.title,
            daTranslation.description,
            daTranslation.content,
            targetLang.code,
            targetLang.name,
          )

          // Upsert translated content
          const { error: upsertError } = await supabaseAdmin
            .from('kb_translations')
            .upsert({
              article_id: article.id,
              language_code: targetLang.code,
              title: translated.title,
              description: translated.description,
              content: translated.content,
              status: 'translated',
              translated_by: 'openai/gpt-4.1-mini',
              translated_at: new Date().toISOString(),
            }, { onConflict: 'article_id,language_code' })

          if (upsertError) throw upsertError

          // Update job status
          if (job) {
            await supabaseAdmin
              .from('translation_jobs')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id)
          }

          results.push({
            slug: article.slug,
            language: targetLang.code,
            status: 'success',
            title: translated.title,
          })
        } catch (translateError: any) {
          // Update job with error
          if (job) {
            await supabaseAdmin
              .from('translation_jobs')
              .update({
                status: 'failed',
                error_message: translateError.message,
                completed_at: new Date().toISOString(),
              })
              .eq('id', job.id)
          }

          results.push({
            slug: article.slug,
            language: targetLang.code,
            status: 'failed',
            error: translateError.message,
          })
        }
      }
    }

    const successful = results.filter(r => r.status === 'success').length
    const failed = results.filter(r => r.status === 'failed').length

    return NextResponse.json({
      success: true,
      summary: { total: results.length, successful, failed },
      results,
    })

  } catch (error: any) {
    return NextResponse.json({
      error: 'Translation failed',
      details: error.message,
      results,
    }, { status: 500 })
  }
}

/**
 * GET /api/translate - Get translation status
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!authHeader || !serviceKey || authHeader !== `Bearer ${serviceKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createServerClient()

  try {
    // Get translation coverage
    const { data: translations } = await supabaseAdmin
      .from('kb_translations')
      .select('article_id, language_code, status, translated_by, translated_at')

    // Get recent jobs
    const { data: jobs } = await supabaseAdmin
      .from('translation_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    // Get articles
    const { data: articles } = await supabaseAdmin
      .from('kb_articles')
      .select('id, slug')

    const coverage: Record<string, string[]> = {}
    if (translations && articles) {
      for (const article of articles) {
        const articleTranslations = translations
          .filter(t => t.article_id === article.id)
          .map(t => t.language_code)
        coverage[article.slug] = articleTranslations
      }
    }

    return NextResponse.json({
      coverage,
      recentJobs: jobs || [],
      totalTranslations: translations?.length || 0,
    })
  } catch (error: any) {
    return NextResponse.json({
      error: 'Failed to fetch translation status',
      details: error.message,
    }, { status: 500 })
  }
}
