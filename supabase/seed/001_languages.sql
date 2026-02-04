INSERT INTO languages (code, name, native_name, flag, is_active, sort_order) VALUES
('da', 'Danish', 'Dansk', '🇩🇰', true, 1),
('en', 'English', 'English', '🇬🇧', true, 2),
('de', 'German', 'Deutsch', '🇩🇪', true, 3),
('nl', 'Dutch', 'Nederlands', '🇳🇱', true, 4),
('fr', 'French', 'Français', '🇫🇷', true, 5),
('it', 'Italian', 'Italiano', '🇮🇹', true, 6),
('es', 'Spanish', 'Español', '🇪🇸', true, 7),
('sv', 'Swedish', 'Svenska', '🇸🇪', true, 8),
('no', 'Norwegian', 'Norsk', '🇳🇴', true, 9)
ON CONFLICT (code) DO NOTHING;
