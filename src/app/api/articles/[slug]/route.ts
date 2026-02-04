import { NextRequest, NextResponse } from 'next/server'
import { getArticle } from '../../../../lib/articles'
import { isValidLocale, type Locale } from '../../../../lib/i18n'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const lang = request.nextUrl.searchParams.get('lang') || 'da'
  
  if (!isValidLocale(lang)) {
    return NextResponse.json({ error: 'Invalid language code' }, { status: 400 })
  }

  try {
    const article = await getArticle(slug, lang as Locale)
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }
    return NextResponse.json({ article })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch article', details: error.message },
      { status: 500 }
    )
  }
}
