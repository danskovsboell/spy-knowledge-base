import { redirect } from 'next/navigation'
import { defaultLocale } from '../lib/i18n'

// Root page redirects to default locale
// The middleware should handle this, but this is a fallback
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
