import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function LectorPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('lector-customs', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {article?.title || 'Lector Customs'}
        </div>
        <h1>{article?.title || 'Lector Customs Integration'}</h1>
        <p>{article?.description || t.lectorPageDesc}</p>
      </div>
      {article?.content ? (
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="iframe-wrapper">
          <iframe
            src={`/workflows/lector-customs-workflow.html?lang=${locale}`}
            title="Lector Customs Workflow"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </>
  )
}
