'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  {
    section: '🏠 Oversigt',
    items: [
      { href: '/', label: 'Startside', icon: '📊' },
    ],
  },
  {
    section: '🔌 Integrationer',
    items: [
      { href: '/ongoing', label: 'Ongoing WMS', icon: '📦' },
      { href: '/sitoo', label: 'Sitoo POS', icon: '🏪' },
      { href: '/nemedi', label: 'NemEDI', icon: '📄' },
      { href: '/lector', label: 'Lector Customs', icon: '🛃' },
    ],
  },
  {
    section: '⚙️ Funktioner',
    items: [
      { href: '/dedication', label: 'Dedication / Reservering', icon: '🎯' },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

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
