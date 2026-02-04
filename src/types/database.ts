// Database types for SPY Knowledge Base i18n

export interface Language {
  code: string
  name: string
  native_name: string
  flag: string
  is_active: boolean
  sort_order: number
}

export interface KBArticle {
  id: string
  slug: string
  category: string
  icon: string | null
  image_url: string | null
  badge: string | null
  badge_color: string | null
  sort_order: number
  is_published: boolean
  source_language: string
  created_at: string
  updated_at: string
}

export interface KBTranslation {
  id: string
  article_id: string
  language_code: string
  title: string
  description: string | null
  content: string | null
  status: 'draft' | 'pending' | 'translated' | 'reviewed' | 'published'
  translated_by: string | null
  translated_at: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  source_hash: string | null
  created_at: string
  updated_at: string
}

export interface UITranslation {
  id: string
  key: string
  language_code: string
  value: string
  created_at: string
  updated_at: string
}

export interface TranslationJob {
  id: string
  article_id: string | null
  source_language: string
  target_language: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model: string
  tokens_used: number | null
  cost_usd: number | null
  error_message: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

export interface Glossary {
  id: string
  term: string
  language_code: string
  translation: string
  context: string | null
}

// Joined types for convenience
export interface ArticleWithTranslation extends KBArticle {
  translation: KBTranslation
}

export interface ArticleWithAllTranslations extends KBArticle {
  translations: KBTranslation[]
}
