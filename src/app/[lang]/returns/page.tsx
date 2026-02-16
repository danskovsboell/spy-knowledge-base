import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function ReturnsPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  const titles: Record<string, string> = {
    da: 'Returneringer i SPY',
    en: 'Returns in SPY',
    nl: 'Retouren in SPY',
  }
  const descs: Record<string, string> = {
    da: 'Sådan håndterer SPY returneringer fra Shopify, eksterne lagre og NemEDI.',
    en: 'How SPY handles returns from Shopify, external warehouses and NemEDI.',
    nl: 'Hoe SPY retouren afhandelt via Shopify, externe magazijnen en NemEDI.',
  }

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.navFunctions} → {titles[locale] || titles.da}
        </div>
        <h1>{titles[locale] || titles.da}</h1>
        <p>{descs[locale] || descs.da}</p>
      </div>
      <div className="iframe-wrapper">
        <iframe
          src={`/workflows/returns-workflow.html?lang=${locale}`}
          title="Returns Workflow"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </>
  )
}
