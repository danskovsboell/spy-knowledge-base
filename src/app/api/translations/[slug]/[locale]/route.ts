import { NextRequest, NextResponse } from 'next/server'
import { getWorkflowTranslations } from '../../../../../lib/services/translation-service'
import { isValidLocale, Locale } from '../../../../../lib/i18n'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; locale: string }> }
) {
  const { slug, locale } = await params

  // Validate locale
  if (!isValidLocale(locale)) {
    return NextResponse.json(
      { error: 'Invalid locale', validLocales: ['da', 'en', 'de', 'nl', 'fr', 'it', 'es', 'sv', 'no'] },
      { status: 400 }
    )
  }

  try {
    const translations = await getWorkflowTranslations(slug, locale as Locale)

    if (!translations) {
      return NextResponse.json(
        { 
          translations: {}, 
          source: 'fallback',
          message: `No translations found for ${slug}/${locale}` 
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      translations,
      source: 'database',
      slug,
      locale
    })
  } catch (error) {
    console.error(`[API] Error fetching translations for ${slug}/${locale}:`, error)
    return NextResponse.json(
      { error: 'Internal server error', translations: {} },
      { status: 500 }
    )
  }
}
