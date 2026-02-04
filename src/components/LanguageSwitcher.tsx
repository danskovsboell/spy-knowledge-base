'use client'

import { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { type Locale, languages, getLanguageConfig } from '../lib/i18n'

interface LanguageSwitcherProps {
  lang: Locale
}

export default function LanguageSwitcher({ lang }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const current = getLanguageConfig(lang)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLanguage(newLang: Locale) {
    // Replace current lang prefix in pathname
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`)
    
    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=${60 * 60 * 24 * 365}`
    
    router.push(newPath)
    setIsOpen(false)
  }

  return (
    <div ref={ref} className="lang-switcher">
      <button 
        className="lang-switcher-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="lang-flag">{current.flag}</span>
        <span className="lang-code">{lang.toUpperCase()}</span>
        <span className="lang-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      
      {isOpen && (
        <div className="lang-dropdown">
          {languages.map(language => (
            <button
              key={language.code}
              className={`lang-option ${language.code === lang ? 'active' : ''}`}
              onClick={() => switchLanguage(language.code)}
            >
              <span className="lang-flag">{language.flag}</span>
              <span className="lang-name">{language.nativeName}</span>
              {language.code === lang && <span className="lang-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
