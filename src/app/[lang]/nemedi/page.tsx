import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function NemediPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {t.nemediTitle}
        </div>
        <h1>NemEDI Integration</h1>
        <p>{t.nemediPageDesc}</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/nemedi-workflow.html"
          title="NemEDI Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
