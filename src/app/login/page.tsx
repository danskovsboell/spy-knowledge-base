'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '../../lib/auth'

export default function LoginRoute() {
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/')
    }
  }, [router])

  // AuthGuard in layout handles the login UI
  return null
}
