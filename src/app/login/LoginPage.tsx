'use client'

import { useState, FormEvent } from 'react'
import { checkPassword, setAuthenticated } from '../../lib/auth'

interface LoginPageProps {
  onSuccess: () => void
}

export default function LoginPage({ onSuccess }: LoginPageProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (checkPassword(password)) {
      setAuthenticated()
      onSuccess()
    } else {
      setError('Forkert adgangskode. Prøv igen.')
      setPassword('')
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h1>SPY Knowledge Base</h1>
        <p>Indtast adgangskode for at fortsætte</p>
        {error && <div className="login-error">{error}</div>}
        <input
          className="login-input"
          type="password"
          placeholder="Adgangskode"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoFocus
        />
        <button className="login-btn" type="submit">
          Log ind →
        </button>
        <p style={{ fontSize: 12, color: '#666666', marginTop: 24 }}>
          Kun for SPY-medarbejdere
        </p>
      </form>
    </div>
  )
}
