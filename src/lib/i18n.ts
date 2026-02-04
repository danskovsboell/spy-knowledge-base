// i18n configuration for SPY Knowledge Base

export const defaultLocale = 'da'

export const locales = ['da', 'en', 'de', 'nl', 'fr', 'it', 'es', 'sv', 'no'] as const

export type Locale = (typeof locales)[number]

export interface LanguageConfig {
  code: Locale
  name: string
  nativeName: string
  flag: string
}

export const languages: LanguageConfig[] = [
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}

export function getLanguageConfig(locale: Locale): LanguageConfig {
  return languages.find(l => l.code === locale) || languages[0]
}

/**
 * Detect preferred language from Accept-Language header
 */
export function detectLanguageFromHeader(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header: "da,en-US;q=0.9,en;q=0.8,de;q=0.7"
  const parts = acceptLanguage.split(',').map(part => {
    const [lang, qPart] = part.trim().split(';')
    const q = qPart ? parseFloat(qPart.split('=')[1]) : 1
    return { lang: lang.trim().split('-')[0].toLowerCase(), q }
  })

  // Sort by quality factor
  parts.sort((a, b) => b.q - a.q)

  // Find first matching locale
  for (const { lang } of parts) {
    if (isValidLocale(lang)) return lang
    // Map Norwegian Bokmål to our 'no'
    if (lang === 'nb' || lang === 'nn') return 'no'
  }

  return defaultLocale
}
