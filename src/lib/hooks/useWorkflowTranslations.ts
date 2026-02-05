'use client'

import { useState, useEffect } from 'react'
import { Locale } from '../i18n'

export interface WorkflowTranslations {
  [key: string]: string
}

/**
 * React hook to fetch workflow translations from API
 * Falls back to provided default translations if fetch fails
 */
export function useWorkflowTranslations(
  workflowSlug: string,
  locale: Locale,
  fallbackTranslations: WorkflowTranslations = {}
) {
  const [translations, setTranslations] = useState<WorkflowTranslations>(fallbackTranslations)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTranslations() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/translations/${workflowSlug}/${locale}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch translations: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.translations && Object.keys(data.translations).length > 0) {
          setTranslations(data.translations)
        } else {
          // Use fallback if no translations found
          setTranslations(fallbackTranslations)
        }
      } catch (err) {
        console.warn(`[useWorkflowTranslations] Error fetching ${workflowSlug}/${locale}:`, err)
        setError(err instanceof Error ? err.message : 'Unknown error')
        // Use fallback on error
        setTranslations(fallbackTranslations)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranslations()
  }, [workflowSlug, locale]) // Note: fallbackTranslations intentionally not in deps

  /**
   * Get a translated string by key, with fallback
   */
  const t = (key: string, fallback?: string): string => {
    return translations[key] ?? fallback ?? key
  }

  return {
    translations,
    t,
    isLoading,
    error,
    title: translations['__title__'] ?? '',
    description: translations['__description__'] ?? ''
  }
}
