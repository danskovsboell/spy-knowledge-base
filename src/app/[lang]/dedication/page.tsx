import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'
import DedicationContent from './DedicationContent'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function DedicationPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('dedication', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionFunctions} → {article?.title || 'Dedication'}
        </div>
        <h1>{article?.title || t.dedicationTitle}</h1>
        <p>{article?.description || t.dedicationPageDesc}</p>
      </div>
      <DedicationContent />
    </>
  )
}
