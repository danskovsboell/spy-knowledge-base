import { NextRequest, NextResponse } from 'next/server'
import { getArticles } from '../../../lib/articles'
import { isValidLocale, type Locale } from '../../../lib/i18n'

export async function GET(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get('lang') || 'da'
  
  if (!isValidLocale(lang)) {
    return NextResponse.json({ error: 'Invalid language code' }, { status: 400 })
  }

  try {
    const articles = await getArticles(lang as Locale)
    return NextResponse.json({ articles })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch articles', details: error.message },
      { status: 500 }
    )
  }
}
