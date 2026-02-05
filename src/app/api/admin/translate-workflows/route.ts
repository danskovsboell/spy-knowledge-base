import { NextRequest, NextResponse } from 'next/server'
import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'

// Target languages for translation
const TARGET_LANGUAGES = ['en', 'nl']

// Language names for prompts
const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  nl: 'Dutch',
}

/**
 * Extract translatable text from HTML content
 * Looks for visible text content, headings, labels, etc.
 */
function extractTextsFromHTML(html: string): string[] {
  const texts = new Set<string>()
  
  // Extract text from common elements
  const patterns = [
    // Headings
    /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/gi,
    // Paragraphs
    /<p[^>]*>([^<]+)<\/p>/gi,
    // Spans and divs with text
    /<span[^>]*>([^<]+)<\/span>/gi,
    /<div[^>]*>([^<]{3,})<\/div>/gi,
    // List items
    /<li[^>]*>([^<]+)<\/li>/gi,
    // Labels
    /<label[^>]*>([^<]+)<\/label>/gi,
    // Buttons
    /<button[^>]*>([^<]+)<\/button>/gi,
    // Table cells
    /<td[^>]*>([^<]+)<\/td>/gi,
    /<th[^>]*>([^<]+)<\/th>/gi,
    // Strong/em
    /<strong[^>]*>([^<]+)<\/strong>/gi,
    /<em[^>]*>([^<]+)<\/em>/gi,
    /<b[^>]*>([^<]+)<\/b>/gi,
    // Title attribute
    /title="([^"]+)"/gi,
    // Aria-label
    /aria-label="([^"]+)"/gi,
  ]
  
  for (const pattern of patterns) {
    let match
    while ((match = pattern.exec(html)) !== null) {
      const text = match[1].trim()
      // Filter out empty, numeric-only, or very short texts
      if (text && text.length > 2 && !/^\d+$/.test(text) && !/^[<>&\s]+$/.test(text)) {
        texts.add(text)
      }
    }
  }
  
  return Array.from(texts)
}

/**
 * Translate texts using OpenAI API
 */
async function translateWithOpenAI(
  texts: string[],
  targetLang: string,
  languageName: string
): Promise<Record<string, string>> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  // Batch texts to avoid token limits (max ~50 per batch)
  const batchSize = 50
  const translations: Record<string, string> = {}
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize)
    
    const prompt = `Translate the following Danish texts to ${languageName}. 
Return a JSON object where keys are the original Danish texts and values are the ${languageName} translations.
Keep technical terms, product names, and system names (like "SPY System", "Ongoing WMS", "Sitoo") unchanged.
Maintain the same tone and formatting.

Texts to translate:
${JSON.stringify(batch, null, 2)}

Return ONLY valid JSON, no explanation.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional translator specializing in technical documentation. Return only valid JSON.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${response.status} - ${error}`)
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    try {
      // Clean up potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const batchTranslations = JSON.parse(cleanContent)
      Object.assign(translations, batchTranslations)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content)
      throw new Error(`Failed to parse translation response: ${parseError}`)
    }
  }

  return translations
}

/**
 * POST /api/admin/translate-workflows
 * Translates all workflow HTML files to EN and NL
 */
export async function POST(request: NextRequest) {
  try {
    // Get workflows directory
    const workflowsDir = join(process.cwd(), 'public', 'workflows')
    
    // Read all HTML files
    const files = await readdir(workflowsDir)
    const htmlFiles = files.filter(f => f.endsWith('.html'))
    
    if (htmlFiles.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No workflow HTML files found' 
      }, { status: 404 })
    }

    const translated: string[] = []
    const errors: Array<{ workflow: string; error: string }> = []

    for (const htmlFile of htmlFiles) {
      const workflowName = htmlFile.replace('.html', '')
      
      try {
        // Read HTML content
        const htmlPath = join(workflowsDir, htmlFile)
        const htmlContent = await readFile(htmlPath, 'utf-8')
        
        // Extract translatable texts
        const texts = extractTextsFromHTML(htmlContent)
        
        if (texts.length === 0) {
          console.log(`No translatable texts found in ${workflowName}`)
          continue
        }

        // Build translations object with Danish as source
        const translations: Record<string, Record<string, string>> = {
          da: Object.fromEntries(texts.map(t => [t, t])),
        }

        // Translate to each target language
        for (const langCode of TARGET_LANGUAGES) {
          const langName = LANGUAGE_NAMES[langCode]
          console.log(`Translating ${workflowName} to ${langName}...`)
          
          const langTranslations = await translateWithOpenAI(texts, langCode, langName)
          translations[langCode] = langTranslations
        }

        // Save translations JSON file
        const jsonPath = join(workflowsDir, `${workflowName}-translations.json`)
        await writeFile(jsonPath, JSON.stringify(translations, null, 2), 'utf-8')
        
        translated.push(workflowName)
        console.log(`✓ ${workflowName} translated successfully`)
        
      } catch (error: any) {
        console.error(`Error translating ${workflowName}:`, error.message)
        errors.push({ workflow: workflowName, error: error.message })
      }
    }

    return NextResponse.json({
      success: true,
      translated,
      languages: TARGET_LANGUAGES,
      errors: errors.length > 0 ? errors : undefined,
    })

  } catch (error: any) {
    console.error('Translation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}

/**
 * GET /api/admin/translate-workflows
 * Returns status of workflow translations
 */
export async function GET() {
  try {
    const workflowsDir = join(process.cwd(), 'public', 'workflows')
    const files = await readdir(workflowsDir)
    
    const htmlFiles = files.filter(f => f.endsWith('.html'))
    const jsonFiles = files.filter(f => f.endsWith('-translations.json'))
    
    const status = htmlFiles.map(html => {
      const name = html.replace('.html', '')
      const hasTranslations = jsonFiles.includes(`${name}-translations.json`)
      return { workflow: name, translated: hasTranslations }
    })

    return NextResponse.json({
      workflows: status,
      totalWorkflows: htmlFiles.length,
      translatedCount: status.filter(s => s.translated).length,
    })
    
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
