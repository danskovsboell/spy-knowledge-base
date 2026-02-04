'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const params = useParams()
  const lang = params.lang as string

  const navItems = [
    { href: `/${lang}/admin`, label: 'Overview', icon: '📊' },
    { href: `/${lang}/admin/glossary`, label: 'Glossary', icon: '📖' },
    { href: `/${lang}/admin/jobs`, label: 'Jobs', icon: '⚡' },
  ]

  return (
    <div className="admin-layout">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${pathname === item.href ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <Link href={`/${lang}`} className="admin-nav-link admin-nav-back">
            ← Back to KB
          </Link>
        </nav>
      </div>
      <div className="admin-content">
        {children}
      </div>
    </div>
  )
}
