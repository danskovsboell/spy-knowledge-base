import { locales, isValidLocale, type Locale } from '../../lib/i18n'
import AppShell from '../../components/AppShell'
import { notFound } from 'next/navigation'

interface LangLayoutProps {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}

export function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export default async function LangLayout({ children, params }: LangLayoutProps) {
  const { lang } = await params
  
  if (!isValidLocale(lang)) {
    notFound()
  }

  return (
    <div lang={lang}>
      <AppShell lang={lang as Locale}>{children}</AppShell>
    </div>
  )
}
