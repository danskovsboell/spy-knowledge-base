# SPY Knowledge Base i18n – Implementation Plan

**Based on:** SPY_KB_I18N_SCOPE.md
**Approach:** 6 faser, 23 steps, inkrementel implementering

---

## Fase 1: Database Setup [Complexity: M]

### Step 1.1: Supabase Dependencies (S)
- **Action:** Install `@supabase/supabase-js`
- **File:** `package.json`
- **Command:** `npm install @supabase/supabase-js`

### Step 1.2: Supabase Client Config (S)
- **Create:** `src/lib/supabase.ts`
- **Content:** Supabase client with env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- **Create:** `.env.local` with Supabase credentials
- **Deps:** Step 1.1

### Step 1.3: Database Schema (M)
- **Create:** `supabase/migrations/001_i18n_schema.sql`
- **Content:** All tables from scope (languages, kb_articles, kb_translations, ui_translations, translation_jobs, glossary)
- **Action:** Run migration via Supabase Dashboard or CLI
- **Deps:** Step 1.2

### Step 1.4: Seed Languages (S)
- **Create:** `supabase/seed/languages.sql`
- **Content:** INSERT 9 languages (da, en, de, nl, fr, it, es, sv, no)
- **Deps:** Step 1.3

### Step 1.5: Migrate Existing Content (M)
- **Create:** `scripts/migrate-content.ts`
- **Action:** Script that:
  1. Creates kb_articles entries for 5 existing guides (ongoing, sitoo, nemedi, lector, dedication)
  2. Extracts content from existing HTML workflow files
  3. Inserts as kb_translations with language_code='da', status='published'
- **Deps:** Step 1.4

---

## Fase 2: i18n Routing [Complexity: M]

### Step 2.1: i18n Config (S)
- **Create:** `src/lib/i18n.ts`
- **Content:** Copy language config from spysystem_site (languages array, languageConfig, detectLanguageFromHeader)
- **Reference:** `/tmp/spysystem_fix/src/lib/i18n.ts`

### Step 2.2: Middleware (M)
- **Create:** `src/middleware.ts`
- **Content:** Language detection middleware:
  1. Check URL for lang prefix → use it, set cookie
  2. Check NEXT_LOCALE cookie → redirect
  3. Check Accept-Language header → redirect
  4. Default to 'da'
- **Reference:** `/tmp/spysystem_fix/src/middleware.ts`
- **Deps:** Step 2.1

### Step 2.3: Convert to [lang] Routing (M)
- **Move:** `src/app/page.tsx` → `src/app/[lang]/page.tsx`
- **Move:** `src/app/layout.tsx` → `src/app/[lang]/layout.tsx`
- **Create:** `src/app/page.tsx` (root redirect based on middleware)
- **Update:** All page components to accept `params.lang`
- **Update:** `src/app/globals.css` stays in place
- **Deps:** Step 2.2

### Step 2.4: Language Switcher Component (S)
- **Create:** `src/components/LanguageSwitcher.tsx`
- **Content:** Dropdown/flag selector, changes URL prefix + sets cookie
- **Update:** `src/components/Header.tsx` to include LanguageSwitcher
- **Deps:** Step 2.3

### Step 2.5: UI Translations (S)
- **Create:** `src/lib/translations.ts`
- **Content:** UI strings for all 9 languages (nav, search, buttons, etc.)
- **Update:** All components to use translated strings based on current lang
- **Deps:** Step 2.3

---

## Fase 3: Database Integration [Complexity: L]

### Step 3.1: Data Fetching Layer (M)
- **Create:** `src/lib/api/articles.ts`
- **Content:** Functions:
  - `getArticles(lang)` – list all published articles with translations
  - `getArticle(slug, lang)` – single article with translation + fallback
  - `getCategories(lang)` – unique categories
- **Deps:** Steps 1.5, 2.3

### Step 3.2: Dynamic Home Page (M)
- **Update:** `src/app/[lang]/page.tsx`
- **Content:** Fetch articles from DB, render GuideCards dynamically (not hardcoded)
- **Keep:** Same visual design, just data source changes
- **Deps:** Step 3.1

### Step 3.3: Dynamic Article Page (L)
- **Create:** `src/app/[lang]/[category]/[slug]/page.tsx`
- **Content:** Fetch article + translation from DB, render with react-markdown
- **Include:** Fallback banner when translation missing
- **Include:** Language-specific metadata (title, description)
- **Deps:** Step 3.1

### Step 3.4: Fallback Logic (S)
- **Update:** `src/lib/api/articles.ts`
- **Content:** When translation missing for requested lang:
  1. Try English (en)
  2. Try Danish (da)
  3. Show "not translated" banner with original language
- **Deps:** Step 3.3

---

## Fase 4: Auto-oversættelse [Complexity: L]

### Step 4.1: OpenAI Client (S)
- **Install:** `openai` npm package
- **Create:** `src/lib/openai.ts`
- **Content:** OpenAI client config with API key from env
- **Update:** `.env.local` with OPENAI_API_KEY

### Step 4.2: Translation Service (L)
- **Create:** `src/lib/services/translation.ts`
- **Content:**
  - `translateArticle(articleId, sourceLang, targetLang)` – translate single article
  - `translateAllLanguages(articleId)` – translate to all active languages
  - `buildTranslationPrompt(content, sourceLang, targetLang, glossary)` – prompt builder
  - Retry logic (3 attempts, exponential backoff)
  - Token counting + cost logging
- **Deps:** Step 4.1

### Step 4.3: Glossary Service (S)
- **Create:** `src/lib/services/glossary.ts`
- **Content:** Fetch glossary terms for target language, inject into translation prompt
- **Deps:** Step 1.3

### Step 4.4: Translation API Route (M)
- **Create:** `src/app/api/translate/route.ts`
- **Content:** POST endpoint that:
  1. Receives article_id + target languages
  2. Creates translation_jobs
  3. Calls translation service
  4. Updates kb_translations with results
  5. Logs job completion/failure
- **Security:** Require auth token or admin session
- **Deps:** Steps 4.2, 4.3

### Step 4.5: Outdated Detection (M)
- **Create:** `src/lib/services/outdated.ts`
- **Content:**
  - `computeContentHash(content)` – SHA-256
  - `markOutdated(articleId)` – compare source hash, mark translations as 'outdated'
  - `triggerRetranslation(articleId)` – auto-translate outdated translations
- **Deps:** Step 4.4

---

## Fase 5: Admin Dashboard [Complexity: L]

### Step 5.1: Admin Layout (M)
- **Create:** `src/app/[lang]/admin/layout.tsx`
- **Content:** Admin-only layout with sidebar nav (Overview, Articles, Glossary, Jobs)
- **Security:** Additional admin auth check

### Step 5.2: Translation Overview (L)
- **Create:** `src/app/[lang]/admin/page.tsx`
- **Content:** Matrix view: articles × languages with status icons (✅⚠️❌)
- **Include:** Filter by category, status, language
- **Include:** Quick actions (translate, mark reviewed)
- **Deps:** Steps 3.1, 4.4

### Step 5.3: Article Editor (L)
- **Create:** `src/app/[lang]/admin/articles/[id]/page.tsx`
- **Content:**
  - Markdown editor for source content
  - Preview panel
  - "Save & Translate" button → triggers auto-translation
  - Side-by-side view: source vs translation per language
- **Deps:** Step 5.2

### Step 5.4: Glossary Manager (M)
- **Create:** `src/app/[lang]/admin/glossary/page.tsx`
- **Content:** CRUD for glossary terms, organized by language
- **Deps:** Step 4.3

### Step 5.5: Job Monitor (S)
- **Create:** `src/app/[lang]/admin/jobs/page.tsx`
- **Content:** List of translation jobs with status, tokens, cost, timestamps
- **Deps:** Step 4.4

---

## Fase 6: Initial Oversættelse & Go-live [Complexity: M]

### Step 6.1: Seed Glossary (S)
- **Create:** `supabase/seed/glossary.sql`
- **Content:** SPY-specific terms (Dedication, Claims, Style Statistics, etc.) in all 9 languages
- **Deps:** Step 4.3

### Step 6.2: Batch Translate Existing Content (M)
- **Create:** `scripts/batch-translate.ts`
- **Content:** Script that translates all 5 articles to 8 languages using OpenAI Batch API
- **Deps:** Steps 4.2, 6.1

### Step 6.3: Review & Publish (S)
- **Action:** Review auto-translations, mark as 'published'
- **Tool:** Admin dashboard (Step 5.2)
- **Deps:** Steps 5.2, 6.2

### Step 6.4: Final Testing (M)
- **Checklist:**
  - [ ] All 5 articles × 9 languages accessible
  - [ ] Language switcher works + saves cookie
  - [ ] Auto-detect from browser language
  - [ ] Fallback to EN/DA when translation missing
  - [ ] New article → auto-translate within 60s
  - [ ] Edit article → outdated detection works
  - [ ] Admin dashboard shows correct statuses
  - [ ] Performance < 500ms per page load
- **Deps:** All previous steps

---

## Implementation Order (Critical Path)

```
1.1 → 1.2 → 1.3 → 1.4 → 1.5
                              ↘
2.1 → 2.2 → 2.3 → 2.4        → 3.1 → 3.2 → 3.3 → 3.4
              ↗    → 2.5                              ↓
                                4.1 → 4.2 → 4.4 → 4.5
                                       ↗
                                4.3 ──┘
                                                    ↓
                                5.1 → 5.2 → 5.3
                                      5.4    5.5
                                                    ↓
                                6.1 → 6.2 → 6.3 → 6.4
```

**Parallel tracks possible:**
- Fase 1 + Fase 2 can run in parallel (merge at Fase 3)
- Steps 5.4 and 5.5 can run in parallel
- Steps 2.4 and 2.5 can run in parallel

---

## Estimated Total Effort

| Fase | Steps | Complexity | Est. Time |
|------|-------|-----------|-----------|
| 1. Database Setup | 5 | M | 2-3 hours |
| 2. i18n Routing | 5 | M | 2-3 hours |
| 3. DB Integration | 4 | L | 3-4 hours |
| 4. Auto-translation | 5 | L | 3-4 hours |
| 5. Admin Dashboard | 5 | L | 4-6 hours |
| 6. Go-live | 4 | M | 2-3 hours |
| **Total** | **28** | | **16-23 hours** |

---

*Plan created by Nova – 4. februar 2026*
