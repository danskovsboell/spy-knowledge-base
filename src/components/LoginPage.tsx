'use client'

import { useState, FormEvent } from 'react'
import { type Locale } from '../lib/i18n'
import { getTranslations } from '../lib/translations'
import { checkPassword, setAuthenticated } from '../lib/auth'

interface LoginPageProps {
  lang: Locale
  onSuccess: () => void
}

export default function LoginPage({ lang, onSuccess }: LoginPageProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const t = getTranslations(lang)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (checkPassword(password)) {
      setAuthenticated()
      onSuccess()
    } else {
      setError(t.loginError)
      setPassword('')
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1>{t.loginTitle}</h1>
        <p>{t.loginSubtitle}</p>
        {error && <div className="login-error">{error}</div>}
        <input
          className="login-input"
          type="password"
          placeholder={t.loginPlaceholder}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        <button className="login-btn" type="submit">
          {t.loginButton}
        </button>
        <p style={{ fontSize: 12, color: '#666666', marginTop: 24 }}>
          {t.loginFooter}
        </p>
      </form>
    </div>
  )
}
