# STATUS.md — Projektstatus

> Läs FÖRST vid varje session.

## Övergripande status
**Fas:** V1 LANSERAD — alla 15 steg klara
**Senast uppdaterad:** 2026-04-01

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
| 15 | Deploy | ✅ |

## Senaste session
**2026-04-01/02 — V1 LANSERAD**

Allt från gauge-feature till produktionsdeploy. kollaavtalet.nu är live.

**Nya features:**
- Visuell helhetsbedömning (tre-segments gauge med labels)
- Rate limiting (Vercel KV-backad, 4 endpoints)
- Säkerhetsheaders (CSP, HSTS, X-Frame-Options via middleware)
- Email-redesign: mobilanpassad kvittomall + rapport-PDF-bilaga
- Korta rapportlänkar i email (/r/[id] via KV)
- CTA-knapp i email istället för rå URL
- Villkor-sida (/villkor)
- Stripe promotion codes aktiverade
- ESLint config för CI

**Legal audit (11 fynd åtgärdade):**
- Ansvarsbegränsning med beloppstak (49 kr)
- Ångerrätt: rätt lagrum (16 § konsumentavtalslagen)
- Disclaimers: "automatiserad, inte granskad av människa" överallt
- Disclaimer synlig i PDF-export
- Integritetspolicy: fullständig identitet + rättslig grund Stripe/Resend
- Anti-injection i systemprompt + kollektivavtalsvarning
- Momsreg.nr till env var

**Buggfixar:**
- Betalningslås rensas vid ny uppladdning (förhindrar gratis omanalys)
- CSP: Tesseract.js OCR tillåten (cdn.jsdelivr.net)
- PDF-fonts: built-in Helvetica istället för 404:ande Google Fonts URLs

**Deploy & infrastruktur:**
- Domän: kollaavtalet.nu (Loopia DNS → Vercel)
- Stripe: live-produkt (49 kr), promotion codes
- Resend: domän verifierad, from-adress hej@kollaavtalet.nu
- E-postvidarebefordring via Loopia
- Google Search Console + Bing Webmaster Tools verifierade

**Domänreferenser:** kollaavtalet.com → kollaavtalet.nu överallt

**Kvarstår (post-V1):**
- Artikel 30-register (internt GDPR-dokument, inte kod)
- Ångerrätt-samtycke i checkout-flödet (checkbox före betalning)
- Plausible analytics (skippad i V1)

---

**Tidigare session:**

**1. Visuell helhetsbedömning (gauge)**
Tre-segments bar (grön/orange/röd) med labels. Ersätter färgade textrutor i gratisvy och rapport. Visuell feedback ledde till labels + vänsterjustering.

**2. Rate limiting + säkerhetsheaders**
In-memory rate limiter ersatt med Vercel KV-backad lösning (in-memory fallback). Rate limiting på /api/analyze (5/h), email (10/h), checkout (10/h), refund (5/h). Middleware med CSP, HSTS, X-Frame-Options etc.

**3. Email-redesign: kvitto + rapport-PDF**
Mejlet omskrivet till minimal kvittomall (lagkrav förenklad faktura). Avtalsrapporten bifogas som PDF genererad med @react-pdf/renderer. Klienten skickar sessionId som kvittonummer.

**Ändrade filer:**
- `src/components/overall-gauge.tsx` (ny) — Gauge-komponent
- `src/lib/report-pdf.tsx` (ny) — @react-pdf/renderer Document-komponent
- `src/lib/pdf-fonts.ts` (ny) — Font-registrering för PDF
- `src/lib/email-template.ts` — Omskriven: buildReportEmail → buildReceiptEmail
- `src/lib/rate-limit.ts` — Omskriven: async, KV-backad, tiers
- `src/middleware.ts` (ny) — Säkerhetsheaders
- `src/app/api/email/route.ts` — PDF-generering + attachment
- `src/app/api/analyze/route.ts` — await checkRateLimit
- `src/app/api/checkout/route.ts` — Rate limiting tillagt
- `src/app/api/refund/route.ts` — Rate limiting tillagt
- `src/components/analysis-flow.tsx` — OverallGauge
- `src/components/full-report.tsx` — OverallGauge + sessionId i email-anrop

**Ytterligare ändringar denna session:**

**Rate limiting + säkerhetsheaders:**
- `rate-limit.ts` omskriven: async, Vercel KV-backad, in-memory fallback, tiers
- Rate limiting på analyze (5/h), email (10/h), checkout (10/h), refund (5/h)
- `middleware.ts` (ny): CSP, HSTS, X-Frame-Options etc.

**Email-redesign: kvitto + rapport-PDF:**
- `email-template.ts` omskriven till minimal kvittomall (lagkrav förenklad faktura)
- `report-pdf.tsx` (ny): @react-pdf/renderer, full rapport som PDF-bilaga
- `pdf-fonts.ts` (ny): Space Grotesk + Inter för PDF
- Klienten skickar sessionId som kvittonummer

**Lansering + deploy:**
- Domän: kollaavtalet.nu (Vercel + Loopia DNS)
- Stripe: live-produkt (49 kr), promotion codes aktiverade
- Resend: domän verifieras (DNS-poster tillagda), from-adress → hej@kollaavtalet.nu
- E-postvidarebefordring: hej@kollaavtalet.nu → personlig e-post via Loopia
- Google Search Console + Bing Webmaster Tools verifierade
- Villkor-sida (/villkor) skapad
- ESLint config för CI

**Legal audit (11 fynd åtgärdade):**
- Ansvarsbegränsning med beloppstak (49 kr) i villkor
- Ångerrätt: rätt lagrum (16 § konsumentavtalslagen)
- Disclaimers: "automatiserad, inte granskad av människa" på alla platser
- Disclaimer synlig i PDF-export (no-print borttagen)
- Integritetspolicy: fullständig identitet + rättslig grund för Stripe/Resend
- Systemprompt: anti-injection-instruktion + kollektivavtalsvarning
- Prompt injection-disclaimer i villkor
- Momsreg.nr till env var
- 30-dagars länk kvalificerad

**Buggfixar:**
- Betalningslås (`ce_unlocked`) rensas vid ny uppladdning — förhindrar gratis omanalys
- CSP: Tesseract.js OCR-worker + språkdata tillåtna (cdn.jsdelivr.net i script-src + connect-src)
- Domänreferenser: kollaavtalet.com → kollaavtalet.nu överallt

**Nästa steg:**
- Väntar på Resend domänverifiering (DNS-poster tillagda)
- Testa fullständigt flöde med TEST100 promo code när Resend är klart
- Artikel 30-register (internt dokument, inte kod)

---

**Tidigare session:**

Helhetsbedömningen ("bra"/"godkänt"/"risk") ersatt med en tre-segments horisontell bar (grön/orange/röd). Aktiv segment markerat, inaktiva nedtonade. Synlig i både gratisvy och betald rapport.

**Ändrade filer:**
- `src/components/overall-gauge.tsx` (ny) — OverallGauge-komponent + getGaugeConfig
- `tests/components/overall-gauge.test.ts` (ny) — 3 tester för getGaugeConfig
- `src/components/analysis-flow.tsx` — Två helhetsbedömning-boxar ersatta med OverallGauge
- `src/components/full-report.tsx` — OverallAssessment borttagen, ersatt med OverallGauge

**Uppföljning:** Gauge-segmenten fick labels ("Bra"/"Notera"/"Risk") och vänsterställdes efter visuell feedback — baren såg ut som ett dekorativt element utan labels.

**Designbeslut:** Se BESLUT.md. Gauge synlig i gratisvy (konverteringsverktyg — grönt = trygghet, orange/rött = incitament att betala för detaljer).

**Nästa steg (deploy):**
- Byt Stripe till produktionsmiljö (production-nycklar + rätt produkt/pris)
- Koppla egen domän i Vercel

---

**Tidigare session:**
**2026-03-31 — Multi-fil-uppladdning**

Upload-steget omskrivet för att stödja 1-5 PDF-filer. Fillista med parse-status, explicit "Analysera"-knapp, max 5 filer, 50k-teckengräns. Inga API-ändringar.

**Ändrade filer:**
- `src/components/upload-step.tsx` — Ny multi-fil-logik, fillista, analysera-knapp
- `src/components/analysis-flow.tsx` — `handleParsed` → `handleAnalyze`, uppdaterad ParsedData
- `tests/components/upload-step.test.tsx` (ny) — 8 tester
- `e2e/smoke.spec.ts` — Nytt test för flerfilstext
- `BESLUT.md` — Beslut dokumenterat

---

**Tidigare session:**
**2026-03-31 — 22-skill audit: testinfra, tillgänglighet, CI, E2E, docs**

Fullständig audit mot 22 expertroller (skills). Alla identifierade förbättringar implementerade.

**Testinfrastruktur (nytt):**
- Vitest uppsatt med jsdom + @testing-library
- 22 unit tests för PII-strippern (alla mönster)
- 10 unit tests för analysresultat-validering
- Ny `analysis-validation.ts` — strukturell validering av Claude-output, integrerad i analyze-routen (loggar, blockerar inte)

**Tillgänglighetsfixar:**
- AnalyzingOverlay: `<div role="dialog">` → nativt `<dialog>` + `showModal()` — fokus-trap löst (PROBLEM.md: hög → löst)
- Focus ring: `accent-500` → `accent-700` (#941228, 8.5:1 kontrast) — AAA-compliant (PROBLEM.md: medel → löst)

**Felhantering:**
- Ny `ErrorBoundary`-komponent med svenskt fallback-UI, insvept i layout.tsx

**CI/CD:**
- GitHub Actions workflow: lint, typecheck, unit tests, build, PDF worker-check

**E2E-tester (nytt):**
- Playwright uppsatt med 9 smoke tests: landing, FAQ, 5 SEO-sidor, integritetspolicy, källsidor
- Alla 9 E2E-tester passerar

**Dokumentation:**
- `docs/api-routes.md` — alla 7 API-endpoints dokumenterade
- `docs/superpowers/plans/2026-03-31-skill-audit-improvements.md` — implementationsplan

**Ändrade filer:**
- `vitest.config.ts` (ny), `tests/setup.ts` (ny), `tests/lib/pii-stripper.test.ts` (ny), `tests/lib/analysis-validation.test.ts` (ny)
- `src/lib/analysis-validation.ts` (ny), `src/components/error-boundary.tsx` (ny)
- `playwright.config.ts` (ny), `e2e/smoke.spec.ts` (ny)
- `.github/workflows/ci.yml` (ny), `docs/api-routes.md` (ny)
- `src/components/analysis-flow.tsx` — AnalyzingOverlay dialog-refaktorering
- `src/app/globals.css` — focus ring contrast fix
- `src/app/layout.tsx` — ErrorBoundary wrapper
- `src/app/api/analyze/route.ts` — validation integration
- `package.json` — test/e2e scripts + devDependencies
- `PROBLEM.md` — 2 problem markerade som lösta
- `STATUS.md` — denna uppdatering

---

**Föregående session:**
**2026-03-17 — Accepterade förbättringsförslag (3 st)**

Tre öppna förslag implementerade:

1. **BRAND.md röst + tonregel:** "Kunnig kollega" → "Kunnig kompis med edge". Undantag från 20-ordsregeln för FAQ/redaktionellt innehåll. FAQ-länk fanns redan i footer.
2. **Differentierad allvarlighet för saknade villkor:** `allvarlighet`-fält tillagt i schema, TypeScript-typer, systemprompt och UI. Hög/medel visas som severity-pill. "Övertid ingår i lön" dirigeras till flaggor istället.
3. **Bolagsnamn/org.nr:** Accepterat men avvaktar registrering.

**Ändrade filer:**
- `BRAND.md` — Röst + tonregelundantag
- `SPEC.md` — allvarlighet i saknade_villkor-schema
- `src/lib/analysis-types.ts` — SaknatVillkor-interface
- `src/lib/prompts.ts` — Systemprompt: allvarlighetsregler + "övertid ingår i lön" → flagga
- `src/components/full-report.tsx` — Severity-pill för saknade villkor
- `src/components/analysis-flow.tsx` — Severity-pill för saknade villkor

---

**2026-03-16 - SEO, social sharing och AI-indexerings-audit (SEO-specialist)**

Fullständig SEO-audit och implementering av allt som saknades.

**Skapade filer:**
- `src/app/opengraph-image.tsx` - Next.js App Router OG-bild, 1200x630, edge runtime
- `src/app/twitter-image.tsx` - Twitter Card-bild (identisk med OG)
- `src/app/sitemap.ts` - Automatisk Next.js sitemap med 11 sidor
- `src/app/robots.ts` - robots.txt, /rapport och /api/ disallowed
- `public/llms.txt` - AI-crawler beskrivning (ChatGPT, Perplexity m.fl.)
- `public/site.webmanifest` - PWA-manifest

**Uppdaterade filer:**
- `src/app/layout.tsx` - metadataBase, title template, global OG/Twitter, hreflang sv-SE, Organization + WebApplication JSON-LD
- `src/app/page.tsx` - canonical, OG per sida
- `src/app/faq/page.tsx` - canonical, OG, FAQPage JSON-LD (7 Q&A)
- `src/app/rapport/page.tsx` - description tillagd
- `src/app/regler/las/page.tsx` - canonical, OG, Article + BreadcrumbList JSON-LD
- `src/app/regler/provanstallning/page.tsx` - canonical, OG, Article + BreadcrumbList JSON-LD
- `src/app/guide/konkurrensklausul/page.tsx` - canonical, OG, Article + BreadcrumbList JSON-LD
- `src/app/guide/uppsagningstid/page.tsx` - canonical, OG, Article + BreadcrumbList JSON-LD
- `src/app/guide/granska-anstallningsavtal/page.tsx` - canonical, OG, Article + BreadcrumbList JSON-LD
- `src/app/regler/page.tsx` - canonical
- `src/app/guide/page.tsx` - canonical
- `src/app/integritetspolicy/page.tsx` - canonical, robots: follow false
- `src/app/kallor/page.tsx` - canonical

**Notering:** Metadata-strängar skrivna med ASCII-approximationer av svenska tecken (se öppet förslag i BESLUT.md). Bör åtgärdas innan deploy för optimal SEO-matching.

---

**2026-03-16 — FAQ-sida (Senior Copywriter)**

FAQ-sida skapad på `/faq`. Server/client-split för att kombinera Next.js metadata-export med accordion-logik.

**Skapade filer:**
- `src/app/faq/page.tsx` — Server Component: metadata, sidhuvud, CTA-sektion, importerar FaqContent
- `src/app/faq/faq-content.tsx` — Client Component: accordion, fem sektioner, 19 frågor

**Innehåll:** 5 sektioner — Hur det fungerar, Privacy och säkerhet, Juridiskt, Betalning och pris, Övrigt. 19 frågor totalt inkl. alla beställda plus "Kan jag lita på analysen?".

**Förbättringsförslag loggat i BESLUT.md:** Se "Öppna förslag — FAQ-sida: footer-länk".

---

**Föregående session:**
**2026-03-15 — QA: pdf-parser.ts OCR-validering och buggfixar (Senior QA)**

Tre buggar identifierade och fixade i `src/lib/pdf-parser.ts`:

1. **Double-destroy bug**: `pdf.destroy()` anropades två gånger när OCR returnerade tom text (första gången vid rad 107, andra vid rad 117 i catch-blocket). Refaktorerat till separat try/catch för `runOcrOnPdf`, med `pdf.destroy()` exakt en gång per kodväg.
2. **Saknad `page.cleanup()`**: pdfjs-sidor rendes vid scale 2.0 men frigjordes aldrig — operator list och bilddata låg kvar i minnet för alla 20 sidor. Åtgärdat med inner `try/finally { page.cleanup() }` per sida.
3. **`console.log` i produktion**: Två debug-loggar (rendered WxH, extracted N chars) i strid med projektkonventionen. Borttagna.

Stale eslint-disable-kommentar borttagen från `runOcrOnPdf`-deklarationen.

**Ändrade filer:**
- `src/lib/pdf-parser.ts` — double-destroy fix, page.cleanup(), debug logs borttagna
- `PROBLEM.md` — OCR-posten uppdaterad till löst

---

**Senaste session (föregående)**
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
