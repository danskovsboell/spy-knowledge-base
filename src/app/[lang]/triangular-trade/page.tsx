import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'
import TriangularTradeContent from './TriangularTradeContent'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function TriangularTradePage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('triangular-trade', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionFunctions} → {article?.title || 'Trekantshandel'}
        </div>
        <h1>{article?.title || 'Trekantshandel'}</h1>
        <p>{article?.description || ''}</p>
      </div>
      <TriangularTradeContent lang={locale} />
    </>
  )
}
