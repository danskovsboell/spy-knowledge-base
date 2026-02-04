import { NextRequest, NextResponse } from 'next/server'
import { locales, defaultLocale, isValidLocale, detectLanguageFromHeader } from './lib/i18n'

// Paths that should NOT be locale-prefixed
const PUBLIC_FILE = /\.(.*)$/
const EXCLUDED_PATHS = ['/_next', '/api', '/workflows', '/images', '/favicon', '/spy-logo']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files and excluded paths
  if (PUBLIC_FILE.test(pathname) || EXCLUDED_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Check if the pathname already starts with a locale
  const pathnameLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale) {
    // Valid locale in URL - set cookie and continue
    const response = NextResponse.next()
    response.cookies.set('NEXT_LOCALE', pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
    return response
  }

  // No locale in URL - determine the preferred locale
  let locale: string = defaultLocale

  // 1. Check cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isValidLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    // 2. Check Accept-Language header
    const acceptLanguage = request.headers.get('accept-language')
    locale = detectLanguageFromHeader(acceptLanguage)
  }

  // Redirect to localized URL
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`
  
  const response = NextResponse.redirect(url)
  response.cookies.set('NEXT_LOCALE', locale, {
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  })
  return response
}

export const config = {
  // Match all paths except static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|workflows/|images/|spy-logo|.*\\..*).*)'],
}
