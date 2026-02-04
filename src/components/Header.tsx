'use client'

import Link from 'next/link'

interface HeaderProps {
  onToggleSidebar: () => void
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="mobile-toggle" onClick={onToggleSidebar} aria-label="Toggle menu">
        ☰
      </button>
      <Link href="/" className="header-logo">
        <span>SPY</span>
        Knowledge Base
      </Link>
    </header>
  )
}
