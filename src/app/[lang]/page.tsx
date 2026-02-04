import { type Locale } from '../../lib/i18n'
import { getTranslations } from '../../lib/translations'
import { getArticles, getRouteForSlug } from '../../lib/articles'
import GuideCard from '../../components/GuideCard'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

// Badge color to background color mapping
function badgeBg(color: string): string {
  const map: Record<string, string> = {
    '#3498db': 'rgba(52, 152, 219, 0.12)',
    '#27ae60': 'rgba(39, 174, 96, 0.12)',
    '#e67e22': 'rgba(230, 126, 34, 0.12)',
    '#9b59b6': 'rgba(155, 89, 182, 0.12)',
    '#c9a227': 'rgba(201, 162, 39, 0.12)',
  }
  return map[color] || 'rgba(201, 162, 39, 0.12)'
}

function iconBg(color: string): string {
  const map: Record<string, string> = {
    '#3498db': 'rgba(52, 152, 219, 0.15)',
    '#27ae60': 'rgba(39, 174, 96, 0.15)',
    '#e67e22': 'rgba(230, 126, 34, 0.15)',
    '#9b59b6': 'rgba(155, 89, 182, 0.15)',
    '#c9a227': 'rgba(201, 162, 39, 0.15)',
  }
  return map[color] || 'rgba(201, 162, 39, 0.15)'
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  
  // Fetch articles from database (with fallback to hardcoded)
  const articles = await getArticles(locale)
  
  const integrations = articles.filter(a => a.category === 'Integration')
  const features = articles.filter(a => a.category === 'Feature')

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1>{t.welcomeTitle}</h1>
        <p>{t.welcomeDescription}</p>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="welcome-stat-num">{integrations.length}</div>
            <div className="welcome-stat-label">{t.integrationWorkflows}</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">{features.length}</div>
            <div className="welcome-stat-label">{t.functionGuides}</div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="section-title">{t.sectionIntegrations}</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        {integrations.map(article => (
          <GuideCard
            key={article.slug}
            href={`/${locale}/${getRouteForSlug(article.slug)}`}
            title={article.title}
            description={article.description}
            category={t.categoryIntegration}
            icon={article.icon}
            iconBg={iconBg(article.badgeColor)}
            imageSrc={article.imageUrl || undefined}
            badge={article.badge}
            badgeColor={article.badgeColor}
            badgeBg={badgeBg(article.badgeColor)}
          />
        ))}
      </div>

      {/* Functions */}
      <div className="section-title">{t.sectionFunctions}</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        {features.map(article => (
          <GuideCard
            key={article.slug}
            href={`/${locale}/${getRouteForSlug(article.slug)}`}
            title={article.title}
            description={article.description}
            category={t.categoryFunction}
            icon={article.icon}
            iconBg={iconBg(article.badgeColor)}
            imageSrc={article.imageUrl || undefined}
            badge={article.badge}
            badgeColor={article.badgeColor}
            badgeBg={badgeBg(article.badgeColor)}
          />
        ))}
      </div>
    </>
  )
}
