import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function SitooPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('sitoo-pos', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {article?.title || 'Sitoo POS'}
        </div>
        <h1>{article?.title || 'Sitoo POS Integration'}</h1>
        <p>{article?.description || t.sitooPageDesc}</p>
      </div>
      {article?.content ? (
        <div 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      ) : (
        <div className="iframe-wrapper">
          <iframe
            src={`/workflows/sitoo-workflow.html?lang=${locale}`}
            title="Sitoo POS Workflow"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </>
  )
}
