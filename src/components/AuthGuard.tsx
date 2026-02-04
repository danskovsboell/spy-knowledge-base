'use client'

import { useEffect, useState } from 'react'
import { isAuthenticated } from '../lib/auth'
import LoginPage from '../app/login/LoginPage'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null)

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
        background: '#1a1a2e',
      }}>
        <div style={{ color: '#ffffff', fontSize: 16 }}>Indlæser...</div>
      </div>
    )
  }

  if (!authed) {
    return <LoginPage onSuccess={() => setAuthed(true)} />
  }

  return <>{children}</>
}
