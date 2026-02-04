'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { isAuthenticated } from '../../../lib/auth'

export default function LoginRoute() {
  const router = useRouter()
  const params = useParams()
  const lang = params.lang || 'da'

  useEffect(() => {
    if (isAuthenticated()) {
      router.push(`/${lang}`)
    }
  }, [router, lang])

  // AuthGuard in layout handles the login UI
  return null
}
