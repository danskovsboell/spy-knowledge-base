-- Seed articles (language-independent metadata)
INSERT INTO kb_articles (slug, category, icon, image_url, badge, badge_color, sort_order, is_published, source_language)
VALUES
  ('ongoing-wms', 'Integration', '📦', '/images/ongoing.svg', 'Interaktiv workflow', '#3498db', 1, true, 'da'),
  ('sitoo-pos', 'Integration', '🏪', '/images/sitoo.png', 'Interaktiv workflow', '#27ae60', 2, true, 'da'),
  ('nemedi', 'Integration', '📄', '/images/nemedi.png', 'Interaktiv workflow', '#e67e22', 3, true, 'da'),
  ('lector-customs', 'Integration', '🛃', '/images/lector.png', 'Interaktiv workflow', '#9b59b6', 4, true, 'da'),
  ('dedication', 'Feature', '🎯', NULL, 'Interaktiv guide', '#c9a227', 5, true, 'da')
ON CONFLICT (slug) DO NOTHING;

-- Seed Danish translations for existing articles
INSERT INTO kb_translations (article_id, language_code, title, description, status, translated_by)
SELECT a.id, 'da', t.title, t.description, 'published', 'system'
FROM kb_articles a
JOIN (VALUES
  ('ongoing-wms', 'Ongoing WMS', 'Komplet workflow for Ongoing WMS integration – ordrer, webhooks, statuser og fejlhåndtering.'),
  ('sitoo-pos', 'Sitoo POS', 'Workflow for Sitoo POS integration – butikssalg, lagersynkronisering og produktdata.'),
  ('nemedi', 'NemEDI', 'EDI dokumentflow for NemEDI integration – PRICAT, ordrer og leveringsadviser.'),
  ('lector-customs', 'Lector Customs', 'Told/customs workflow for Lector integration – toldbehandling, HS-koder og dokumentation.'),
  ('dedication', 'Dedication / Reservering', 'Guide til Pre-Dedication funktionaliteten – fordeling af varer mellem Stock og Pre ordrer.')
) AS t(slug, title, description) ON a.slug = t.slug
ON CONFLICT (article_id, language_code) DO NOTHING;
