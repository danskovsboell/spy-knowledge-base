import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function OngoingPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {t.ongoingTitle}
        </div>
        <h1>Ongoing WMS Integration</h1>
        <p>{t.ongoingPageDesc}</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/ongoing-workflow.html"
          title="Ongoing WMS Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
