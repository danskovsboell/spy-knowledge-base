import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { locales, Locale } from '@/lib/i18n'
import crypto from 'crypto'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const MODEL = 'gpt-5-mini'

interface TranslateRequest {
  articleId: string
  sourceLocale: Locale
  targetLocales?: Locale[]
  content: Record<string, string>
  title: string
  description: string
}

const LANGUAGE_NAMES: Record<Locale, string> = {
  da: 'Danish',
  en: 'English',
  nl: 'Dutch'
}

async function translateWithOpenAI(
  content: Record<string, string>,
  title: string,
  description: string,
  sourceLocale: Locale,
  targetLocale: Locale
): Promise<{ content: Record<string, string>; title: string; description: string } | null> {
  if (!OPENAI_API_KEY) {
    console.error('[translate] OPENAI_API_KEY not configured')
    return null
  }

  const sourceLang = LANGUAGE_NAMES[sourceLocale]
  const targetLang = LANGUAGE_NAMES[targetLocale]

  const systemPrompt = `You are a professional translator for SPY System – an ERP system for the textile and fashion industry. Translate accurately while preserving technical terms.

Rules:
- Preserve all formatting and structure
- Do NOT translate SPY-specific names: SPY, Ongoing, Sitoo, NemEDI, Lector
- Preserve code blocks and technical identifiers
- Use formal language appropriate for professional documentation
- Output ONLY the translation, no explanations
- Respond with valid JSON matching the input structure`

  const userPrompt = `Translate the following from ${sourceLang} to ${targetLang}.

Title: ${title}

Description: ${description}

Content (JSON object with translation keys):
${JSON.stringify(content, null, 2)}

Respond with a JSON object containing:
{
  "title": "translated title",
  "description": "translated description", 
  "content": { ...translated key-value pairs... }
}`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.15,
        max_tokens: 16000
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error(`[translate] OpenAI API error: ${response.status}`, error)
      return null
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    if (!text) {
      console.error('[translate] No content in OpenAI response')
      return null
    }

    // Parse JSON from response (handle markdown code blocks)
    let jsonText = text.trim()
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json?\n?/g, '').replace(/```$/g, '').trim()
    }

    const parsed = JSON.parse(jsonText)
    return {
      title: parsed.title || title,
      description: parsed.description || description,
      content: parsed.content || content
    }
  } catch (error) {
    console.error('[translate] Error calling OpenAI:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: TranslateRequest = await request.json()
    const { articleId, sourceLocale, targetLocales, content, title, description } = body

    if (!articleId || !sourceLocale || !content || !title) {
      return NextResponse.json(
        { error: 'Missing required fields: articleId, sourceLocale, content, title' },
        { status: 400 }
      )
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 500 }
      )
    }

    // Calculate source hash for outdated detection
    const sourceHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ title, description, content }))
      .digest('hex')

    // Determine target locales
    const targets = targetLocales || locales.filter(l => l !== sourceLocale)

    const results: Record<string, { success: boolean; error?: string }> = {}

    // First, upsert source language
    const { error: sourceError } = await supabase
      .from('kb_translations')
      .upsert({
        article_id: articleId,
        language_code: sourceLocale,
        title,
        description,
        content: JSON.stringify(content),
        status: 'published',
        translated_by: 'source',
        translated_at: new Date().toISOString(),
        source_hash: sourceHash
      }, {
        onConflict: 'article_id,language_code'
      })

    if (sourceError) {
      console.error('[translate] Error upserting source:', sourceError)
    }
    results[sourceLocale] = { success: !sourceError, error: sourceError?.message }

    // Translate to each target locale
    for (const targetLocale of targets) {
      console.log(`[translate] Translating ${articleId} to ${targetLocale}...`)

      const translated = await translateWithOpenAI(content, title, description, sourceLocale, targetLocale)

      if (!translated) {
        results[targetLocale] = { success: false, error: 'Translation failed' }
        continue
      }

      // Upsert to database
      const { error: upsertError } = await supabase
        .from('kb_translations')
        .upsert({
          article_id: articleId,
          language_code: targetLocale,
          title: translated.title,
          description: translated.description,
          content: JSON.stringify(translated.content),
          status: 'published',
          translated_by: MODEL,
          translated_at: new Date().toISOString(),
          source_hash: sourceHash
        }, {
          onConflict: 'article_id,language_code'
        })

      if (upsertError) {
        console.error(`[translate] Error upserting ${targetLocale}:`, upsertError)
        results[targetLocale] = { success: false, error: upsertError.message }
      } else {
        results[targetLocale] = { success: true }
      }
    }

    const successCount = Object.values(results).filter(r => r.success).length
    const totalCount = Object.keys(results).length

    return NextResponse.json({
      success: successCount === totalCount,
      message: `Translated to ${successCount}/${totalCount} languages`,
      results,
      sourceHash
    })
  } catch (error) {
    console.error('[translate] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
