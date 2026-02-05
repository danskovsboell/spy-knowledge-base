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

### 2. 🔲 Kode læser fra database
**Filer der skal opdateres:**
- `src/lib/translations.ts` → hent fra Supabase i stedet for hardkodet
- `src/components/` → brug DB-oversættelser
- Fallback til hardkodet hvis DB fejler

**Estimat:** 1-2 timer

### 3. 🔲 Opdater oversættelsesscript
**Fil:** `scripts/translate-single-workflow.mjs`
- [ ] Skift model fra `gpt-4o-mini` → `gpt-5-mini`
- [ ] Tilføj automatisk upsert til Supabase kb_translations
- [ ] Test med én workflow

**Estimat:** 30 min

### 4. 🔲 Auto-oversættelse ved nyt indhold
- [ ] API endpoint: `/api/admin/translate`
- [ ] Trigger automatisk når artikel gemmes
- [ ] Retry med exponential backoff ved fejl

**Estimat:** 1-2 timer

### 5. 🔲 Outdated detection
- [ ] SHA-256 hash af kildetekst
- [ ] Sammenlign ved opdatering
- [ ] Marker som 'outdated' ved mismatch
- [ ] Auto-trigger re-oversættelse

**Estimat:** 1 time

### 6. 🔲 Admin oversættelsesdashboard (optional)
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
