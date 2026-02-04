'use client'

import Link from 'next/link'
import Image from 'next/image'

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
        <Image
          src="/spy-logo-black.jpg"
          alt="SPY"
          width={120}
          height={45}
          style={{ height: '45px', width: 'auto', filter: 'invert(1)', mixBlendMode: 'screen' }}
          priority
        />
        <span style={{ fontSize: '0.75rem', opacity: 0.7, marginLeft: '8px', alignSelf: 'flex-end', marginBottom: '2px' }}>
          Knowledge Base
        </span>
      </Link>
    </header>
  )
}
