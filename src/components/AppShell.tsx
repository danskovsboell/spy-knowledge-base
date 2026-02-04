'use client'

import { useState } from 'react'
import { type Locale } from '../lib/i18n'
import AuthGuard from './AuthGuard'
import Header from './Header'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
  lang: Locale
}

export default function AppShell({ children, lang }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard lang={lang}>
      <div className="app-layout">
        <Header lang={lang} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar lang={lang} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
