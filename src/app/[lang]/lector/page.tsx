import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function LectorPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {t.lectorTitle}
        </div>
        <h1>Lector Customs Integration</h1>
        <p>{t.lectorPageDesc}</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src="/workflows/lector-customs-workflow.html"
          title="Lector Customs Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
