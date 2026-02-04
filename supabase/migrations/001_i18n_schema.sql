-- Supported languages
CREATE TABLE languages (
  code VARCHAR(5) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  native_name VARCHAR(50) NOT NULL,
  flag VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Articles (language-independent metadata)
CREATE TABLE kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  image_url VARCHAR(500),
  badge VARCHAR(100),
  badge_color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  source_language VARCHAR(5) DEFAULT 'da' REFERENCES languages(code),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Translations (content per language)
CREATE TABLE kb_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  translated_by VARCHAR(50),
  translated_at TIMESTAMPTZ,
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  source_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(article_id, language_code)
);

-- UI translations
CREATE TABLE ui_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Translation jobs (tracking)
CREATE TABLE translation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES kb_articles(id),
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  model VARCHAR(50) DEFAULT 'gpt-5-mini',
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Glossary
CREATE TABLE glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term VARCHAR(255) NOT NULL,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  translation VARCHAR(255) NOT NULL,
  context TEXT,
  UNIQUE(term, language_code)
);

-- Indexes
CREATE INDEX idx_translations_article ON kb_translations(article_id);
CREATE INDEX idx_translations_lang ON kb_translations(language_code);
CREATE INDEX idx_translations_status ON kb_translations(status);
CREATE INDEX idx_jobs_status ON translation_jobs(status);
CREATE INDEX idx_articles_category ON kb_articles(category);
CREATE INDEX idx_articles_slug ON kb_articles(slug);
