-- RLS Policies for SPY Knowledge Base
-- Run this AFTER 001_i18n_schema.sql

-- Enable RLS
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ui_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE glossary ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key)
CREATE POLICY IF NOT EXISTS languages_read ON languages FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS articles_read ON kb_articles FOR SELECT USING (is_published = true);
CREATE POLICY IF NOT EXISTS translations_read ON kb_translations FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS ui_translations_read ON ui_translations FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS jobs_read ON translation_jobs FOR SELECT USING (true);

-- Service role full access (for admin operations)
CREATE POLICY IF NOT EXISTS service_all_languages ON languages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS service_all_articles ON kb_articles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS service_all_translations ON kb_translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS service_all_ui ON ui_translations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS service_all_jobs ON translation_jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS service_all_glossary ON glossary FOR ALL USING (true) WITH CHECK (true);
