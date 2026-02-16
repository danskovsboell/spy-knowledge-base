# SPY Knowledge Base – Claude Code Guide

## Projekt
SPY Knowledge Base – internt workflow/guide-site for SPY medarbejdere (modebranchen).
- **Tech:** Next.js + Supabase + Vercel
- **Sprog:** Dansk (primær), engelsk, hollandsk
- **Live:** https://spy-knowledge-base.vercel.app (password: Spy2010!)
- **Repo:** github.com/danskovsboell/spy-knowledge-base

## Sprogbrug (KRITISK)
- **Klart, normalt dansk** – som man taler i modebranchen
- **INGEN jura-termer, tech-jargon eller akademisk sprog** uden forklaring
- **IKKE børnesprog** – bare almindeligt dansk
- Målgruppe: SPY supportere og sælgere, IKKE udviklere

## Ny artikel – step-by-step

### 1. Workflow HTML (det visuelle)
Alle artikler bruger **interaktive workflow HTML-sider** i `public/workflows/`.

**BRUG ALTID en eksisterende som template** – f.eks. `nemedi-workflow.html`:
- Copy hele filen som udgangspunkt
- Behold AL CSS (SPY gold/black theme, hover-effekter, responsive)
- Behold React-komponenterne: `FlowBox`, `Arrow`, `DocCard`, `ScenarioCard`
- Behold i18n-pattern: `window.i18n.initI18n('slug')` + `t()` funktioner
- Tilpas indhold og sektioner

**Vigtige design-elementer:**
- Flow-bokse med pile og farver (blå=ekstern, guld=SPY, grøn=kunde, rød=fejl, lilla=kvittering)
- Scenario-cards (success/warning/error) med farvekodede kanter
- Overblikstabeller
- Info-boxes og tip-boxes
- Kodestruktur-visning (for tekniske artikler)
- Legend/farveforklaring i toppen
- Footer med "Genereret af Nova | SPY ApS | dato"

**Navngivning:** `{emne}-workflow.html`

### 2. Page route (Next.js)
Opret `src/app/[lang]/{slug}/page.tsx`:

```tsx
import { type Locale } from '../../../lib/i18n'
import { getTranslations } from '../../../lib/translations'
import { getArticle } from '../../../lib/articles'

interface PageProps {
  params: Promise<{ lang: string }>
}

export default async function MyPage({ params }: PageProps) {
  const { lang } = await params
  const locale = lang as Locale
  const t = getTranslations(locale)
  const article = await getArticle('my-slug', locale)

  return (
    <>
      <div className="page-header">
        <div className="page-breadcrumb">
          <a href={`/${locale}`}>{t.breadcrumbOverview}</a> → {t.sectionIntegrations} → {article?.title || 'Titel'}
        </div>
        <h1>{article?.title || 'Titel'}</h1>
        <p>{article?.description || 'Beskrivelse'}</p>
      </div>
      {article?.content ? (
        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
      ) : (
        <div className="iframe-wrapper">
          <iframe
            src={`/workflows/my-workflow.html?lang=${locale}`}
            title="My Workflow"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </>
  )
}
```

### 3. Sidebar
Tilføj link i `src/components/Sidebar.tsx` under korrekt sektion.

### 4. i18n
Workflow HTML bruger `window.i18n.initI18n('workflow-slug')` fra `public/workflows/i18n.js`.
- Skriv ALTID dansk tekst direkte i HTML'en (det er primary)
- i18n.js henter oversættelser fra Supabase automatisk
- Tilføj slug-mapping i i18n.js hvis nødvendigt

## SPY Kodebase
Når du skal beskrive SPY-funktionalitet:
- **Kig ALTID i koden først** – `/home/clawdbot/dev/1.ds.spysystem.dk`
- **Gæt ALDRIG** om hvordan systemet virker
- Beskriv hvad koden gør i klart sprog

## Fil-struktur
```
src/
  app/[lang]/          ← Side-routes (en mappe per artikel)
  components/          ← Sidebar, Layout osv.
  lib/                 ← articles.ts, i18n.ts, translations.ts, supabase.ts
public/
  workflows/           ← Interaktive workflow HTML-sider
  images/              ← Logoer og billeder
```

## Git
- Branch: master
- Auto-deploy via Vercel på push
- Brug `git -c safe.directory=/home/clawdbot/dev/spy-knowledge-base` prefix
- Commit message: beskriv hvad artiklen dækker

### 5. Artikel-registrering i articles.ts (VIGTIG!)
Ny artikel SKAL tilføjes i `src/lib/articles.ts`:
- Tilføj entry i `HARDCODED_ARTICLES` med slug, category, icon, titles, descriptions
- Tilføj slug i `SLUG_TO_ROUTE` og `ROUTE_TO_SLUG` mappings
- **Uden dette vises artiklen IKKE på startsiden** – kun i sidebar-menuen!

### 6. Ikoner
- Brug ÉT emoji-ikon per artikel – aldrig to emojis sammen (ser dobbelt ud i sidebar)
- Vælg et ikon der passer til emnet

## Kvalitetstjek
Før commit, verificér:
- [ ] HTML følger samme stil som nemedi-workflow.html
- [ ] Dansk tekst er klart og modebranchen-venligt
- [ ] Flow-bokse, pile og farver bruges korrekt
- [ ] Responsive (ser godt ud på mobil)
- [ ] i18n-slug er korrekt
- [ ] Sidebar er opdateret
- [ ] **Artikel registreret i articles.ts** (HARDCODED_ARTICLES + route mappings)
- [ ] **Startsiden viser artiklen** (den henter fra articles.ts)
- [ ] **Kun ét ikon** per menu-punkt
