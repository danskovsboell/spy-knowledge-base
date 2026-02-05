import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import LandingpageBuilderContent from './LandingpageBuilderContent'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function LandingpageBuilderPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionFunctions} → B2B Landingpage Builder
        </div>
        <h1>B2B Landingpage Builder</h1>
        <p>Create stunning B2B frontpages with drag & drop – no coding required</p>
      </div>
      <LandingpageBuilderContent lang={locale} />
    </>
  )
}
