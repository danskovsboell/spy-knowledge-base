import { type Locale } from '../../lib/i18n'
import { getTranslations } from '../../lib/translations'
import GuideCard from '../../components/GuideCard'

interface HomePageProps {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <h1>{t.welcomeTitle}</h1>
        <p>{t.welcomeDescription}</p>
        <div className="welcome-stats">
          <div className="welcome-stat">
            <div className="welcome-stat-num">4</div>
            <div className="welcome-stat-label">{t.integrationWorkflows.split(' ').join('<br/>')}</div>
          </div>
          <div className="welcome-stat">
            <div className="welcome-stat-num">1</div>
            <div className="welcome-stat-label">{t.functionGuides.split(' ').join('<br/>')}</div>
          </div>
        </div>
      </div>

      {/* Integrations */}
      <div className="section-title">{t.sectionIntegrations}</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        <GuideCard
          href={`/${locale}/ongoing`}
          title={t.ongoingTitle}
          description={t.ongoingDesc}
          category={t.categoryIntegration}
          icon="📦"
          iconBg="rgba(52, 152, 219, 0.15)"
          imageSrc="/images/ongoing.svg"
          badge={t.interactiveWorkflow}
          badgeColor="#3498db"
          badgeBg="rgba(52, 152, 219, 0.12)"
        />
        <GuideCard
          href={`/${locale}/sitoo`}
          title={t.sitooTitle}
          description={t.sitooDesc}
          category={t.categoryIntegration}
          icon="🏪"
          iconBg="rgba(39, 174, 96, 0.15)"
          imageSrc="/images/sitoo.png"
          badge={t.interactiveWorkflow}
          badgeColor="#27ae60"
          badgeBg="rgba(39, 174, 96, 0.12)"
        />
        <GuideCard
          href={`/${locale}/nemedi`}
          title={t.nemediTitle}
          description={t.nemediDesc}
          category={t.categoryIntegration}
          icon="📄"
          iconBg="rgba(230, 126, 34, 0.15)"
          imageSrc="/images/nemedi.png"
          badge={t.interactiveWorkflow}
          badgeColor="#e67e22"
          badgeBg="rgba(230, 126, 34, 0.12)"
        />
        <GuideCard
          href={`/${locale}/lector`}
          title={t.lectorTitle}
          description={t.lectorDesc}
          category={t.categoryIntegration}
          icon="🛃"
          iconBg="rgba(155, 89, 182, 0.15)"
          imageSrc="/images/lector.png"
          badge={t.interactiveWorkflow}
          badgeColor="#9b59b6"
          badgeBg="rgba(155, 89, 182, 0.12)"
        />
      </div>

      {/* Functions */}
      <div className="section-title">{t.sectionFunctions}</div>
      <div className="guide-grid" style={{ marginBottom: 32 }}>
        <GuideCard
          href={`/${locale}/dedication`}
          title={t.dedicationTitle}
          description={t.dedicationDesc}
          category={t.categoryFunction}
          icon="🎯"
          iconBg="rgba(201, 162, 39, 0.15)"
          badge={t.interactiveGuide}
          badgeColor="#c9a227"
          badgeBg="rgba(201, 162, 39, 0.12)"
        />
      </div>
    </>
  )
}
