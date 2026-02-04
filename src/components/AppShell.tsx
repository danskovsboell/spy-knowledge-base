'use client'

import { useState } from 'react'
import AuthGuard from './AuthGuard'
import Header from './Header'
import Sidebar from './Sidebar'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AuthGuard>
      <div className="app-layout">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </AuthGuard>
  )
}
