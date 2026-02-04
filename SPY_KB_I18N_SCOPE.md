# SPY Knowledge Base – i18n Scope Document

**Projekt:** Flersproget Knowledge Base med database og AI-oversættelse
**Dato:** 4. februar 2026
**Repo:** github.com/danskovsboell/spy-knowledge-base
**Live:** spy-knowledge-base.vercel.app
**Status:** Nuværende = statisk Next.js, ingen i18n, ingen database

---

## 1. Projektmål

Opgradere SPY Knowledge Base fra statisk hardcoded indhold til en database-drevet, flersproget platform med automatisk AI-oversættelse.

**Nøglekrav:**
- Database-backed indhold (Supabase/PostgreSQL)
- 9 sprog: DA, EN, DE, NL, FR, IT, ES, SV, NO (samme som spysystem_site)
- Automatisk oversættelse via OpenAI GPT-5-mini ved nyt/ændret indhold
- Sprogdetektion via browser + cookie
- Oversættelses-dashboard til statusoverblik
- Skalerbart til 100+ artikler og flere sprog

---

## 2. Nuværende Tilstand

### Knowledge Base (spy-knowledge-base)
- **Framework:** Next.js (App Router, TypeScript, Tailwind)
- **Indhold:** 5 hardcoded guides (Ongoing, Sitoo, NemEDI, Lector, Dedication)
- **Workflows:** Statiske HTML-filer i `/public/workflows/`
- **Auth:** Password-beskyttet (AuthGuard)
- **Database:** Ingen
- **i18n:** Ingen
- **Sprog:** Kun dansk

### SPY System Site (spysystem_site) – reference
- **Har allerede:** 9-sproget i18n med `[lang]` routing
- **Middleware:** Cookie-baseret sprogpersistering (`NEXT_LOCALE`)
- **Detektion:** `Accept-Language` header parsing
- **UI-tekster:** TypeScript translations object
- **Kan genbruges:** i18n config, middleware-mønster, sprogdetektion

---

## 3. Teknisk Arkitektur

### 3.1 Database Schema (Supabase/PostgreSQL)

```sql
-- Understøttede sprog
CREATE TABLE languages (
  code VARCHAR(5) PRIMARY KEY,     -- 'da', 'en', 'nl', etc.
  name VARCHAR(50) NOT NULL,        -- 'Danish'
  native_name VARCHAR(50) NOT NULL, -- 'Dansk'
  flag VARCHAR(10) NOT NULL,        -- '🇩🇰'
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Artikler (sprog-uafhængig metadata)
CREATE TABLE kb_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(255) UNIQUE NOT NULL,  -- 'ongoing-wms'
  category VARCHAR(100) NOT NULL,      -- 'integration', 'feature', 'guide'
  icon VARCHAR(10),                    -- '📦'
  image_url VARCHAR(500),
  badge VARCHAR(100),
  badge_color VARCHAR(20),
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  source_language VARCHAR(5) DEFAULT 'da' REFERENCES languages(code),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Oversættelser (indhold per sprog)
CREATE TABLE kb_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  content TEXT,                        -- Markdown/HTML indhold
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'auto_translated', 'reviewed', 'published', 'outdated'
  translated_by VARCHAR(50),           -- 'gpt-5-mini', 'human', etc.
  translated_at TIMESTAMPTZ,
  reviewed_by VARCHAR(100),
  reviewed_at TIMESTAMPTZ,
  source_hash VARCHAR(64),            -- SHA-256 af kildetekst (til outdated-detection)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(article_id, language_code)
);

-- UI-oversættelser (knapper, labels, navigation)
CREATE TABLE ui_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) NOT NULL,           -- 'nav.home', 'search.placeholder'
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, language_code)
);

-- Oversættelsesjobs (tracking)
CREATE TABLE translation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES kb_articles(id),
  source_language VARCHAR(5) NOT NULL,
  target_language VARCHAR(5) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'failed'
  model VARCHAR(50) DEFAULT 'gpt-5-mini',
  tokens_used INTEGER,
  cost_usd DECIMAL(10,6),
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Glossary (konsistente fagtermer)
CREATE TABLE glossary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term VARCHAR(255) NOT NULL,          -- 'Dedication'
  language_code VARCHAR(5) NOT NULL REFERENCES languages(code),
  translation VARCHAR(255) NOT NULL,   -- 'Reservering' (da), 'Reservation' (en)
  context TEXT,                         -- 'SPY feature for pre-allocating stock'
  UNIQUE(term, language_code)
);

-- Indexes
CREATE INDEX idx_translations_article ON kb_translations(article_id);
CREATE INDEX idx_translations_lang ON kb_translations(language_code);
CREATE INDEX idx_translations_status ON kb_translations(status);
CREATE INDEX idx_jobs_status ON translation_jobs(status);
CREATE INDEX idx_articles_category ON kb_articles(category);
CREATE INDEX idx_articles_slug ON kb_articles(slug);
```

### 3.2 URL-struktur

```
/da/                          ← Dansk forside
/en/                          ← Engelsk forside
/nl/integrations/ongoing      ← Hollandsk Ongoing guide
/de/features/dedication       ← Tysk Dedication guide
```

**Fallback-kæde:** Valgt sprog → EN → DA

### 3.3 Sprogdetektion (Next.js Middleware)

```
1. URL har sprog-prefix (/nl/...) → brug det, gem i cookie
2. Cookie 'NEXT_LOCALE' eksisterer → redirect til det sprog
3. Accept-Language header → match mod understøttede sprog
4. Default → 'da' (dansk)
```

Genbruger mønster fra spysystem_site middleware.

### 3.4 Auto-oversættelse Pipeline

```
Bruger gemmer artikel (DA)
        ↓
Next.js API Route: /api/translate
        ↓
For hvert aktivt sprog ≠ source:
  1. Hent glossary-termer for målsprog
  2. Kald OpenAI GPT-5-mini med:
     - System prompt med SPY-kontekst + glossary
     - Kildeartikel (DA)
     - Målsprog
  3. Gem oversættelse med status 'auto_translated'
  4. Log job i translation_jobs
        ↓
Dashboard viser: ✅ Oversat | ⚠️ Auto (ikke reviewed) | ❌ Mangler
```

**Trigger:** API route kaldt efter save (ikke cron – real-time)
**Retry:** 3 forsøg med exponential backoff ved fejl
**Batch:** Ved initial migration bruges OpenAI Batch API (50% billigere)

### 3.5 OpenAI Oversættelsesprompt

```
System: Du er en professionel oversætter for SPY System – et ERP-system 
til tekstil- og modebranchen. Oversæt præcist og bevare tekniske termer.

Glossary (brug disse termer konsekvent):
{glossary_terms}

Regler:
- Bevar markdown-formatering
- Oversæt IKKE SPY-specifikke navne (SPY, Ongoing, Sitoo, NemEDI, Lector)
- Bevar kodeblokke og tekniske identifiers
- Brug formelt sprog passende for professionel dokumentation
- Output KUN oversættelsen, ingen forklaringer

Oversæt følgende fra {source_lang} til {target_lang}:
```

**Model:** GPT-5-mini (pris TBD – GPT-4.1-mini var $0.40/$1.60 per 1M tokens)

### 3.6 Outdated Detection

Når en kildeartikel opdateres:
1. Beregn SHA-256 hash af nyt indhold
2. Sammenlign med `source_hash` i oversættelser
3. Mismatch → marker som `status: 'outdated'`
4. Trigger auto-oversættelse for outdated sprog
5. Dashboard viser ⚠️ for outdated artikler

---

## 4. Komponenter & Sider

### 4.1 Bruger-facing
- **Sprogvælger** – dropdown/flags i header (gem i cookie)
- **Artikelside** – henter indhold fra DB baseret på slug + sprog
- **Fallback-banner** – "Denne artikel er endnu ikke oversat til dit sprog" med link til EN/DA
- **Søgning** – sprog-specifik søgning i oversatte titler/beskrivelser

### 4.2 Admin/Dashboard
- **Oversættelsesoversigt** – matrix: artikler × sprog med status-ikoner
- **Artikel-editor** – skriv indhold (markdown), preview, gem → auto-translate
- **Glossary-manager** – tilføj/rediger fagtermer per sprog
- **Job-monitor** – oversættelsesjobs med status, tokens, cost
- **Sprog-manager** – aktiver/deaktiver sprog

---

## 5. Migration fra Nuværende

### Fase 1: Database Setup
1. Opret Supabase-tabeller (schema ovenfor)
2. Seed languages-tabel med 9 sprog
3. Migrer eksisterende 5 guides til `kb_articles` + `kb_translations` (DA)

### Fase 2: i18n Routing
4. Tilføj `[lang]` routing (kopiér mønster fra spysystem_site)
5. Implementér middleware med sprogdetektion + cookie
6. Tilføj sprogvælger i Header

### Fase 3: Database Integration
7. Erstatte hardcoded GuideCards med DB-hentning
8. Artikelside henter indhold fra `kb_translations`
9. Fallback-logik når oversættelse mangler

### Fase 4: Auto-oversættelse
10. API route `/api/translate` med OpenAI GPT-5-mini
11. Glossary-tabel med SPY-termer
12. Auto-translate trigger ved article save
13. Outdated detection ved kilde-ændring

### Fase 5: Admin Dashboard
14. Oversættelsesoversigt (matrix view)
15. Inline review/approve workflow
16. Job monitor + cost tracking

### Fase 6: Initial Oversættelse
17. Batch-oversæt alle 5 eksisterende artikler til 8 sprog
18. Review og godkend oversættelser
19. Go live med flersproget site

---

## 6. Tech Stack

| Komponent | Teknologi |
|---|---|
| Frontend | Next.js 14+ (App Router, TypeScript) |
| Styling | Tailwind CSS + SPY theme tokens |
| Database | Supabase (PostgreSQL) |
| Auth | Existing password auth (AuthGuard) |
| i18n Routing | Next.js `[lang]` dynamic segments |
| Sprogdetektion | Middleware (cookie + Accept-Language) |
| Oversættelse | OpenAI GPT-5-mini |
| Content Format | Markdown (react-markdown, allerede i deps) |
| Hosting | Vercel (allerede sat op) |
| CI/CD | Vercel auto-deploy fra GitHub main |

---

## 7. Estimeret Omkostning

### OpenAI Oversættelse
- ~5 artikler × 8 sprog × ~2000 tokens = ~80.000 tokens initial
- Ved 100 artikler: ~1.6M tokens = ca. $1-3 (GPT-5-mini pricing TBD)
- Løbende: ~$1-2/måned ved 10-20 nye/opdaterede artikler

### Supabase
- Free tier dækker rigeligt (500MB database, 50K API calls/måned)

### Vercel
- Allerede på Pro plan – ingen ekstra omkostning

**Total ekstra løbende: ~$2-5/måned**

---

## 8. Succeskriterier

- [ ] Alle eksisterende guides tilgængelige på 9 sprog
- [ ] Ny artikel automatisk oversat til alle aktive sprog inden 60 sekunder
- [ ] Outdated oversættelser automatisk detekteret og markeret
- [ ] Sprogvælger virker + husker valg via cookie
- [ ] Browser-sprog detekteres automatisk ved første besøg
- [ ] Dashboard viser komplet oversættelsesstatus
- [ ] Glossary sikrer konsistente fagtermer
- [ ] Performance: sidehentning < 500ms (Supabase edge)

---

*Udarbejdet af Nova – SPY AI Assistant · 4. februar 2026*
