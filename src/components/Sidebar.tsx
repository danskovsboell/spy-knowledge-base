'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type Locale } from '../lib/i18n'
import { getTranslations } from '../lib/translations'

interface SidebarProps {
  lang: Locale
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ lang, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const t = getTranslations(lang)

  const navItems = [
    {
      section: t.navOverview,
      items: [
        { href: `/${lang}`, label: t.navHome, icon: '📊' },
      ],
    },
    {
      section: t.navIntegrations,
      items: [
        { href: `/${lang}/ongoing`, label: t.ongoingTitle, icon: '📦' },
        { href: `/${lang}/sitoo`, label: t.sitooTitle, icon: '🏪' },
        { href: `/${lang}/nemedi`, label: t.nemediTitle, icon: '📄' },
        { href: `/${lang}/lector`, label: t.lectorTitle, icon: '🛃' },
      ],
    },
    {
      section: t.navFunctions,
      items: [
        { href: `/${lang}/dedication`, label: t.dedicationTitle, icon: '🎯' },
        { href: `/${lang}/triangular-trade`, label: t.triangularTradeTitle, icon: '🔺' },
      ],
    },
  ]

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {navItems.map((group) => (
          <div key={group.section} className="sidebar-section">
            <div className="sidebar-section-title">{group.section}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
                onClick={onClose}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </aside>
    </>
  )
}
