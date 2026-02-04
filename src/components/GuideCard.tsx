import Link from 'next/link'

interface GuideCardProps {
  href: string
  title: string
  description: string
  category: string
  icon: string
  iconBg: string
  badge?: string
  badgeColor?: string
  badgeBg?: string
  imageSrc?: string
}

export default function GuideCard({
  href, title, description, category, icon, iconBg,
  badge, badgeColor, badgeBg, imageSrc,
}: GuideCardProps) {
  return (
    <Link href={href} className="guide-card">
      <div className="guide-card-header">
        <div className="guide-card-icon" style={{ background: iconBg }}>
          {imageSrc ? (
            <img src={imageSrc} alt={title} />
          ) : (
            <span>{icon}</span>
          )}
        </div>
        <div>
          <div className="guide-card-category">{category}</div>
          <div className="guide-card-title">{title}</div>
        </div>
      </div>
      <div className="guide-card-desc">{description}</div>
      {badge && (
        <div
          className="guide-card-badge"
          style={{ background: badgeBg || '#ebf5fb', color: badgeColor || '#337ab7' }}
        >
          {badge}
        </div>
      )}
    </Link>
  )
}
