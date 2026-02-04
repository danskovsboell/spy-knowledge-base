'use client'

import { useEffect, useState } from 'react'
import { type Locale } from '../lib/i18n'
import { getTranslations } from '../lib/translations'
import { isAuthenticated } from '../lib/auth'
import LoginPage from './LoginPage'

interface AuthGuardProps {
  children: React.ReactNode
  lang: Locale
}

export default function AuthGuard({ children, lang }: AuthGuardProps) {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const t = getTranslations(lang)

  useEffect(() => {
    setAuthed(isAuthenticated())
  }, [])

  // Loading state
  if (authed === null) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0d0d0d',
      }}>
        <div style={{ color: '#c9a227', fontSize: 16, fontFamily: "'Raleway', sans-serif" }}>{t.loading}</div>
      </div>
    )
  }

  if (!authed) {
    return <LoginPage lang={lang} onSuccess={() => setAuthed(true)} />
  }

  return <>{children}</>
}
