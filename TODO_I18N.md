# SPY Knowledge Base – i18n TODO

**Oprettet:** 5. februar 2026
**Status:** LÅST - klar til udvikling
**Model:** gpt-5-mini
**Udvikling:** Claude Code anbefales

---

## Opgaver (prioriteret rækkefølge)

### 1. ✅ Database & Oversættelser (DONE)
- [x] Supabase schema oprettet
- [x] 41 oversættelser i kb_translations (5 workflows × 9 sprog)
- [x] Dansk tekst matcher original

### 2. ✅ Kode læser fra database (DONE)
**Nye filer:**
- `src/lib/services/translation-service.ts` → henter fra Supabase med caching
- `src/lib/hooks/useWorkflowTranslations.ts` → React hook
- `src/app/api/translations/[slug]/[locale]/route.ts` → API endpoint
- Fallback til hardkodet hvis DB fejler ✅

### 3. ✅ Opdater oversættelsesscript (DONE)
**Fil:** `scripts/translate-single-workflow.mjs`
- [x] Skift model fra `gpt-4o-mini` → `gpt-5-mini`
- [ ] Tilføj automatisk upsert til Supabase (brug API i stedet)

### 4. ✅ Auto-oversættelse ved nyt indhold (DONE)
**Endpoint:** `/api/admin/translate`
- [x] POST med articleId, sourceLocale, content, title, description
- [x] Oversætter til alle 8 sprog via gpt-5-mini
- [x] Upsert direkte til Supabase kb_translations
- [x] Returnerer status per sprog

### 5. ✅ Outdated detection (DONE)
**Endpoint:** `/api/admin/check-outdated`
- [x] SHA-256 hash af kildetekst (source_hash)
- [x] GET: List alle outdated oversættelser
- [x] POST: Marker specifikke som outdated

### 6. ✅ Workflow HTML i18n (DONE)
- [x] i18n.js helper library med DOM translation
- [x] Export translations fra Supabase til JSON filer
- [x] ongoing-workflow.html bruger i18n
- [x] sitoo-workflow.html bruger i18n  
- [x] lector-customs-workflow.html bruger i18n
- [x] nemedi-workflow.html (havde allerede inline i18n)

### 7. 🔲 Admin oversættelsesdashboard (optional)
- [ ] Matrix view: artikler × sprog
- [ ] Status-ikoner: ✅ Oversat | ⚠️ Auto | ❌ Mangler | 🔄 Outdated
- [ ] One-click re-translate

**Estimat:** 2-3 timer

---

## Tekniske noter

### Supabase credentials
```
Se .env.local for credentials
```

### OpenAI model
```
Model: gpt-5-mini
API key: OPENAI_API_KEY env var
```

### Database tabel
```sql
SELECT * FROM kb_translations;
-- Kolonner: id, article_id, language_code, title, description, content, status, translated_by, translated_at
```

---

## Udviklingsstrategi

**Anbefalet:** Brug Claude Code for:
- Sikker refaktorering af translations.ts
- Test af Supabase integration
- Konsistent kodestruktur

**Kommando:**
```bash
cd /home/clawdbot/clawd/spy-knowledge-base
# Start Claude Code session her
```

---

*Låst af Nova – 5. februar 2026*
