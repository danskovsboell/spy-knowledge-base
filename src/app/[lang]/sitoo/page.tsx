import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function SitooPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {t.sitooTitle}
        </div>
        <h1>Sitoo POS Integration</h1>
        <p>{t.sitooPageDesc}</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/sitoo-workflow.html"
          title="Sitoo POS Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
