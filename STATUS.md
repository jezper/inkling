# STATUS.md — Projektstatus

> Läs FÖRST vid varje session.

## Övergripande status
**Fas:** 14 av 15 steg klara. Kvar: Deploy (avvaktar)
**Senast uppdaterad:** 2026-03-15

## Arbetsordning

| # | Steg | Status |
|---|------|--------|
| 1 | Scaffold Next.js + Tailwind | ✅ |
| 2 | Landing page | ✅ |
| 3 | PDF-parsing + PII-stripping | ✅ |
| 4 | Consent-steg | ✅ |
| 5 | Claude API + arbetsrättsprompt | ✅ |
| 6 | Resultatvy + paywall | ✅ |
| 7 | Stripe Checkout | ✅ |
| 8 | Email (Resend) | ✅ |
| 9 | PDF-export | ✅ |
| 10 | SEO-sidor | ✅ |
| 11 | Referral-system | ✅ |
| 12 | Plausible analytics | — (skippad) |
| 13 | WCAG-audit | ✅ |
| 14 | Responsiv-test | ✅ |
| 15 | Deploy | ⬜ |

## Senaste session
**2026-03-15 — Landing page layout: centrerad komposition (Product Designer)**

Hero omskriven till centrerad layout. Chapter label borttagen. Header centrerad. Pris-grid och CTA centrerade. `min-h-dvh` ersatt med tight padding. Vertikal dekorationslinje borttagen. HowItWorks-rubrik centrerad.

**Ändrade filer:**
- `src/components/hero.tsx` — Centrerad layout, borttagen chapter label och dekorationslinje, `min-h-dvh` → tight padding
- `src/components/header.tsx` — Logo centrerad via `justify-center`
- `src/components/how-it-works.tsx` — Section-rubrik "Process" centrerad

---

## Senaste session (föregående)
**2026-03-15 — Visuell redesign av full-report (Product Designer)**

Rapporten omstrukturerad med distinkt visuell identitet per sektion. Filtermekanism för flaggor tillagd. "Nästa steg" omdöpt och omformaterat.

**Ändrade filer:**
- `src/components/full-report.tsx` — Ny GranskningLista-komponent med pill-filter (>5 flaggor), BandHeading för sekundära sektioner, alternerade bakgrundsfärger per sektion, ResourceChip ersätter ResourceGroup-kort, TipsRow ersätter NästaStegCard, "Nästa steg" → "Värt att tänka på"

---

## Tidigare session
**2026-03-15 — Unified granskningslista i full-report (UX Designer)**

Informationsarkitekturen för rapporten omarbetad. Styrkor och flaggor presenteras nu i ett sammanhängande flöde under en gemensam "Granskning"-sektion.

**Ändrade filer:**
- `src/components/full-report.tsx` — FlagSection ersatt med FlagGroup + StyrkaCard. Räknarrad tillagd. ThumbsUp → CheckCircle2 i importer.

**Tidigare session:**
**2026-03-15 — SEO-sidor (steg 10)**

ArticleLayout-komponent + fem SEO-sidor byggda.

**Skapade filer:**
- `src/components/article-layout.tsx` — Delad layout för alla artikelsidor: TOC-sidebar (desktop), TOC-accordion (mobil), InlineCTA, RelatedPages, Breadcrumb, prose-typografi via style-inject
- `src/lib/seo-pages.ts` — Delad sidkatalog + `getRelatedPages()`-hjälpfunktion
- `src/app/regler/las/page.tsx`
- `src/app/regler/provanstallning/page.tsx`
- `src/app/guide/konkurrensklausul/page.tsx`
- `src/app/guide/uppsagningstid/page.tsx`
- `src/app/guide/granska-anstallningsavtal/page.tsx`
- `src/app/regler/page.tsx` — Indexsida för /regler
- `src/app/guide/page.tsx` — Indexsida för /guide

**Designbeslut dokumenterade i BESLUT.md:**
- Sidebar höger (inte vänster) — ögonrörelse-motiverat
- Dubbel CTA-strategi: sticky sidebar + inline vid ~45% av artikeln
- Prose via `.article-prose`-klass, style-inject — håller sidkomponenter rena
- Lagcitat via blockquote + cite i JetBrains Mono
- law-box för "inkling kontrollerar"-avsnitt

---

## Tidigare session
**2026-03-15 — Rapportsida + Stripe + delbar länk + PDF**

Total refaktorering av betald vy. Rapport visas nu på egen sida `/rapport`.

**Skapade filer:**
- `src/lib/stripe.ts` — Stripe SDK-singleton (server-side)
- `src/lib/report-token.ts` — AES-256-GCM + zlib: krypterad delbar rapportlänk (30 dagar)
- `src/app/api/checkout/route.ts` — POST: Stripe Checkout Session
- `src/app/api/checkout/verify/route.ts` — GET: verifierar betalstatus
- `src/app/api/rapport/token/route.ts` — POST: skapar krypterad delbar länk
- `src/app/rapport/page.tsx` — Server Component: dekrypterar token eller renderar client-shell
- `src/components/full-report.tsx` — Hel rapportsida: alla findings synliga, grupperade efter allvarlighet

**Ändrade filer:**
- `src/components/analysis-flow.tsx` — Paywall → Stripe redirect. Omgranskning → auto-redirect till /rapport.
- `src/app/api/checkout/route.ts` — Stripe redirectar till /rapport (inte landing page)
- `src/app/globals.css` — @media print, .hidden-mobile
- `.env.local` — Stripe-nycklar, STRIPE_PRICE_ID, REPORT_SECRET

**Arkitektur:**
- Stripe → redirect till `/rapport?session_id=cs_xxx`
- Rapport verifierar betalning → visar allt från sessionStorage
- "Spara länk" → POST /api/rapport/token → krypterad URL giltig 30 dagar
- "PDF" → window.print() med print-stylesheet
- "Ny version" → spara previous i sessionStorage → /#upload → auto-redirect till /rapport
- Hög-flaggor öppna som default, medel/info stängda
- Marknadsjämförelse som tabell (inte kort)
- Gratis-vyn visar allvarligaste flaggan (matchar "Snabbkoll"-löftet)
- Hero: processlinje ersätter pricing-boxar (sekvens istf val)
- Hero copy uppdaterad (outcomes-fokuserad undertext + privacyrad)

## Senaste session (tillägg)
**2026-03-15 — WCAG 2.2 AAA-audit och rättningar**

Fullständig tillgänglighetsgranskning av hela kodbasen. Alla kritiska och allvarliga fynd åtgärdade direkt.

**Rättade filer:**
- `src/app/globals.css` — nytt `--color-accent-text: #A82E14` (AAA-säker accent), uppdaterade severity/status-ikonfärger, `--color-text-muted` mörkad, `sr-only`-klass, `scroll-behavior` i reduced-motion, `.btn-accent` hover-transform skyddad
- `src/app/layout.tsx` — `className="dark"` borttagen (falsk context)
- `src/app/page.tsx` — `<main>`-landmark tillagd
- `src/components/logo.tsx` — "ink" använder `--color-accent-text` istf `--color-accent-500`
- `src/components/header.tsx` — länkfärg och underline åtgärdat
- `src/components/hero.tsx` — accent-textfärg, muted-textfärger
- `src/components/how-it-works.tsx` — "Process" `<p>` → `<h2>`, accent- och muted-textfärger
- `src/components/footer.tsx` — textfärg, underline på länk
- `src/components/analysis-flow.tsx` — accent/subtle-textfärger, nav med aria-label, flag-knappar med aria-label, min-touch-targets, AnalyzingOverlay role/aria-live
- `src/components/upload-step.tsx` — subtle-textfärger
- `src/components/full-report.tsx` — `<h1>` i rapport-header, `SectionHeading` → `<h2>`, `FlagCard` aria-expanded+aria-controls, `ActionButton` aria-label+min-touch, accent-textfärger, back-link underline

**Kvarstående (se PROBLEM.md):**
- Focus ring kontrast (AA men ej AAA)
- Fokustrapfångst i AnalyzingOverlay
- 2-kolumns grid reflow vid 200% zoom
- `--color-text-subtle` är AA men ej AAA (används enbart dekorativt)

## Senaste session (tillägg)
**2026-03-15 — SEO-innehåll: fem sidor skrivna**

Copywriter-agent producerade komplett innehåll för alla fem planerade SEO-sidor.

**Skapade filer:**
- `src/content/seo/las.ts` — /regler/las
- `src/content/seo/provanstallning.ts` — /regler/provanstallning
- `src/content/seo/konkurrensklausul.ts` — /guide/konkurrensklausul
- `src/content/seo/uppsagningstid.ts` — /guide/uppsagningstid
- `src/content/seo/granska-anstallningsavtal.ts` — /guide/granska-anstallningsavtal

Varje fil innehåller: title (≤60 tecken), description (≤155 tecken), h1, intro, sections med heading+content, factbox/tabell, disclaimer (tre platser uppfyllda via per-sida-disclaimer), cta_text och related-slugs.

**Nästa steg för UI Developer:** Bygga Next.js-sidor som konsumerar content-filerna. Slugs är definierade och redo.

**Förbättringsförslag loggat i BESLUT.md:** Tonalitetsregeln "max 20 ord" behöver undantag för redaktionellt innehåll.

## Senaste session (tillägg)
**2026-03-15 — Responsiv-granskning (steg 14)**

Fullständig genomgång mot 320/375/768/1024/1440px. Alla identifierade problem åtgärdade.

**Ändrade filer:**
- `src/app/globals.css` — Ny CSS: `.hero-price-grid` (responsiv 2-kolonner → 1-kolonn under 400px), `.comparison-grid-2col` (staplad under 480px), `.analysis-flow-inner` (responsiv padding), `.report-content-inner` (responsiv padding), `.report-action-bar` (responsiv padding). Responsive artikel-grid-padding.
- `src/components/hero.tsx` — `px-4 sm:px-6` (reducerat mobilmarginaler). Pris-grid använder nu `.hero-price-grid` + `.hero-price-separator` CSS-klasser. Separator-arrow roteras 90° på mobil. `gridTemplateColumns` borttagen från inline style.
- `src/components/header.tsx` — CTA-länk: `minHeight: 44px`, `display: inline-flex`, `alignItems: center`, `padding: 0 0.25rem` (44px touch target).
- `src/components/footer.tsx` — `px-4 sm:px-6`. Layout ändrad från 4-kolumns flex (kraschar vid 640px) till `sm:grid-cols-2` + `lg:flex lg:flex-row`. Copyright-kolonn `lg:text-right` (var `sm:text-right`).
- `src/components/analysis-flow.tsx` — Marknadsjämförelse-grid och Avtal-vs-lag-grid: `.comparison-grid-2col`-klass. Section-wrapper: klassad `.analysis-flow-inner`.
- `src/components/upload-step.tsx` — Drop-zon padding: `3rem 2rem` → `2rem 1.25rem` (minskat vertikalt och horisontellt för smal skärm).
- `src/components/full-report.tsx` — Tabell (marknadsjämförelse): insvept i `overflowX: auto` + `minWidth: 480px` (horisontell scroll, ingen overflow). Avtal-vs-lag-grid: `.comparison-grid-2col`. Action bar: klassad `.report-action-bar`. Report-content: klassad `.report-content-inner`.
- `src/components/article-layout.tsx` — MobileTOC-knapp: `minHeight: 44px`. TOC-länkar: `padding: 0.5rem` (upp från 0.3125rem) + `minHeight: 44px`. Artikel-grid: mobilpadding reducerad till `1.5rem 1rem 3rem`, tablet `2rem 1.5rem 3.5rem`, desktop `3rem 1.5rem 4rem`.

**Problem som kvarstår (PROBLEM.md):**
- Fokustrapfångst i AnalyzingOverlay (pre-existing)
- Focus ring kontrast (pre-existing)

## Blockerare
- Resend-nyckel behövs för steg 8.
- `npm install` måste köras för att pdfjs-dist + worker ska finnas på plats.
