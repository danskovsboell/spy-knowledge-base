import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'
import VatRepresentationContent from './VatRepresentationContent'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function VatRepresentationPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('vat-representation', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionFunctions} → {article?.title || 'VAT-repræsentation'}
        </div>
        <h1>{article?.title || 'VAT-repræsentation'}</h1>
        <p>{article?.description || ''}</p>
      </div>
      <VatRepresentationContent lang={locale} />
    </>
  )
}
