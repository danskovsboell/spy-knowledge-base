import { type Locale } from '../../../lib/i18n'
import { getReturnsT } from './returns-translations'
import ReturnsContent from './ReturnsContent'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function ReturnsPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getReturnsT(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>Overview</a> → Workflows → {t.pageTitle}
        </div>
        <h1>{t.pageTitle}</h1>
        <p>{t.pageDesc}</p>
      </div>
      <ReturnsContent lang={locale} />
    </>
  )
}
