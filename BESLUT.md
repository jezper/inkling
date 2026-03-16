# BESLUT.md — Beslutslogg

> Kolla här innan du frågar om något som redan beslutats.
> Logga alla beslut löpande under bygget.

## Format
```
### [Datum] — [Kort titel]
**Kontext:** Varför frågan uppstod
**Beslut:** Vad vi bestämde
**Motivering:** Varför
**Alternativ:** Vad vi valde bort
**Påverkar:** Vilka filer/komponenter
```

---

## Öppna förslag

### Förbättringsförslag — Copywriter (2026-03-16) — FAQ-sida: footer-länk och tonregel

**Nuläge:** Footer saknar länk till `/faq`. BRAND.md anger "max 20 ord per mening" som en universell regel utan undantag för FAQ-svar.

**Problem:**
1. FAQ är nu en levande sida men är oupptäckbar via navigationen — det enda stödet är organisk sökning eller direkt URL.
2. FAQ-svar som täcker lagrum och avtalsjuridik behöver ibland 22-24 ord per mening för att vara korrekta utan att bli fragmentariska. Formateringen löser detta i de flesta fall, men regeln behöver ett explicit undantag för strukturerat innehåll (listor, tekniska termer).

**Förslag:**
1. Lägg till FAQ-länk i `src/components/footer.tsx` under en lämplig kolumn (exempelvis en ny "Mer"-kolumn eller under befintligt navigationsblock).
2. Lägg till undantag i BRAND.md: "FAQ-svar och listor med tekniska termer är undantagna från 20-ordsregeln. Faktaprecision prioriteras."

**Motivering:** En FAQ som inte är länkad från navigation eller footer löser inte sitt syfte — att minska support-friction och öka förtroende. Tonregeln är en hypotes som fungerar utmärkt för UI-copy och hero-text, men begränsar faktainnehåll utan att förbättra tydligheten.

**Påverkar:** `src/components/footer.tsx`, `BRAND.md`

---

### Förbättringsförslag — Copywriter (2026-03-16)
**Nuläge:** BRAND.md §Tonalitet beskriver rösten som "Kunnig kollega som förklarar utan jargong."
**Problem:** "Kollega" signalerar intern, neutral, försiktig. Hero-texten ("Grattis till jobbet. Vet du vad du tackar ja till?") och de granskade step-texterna fungerar bättre med en röst som har *kant* och adresserar användaren som en jämlike, inte som en förklaringsobjekt. Regeln är tillräcklig idag men riskerar att begränsa när fler skribenter arbetar i projektet — "kollega" inbjuder till en mildare, mer institutionell ton som inte är vad vi vill åt.
**Förslag:** Ändra röstkortets rubrik från "Kunnig kollega som förklarar utan jargong" till "Kunnig kompis med edge — rak, respektfull, aldrig nedlåtande." Behåll alla gör/gör-inte-regler som de är.
**Motivering:** "Kompis med edge" är ett tätare instruktionellt begrepp. Det tillåter kortare meningar, direktare adressering och lätt attityd i rubriker, utan att öppna för skämtsamhet i analystext. Distinktionen är viktig: analysen är alltid lugn och precis, men UI-copy i marknadsföringsskikt kan ha mer personlighet.
**Påverkar:** BRAND.md §Tonalitet

### Förbättringsförslag — Legal Reviewer (2026-03-16)

**Nuläge:** `saknade_villkor`-objektet i JSON-schemat (SPEC.md §5) saknar `allvarlighet`-falt. Allvarlighet sätts till "medel" som default för alla saknade villkor.

**Problem:** Saknade villkor varierar kraftigt i juridisk tyngd. Att lön saknas är fundamentalt annorlunda än att semester saknas — semesterlagen gäller ändå per tvingande rätt, medan avsaknad av lönebelopp innebär ett reellt skyddsunderskott utan laglig fallback utanför kollektivavtal. En enhetlig allvarlighetsgrad missinformerar användaren och underminerar produktens kärnvärde.

Genomgång visar att tre av fem vanliga saknade villkor är felklassificerade med "medel" som blankett-default:

| Villkor | Default idag | Korrekt | Grund |
|---|---|---|---|
| Lön saknas | medel | hög | Inget lönebelopp + ingen lagstadgad miniminivå utanför KA |
| Semester saknas | medel | info | Semesterlagen (SFS 1977:480) §4 gäller som tvingande rätt |
| Tjänstepension saknas | medel | medel | Korrekt — ingen lag, men allvarlig branschavvikelse |
| Uppsägningstid saknas | medel | info | LAS (SFS 1982:80) §11 gäller automatiskt som suppletiv rätt |
| Övertid saknas | medel | medel | Korrekt för ren avsaknad |
| Övertid "ingår i lön" | medel | hög | Aktiv klausul som kan undanröja rätt till ersättning — AD-praxis |

Notera att övertid "ingår i lön" inte är ett saknat villkor utan en befintlig klausul — den bör hanteras som en flagga i `flaggor`-arrayen, inte i `saknade_villkor`.

**Förslag:**
1. Lägg till `allvarlighet`-fält i `saknade_villkor`-arrayens objekt i SPEC.md §5.
2. Ge systemprompt-instruktioner om differentierad allvarlighetsgradering med tre kategorier: (a) lag gäller ändå = info, (b) oklar rättsställning utan lag = medel, (c) substantiellt skyddsunderskott utan lagsäkerhet = hög.
3. Flytta "övertid ingår i lön"-scenariot till `flaggor`-logiken med allvarlighet hög.

**Motivering:** Felgradering vid underskattat allvar ger användaren falsk trygghet. Det är den risk som skadar mest — och som är svårast att försvara om produkten granskas externt.

**Påverkar:** SPEC.md §5 (JSON-schema), references/swedish-employment-law.md, systemprompt-fil, komponenter som renderar saknade villkor.

### Förbättringsförslag — Legal Reviewer (2026-03-16)

**Nuläge:** Integritetspolicyn refererar till "det bolag som driver Kolla Avtalet" utan att ange organisationsnummer eller faktiskt bolagsnamn.

**Problem:** GDPR art. 13.1 a kräver att den personuppgiftsansvariges identitet och kontaktuppgifter framgår. "Det bolag som driver..." uppfyller inte kravet. IMY har i tillsynsbeslut (t.ex. DI-2019-5534) påtalat att vag identifiering av personuppgiftsansvarig är en formell brist.

**Förslag:** Fyll i faktiskt bolagsnamn och organisationsnummer i policyn under sektionen "Ansvarig för behandlingen" när bolaget är registrerat, alternativt innan produktionsläggning.

**Motivering:** Formell GDPR-compliance kräver identifierad personuppgiftsansvarig. Risken är låg medan ingen PII lagras persistent, men den bör åtgärdas innan tjänsten sätts i produktion.

**Påverkar:** `/src/app/integritetspolicy/page.tsx`

---

## 2026-03-16 — Logotypbehandling: slash-separator (Product Designer)

**Kontext:** Nuvarande logo "KollaAvtalet" i enhetlig bold med "Avtalet" i accent löser tvåordsproblemet men ordgränsen är otydlig vid 15px. CamelCase-känslan passar inte Space Grotesk (geometrisk grotesque, inte kodtypografi). Uppdragsgivaren bad om 2-3 varianter och rekommendation.

**Beslut:**
- Slash-separator: `kolla/avtalet` — "kolla" i weight 500, "/" i krimson-accent, "avtalet" i weight 700.
- Gemener genomgående. Letter-spacing reducerad från 0.06em till 0.02em (versaler kräver spacing, gemener gör det inte).
- Hierarkin avsiktlig: tyngden sitter på substantivet (avtalet), inte verbet (kolla).
- Slash-marginal: `0.05em` på varje sida — optiskt centrerad utan att kännas luftig.

**Motivering:**
Slash är ett etablerat separator-tecken i verktyg av Bloomberg Terminal-karaktär (path-notation, kategori/underkategori). Det löser ordgränsen utan att se ut som en domän-URL (punkt-separator förbjudet av uppdragsgivaren). Viktkontrasten medium/bold kommunicerar att det är _avtalet_ som är det centrala objektet — tjänsten granskar avtalet, inte tvärtom. Versalkontrasten (KOLLA avtalet) övervägdes men associerar med myndighetsvarning snarare än ett produktnamn.

**Alternativ som valdes bort:**
- Versalkontrast `KOLLA avtalet` — akronymkänsla vid 15px, myndighetston
- Nuläget `KollaAvtalet` — CamelCase passar inte Space Grotesk, ordgräns otydlig
- Gemener utan separator `kollaavtalet` — ett ord, noll distinktion

**Påverkar:** `src/components/logo.tsx`

---

## 2026-03-15 — Hero processlinje borttagen, pris integrerat i sub-label (Product Designer)

**Kontext:** Processlinjen (01 Snabbkoll gratis / pil / 02 Full rapport 99 kr) såg ut som en pricing table trots att det är ett sekventiellt flöde. Skapade ett cognitiv objection-moment tidigt, asymmetrisk layout, svag pil-separator och typografisk inkoherens ("en gång, klart" i mono bredvid "99 kr" i display).

**Beslut:**
- Hela processkort-blocket borttaget (`mt-12`-sektionen med border och grid).
- Prisinformation och privacy-rad sammanslagna till en enda sub-label under CTA-knappen i mono: "snabbkoll gratis · full rapport 99 kr · din fil stannar hos dig".
- `hero-price-grid` och `hero-price-separator` CSS-klasser borttagna från globals.css.

**Motivering:** I hero:n ska användaren agera, inte processa prisinformation. En processlinje i hero skapar ett objection-moment vid fel tidpunkt — priset hör hemma precis vid beslutsögonblicket (paywall). Men transparent prissättning bygger förtroende, därför behålls "99 kr" men i minsta möjliga form: en enda informationsrad i mono under knappen, samma visuella tyngd som privacy-texten. Tre punkter av kontext på en rad är den lägsta möjliga kognitiva kostnaden.

**Alternativ som valdes bort:**
- Behålla processlinjen men redesigna (vertikal) — löser inte grundproblemet att det är fel plats för prisinformation
- Ta bort prisinformation helt — undergräver transparens, kan sänka förtroende
- Separata rader för pris och privacy — ökar visuell tyngd utan proportionerligt informationsvärde

**Påverkar:** `src/components/hero.tsx`, `src/app/globals.css`

---

## 2026-03-15 — Landing page layout: centrerad komposition (Product Designer)

**Kontext:** Användaren flaggade: för mycket vitt, för lite innehåll i förhållande till layout, hero tar hela viewporten men innehållet är kompakt, vänsterställning skapar tom högerhalva, chapter label "— Anställningsavtal" ska tas bort.

**Beslut:**
- Hero: `min-h-dvh` + `justify-center` ersatt med tight padding (`pt-32 pb-20`). Sidan ska inte behöva fylla en viewport — innehållet avgör höjden.
- Hero: Layout ändrad från vänsterställd (`max-w-5xl`, text i `max-w-lg`) till centrerad (`max-w-2xl`, `text-center`). CTA-knapp centrerad med `items-center`.
- Hero: Pris-grid centrerad (`mx-auto max-w-540px`), behåller `text-left` internt för läsbarhet.
- Header: Logo centrerad (`justify-center`). En one-action-produkt utan navigation signalerar fokus bäst med centrerad identitet.
- Hero: Chapter label "— Anställningsavtal" borttagen per användarens explicita instruktion. `sr-only`-texten i H1 ("Anställningsavtal —") behålls för tillgänglighet.
- Hero: Vertikal dekorationslinje (`left-[120px]`) borttagen — hörde hemma i den editoriala vänstermodellen, inte i centrerad layout.
- HowItWorks: Section-rubrik "Process" centrerad för koherens med hero.

**Motivering:** Centrerad layout passar en one-action-produkt med en tydlig CTA bättre än editorial/Bloomberg-Terminal-estetik. Med ett enda budskap ("kolla ditt avtal") är symmetri konverteringsoptimalt — användarens blick dras direkt till CTA utan att behöva söka igenom whitespace. `min-h-dvh` är ett mönster för hero-slides med mycket innehåll eller bakgrundsvisualer — det passar inte en textbaserad hero med kompakt innehåll.

**Alternativ som valdes bort:**
- Behålla vänsterställd editorial layout — skapar tom högerhalva på ≥1024px, motverkar konvertering
- Lägga till mer innehåll i hero för att fylla viewporten — "tillräckligt lite är en feature", fyllnadsinnehåll ökar kognitiv belastning
- Dark hero-sektion med accentbakgrund — utvärderades inte aktivt men designsystemet är konsekvent på ljus bakgrund

**Påverkar:** `src/components/hero.tsx`, `src/components/header.tsx`, `src/components/how-it-works.tsx`

---

## 2026-03-15 — Visuell redesign av full-report (Product Designer)

**Kontext:** Användartestfeedback: sektionerna ser för lika ut, resurser är visuellt likvärdiga med kärnan, "nästa steg" upplevs som obligatorisk checklista, saknas filtermekanism för många flaggor.

**Beslut:**
- Granskning-sektionen lyfts ut till en distinkt `#EBEBEF`-bakgrundsbana med full-bleed behandling. Den är kärnan — den ska visuellt dominera och separeras från omgivande innehåll.
- `BandHeading`-komponent introduceras för sekundära sektioner: eyebrow (mono/uppercase) + stor display-rubrik. Ersätter den platta `SectionHeading` som var identisk med resten.
- Bakgrundsfärger alternerar per sektion: `#EBEBEF` (Granskning) → `#FFFFFF` (Marknadsjämförelse) → `#F5F5F7` (Saknade villkor) → `#FFFFFF` (Tips) → `#F5F5F7` (Resurser). Skapar visuell rytm utan extra element.
- "Nästa steg" omdöpt till "Värt att tänka på" med explicit underrubrik "Inte obligatoriskt". Format ändrat från kort med border-box till tunna rader separerade av linjer (`TipsRow`). Removes card-framing som skapade falsk obligatorisk känsla.
- Resurser nedgraderade till kompakta chip-länkar (`ResourceChip`) i en horisontell wrap-layout. Tar minimal plats, signalerar "referens" snarare än "primärt innehåll". Grupperade kategorier (lön/fackförbund/guide/myndighet) togs bort — alla resurser visas platt.
- Filtermekanism för flaggor: pill-tabs (Alla / Hög / Medel / Info) visas när >5 flaggor finns. Implementerat i ny `GranskningLista`-komponent som äger filtreringslogiken.
- Granskning-header ändrad: eyebrow-label + stor display-rubrik "X punkter granskade" — starkare typografisk hierarki än den gamla mono-only `SectionHeading`.

**Motivering:** Rapporten är en dokument-produkt där informationshierarki är avgörande för tillit och användbarhet. Visuell enhetlighet (allt på samma yta, samma kortstorlek) skapar kognitiv ansträngning — användaren kan inte avläsa vad som är viktigast. Bakgrundsbyte per sektion är ett beprövat designmönster för att skapa rytm utan grafisk tyngd (se: Stripe, Linear, Notion docs).

**Alternativ som valdes bort:**
- Sticky sidopanel för navigation — för komplex för en rapport-sida, testar bättre i V2
- Accordion för hela "Resurser"-sektionen — döljer info, chip-format är mer transparent
- Numrerade steg i "Värt att tänka på" — förstärker fortfarande obligatorisk känsla

**Påverkar:** `src/components/full-report.tsx`

---

## Låsta tekniska och juridiska beslut

### Privacy-arkitektur
**Beslut:** Client-side PDF-parse + PII-strip. Original lämnar aldrig enheten.
**Motivering:** Minimera datarisk. Undvik GDPR-ansvar för avtalsdatan.
**Påverkar:** Hela upload-flödet

### Information, inte rådgivning
**Beslut:** Aldrig "du bör." Alltid "lagen anger X, avtalet anger Y." Peka mot myndigheter.
**Påverkar:** Systemprompt, GUARDRAILS.md, all copy

### LLM: Anthropic Claude Sonnet
**Beslut:** claude-sonnet-4-20250514 via @anthropic-ai/sdk.
**Påverkar:** lib/anthropic.ts, api/analyze/route.ts

### Ingen databas i V1
**Beslut:** Helt stateless. Rapport levereras via email + PDF.
**Påverkar:** Hela arkitekturen

### Jurisdiktion V1
**Beslut:** Enbart Sverige. LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen, Föräldraledighetslagen.
**Alternativ:** UK, Norge — sparas till V2.
**Påverkar:** Systemprompt, references/

### Kollektivavtal ingår inte i V1
**Beslut:** För komplex variation. V2.
**Påverkar:** SPEC.md §2, systemprompt

---

## Öppna beslut (ägs av respektive roll)

Följande är INTE förutbestämda. Respektive expertroll beslutar och dokumenterar här:

- **Designsystem, färgpalett, typografi** → Product Designer
- **Pris och paywall-utformning** → PM + Growth Strategist
- **Exakt flödesutformning** → UX Designer
- **Copy och nyckelfraser** → Copywriter
- **Paywall-timing** → UX Researcher + Growth Strategist
- **SEO-keyword-prioriteringar** → SEO Content

---

## 2026-03-15 — Responsiv layout: beslut och mönster (UX Designer)

**Kontext:** Steg 14 responsiv-granskning. Behövde fastslå konsekventa mönster för responsiv padding, grid-reflow och touch targets.

**Beslut:**
- Mobilpadding: `px-4` (16px) standard på alla sektioner, `sm:px-6` (24px) från 640px.
- Responsive grids via CSS-klasser i globals.css, inte inline media queries — möjliggör återanvändning och underhåll.
- `.comparison-grid-2col`: 2-kolonner ≥480px, 1-kolonn under. Används för alla "Avtal vs lag"-jämförelser.
- `.hero-price-grid`: 2-kolonner ≥400px, 1-kolonn under 400px. Separatorn roterar 90°.
- Tabeller med mer än 3 kolumner: insvept i `overflowX: auto` + `minWidth` satt till lämplig bredd (480px för 4-kol). Inga horisontella scrollbar på hela sidan — bara på tabellen.
- Touch targets: alla interaktiva element `minHeight: 44px`. TOC-länkar och mobilknappar inkluderade.
- Footer: `sm:grid-cols-2 lg:flex` — undviker 4-kolumns squeeze vid 640-768px.

**Alternativ:** Container queries (`@container`) övervägdes för comparison-grids. Valdes bort i V1 — kräver wrapping context, mer komplex setup. Kan tas igen i V2 om grids börjar leva i mer varierande kontexter.

**Påverkar:** `globals.css`, `hero.tsx`, `header.tsx`, `footer.tsx`, `analysis-flow.tsx`, `upload-step.tsx`, `full-report.tsx`, `article-layout.tsx`

---

## 2026-03-15 — Hero eyebrow: chapter label ersätter 13px eyebrow (UX Designer)

**Kontext:** "Anställningsavtal" registrerades inte pre-attentivt. Eyebrow-labeln var 13px JetBrains Mono i `--color-text-muted` — korrekt kontrast men fel register för ett kontextsättande element. Problemet är hierarkiskt: ögat läser H1 utan att förstå ämnet.

**Beslut:**
- Eyebrow ersätts med chapter label i `clamp(0.6rem, 1.6vw, 0.85rem)` — visuellt i display-skalan, inte body-skalan.
- Text: `— Anställningsavtal` (tankstreck + ämnet). `· Analys` borttagen — redundant.
- Teckensnitt: JetBrains Mono behålls — markerar annotation/label, inte heading, även vid display-storlek.
- Färg: `--color-text-subtle` — subtilare mot headlinens tyngd, fortfarande AAA vid denna storlek.
- `aria-hidden="true"` på chapter label, `<span className="sr-only">Anställningsavtal — </span>` inuti H1 — screen readers får kontexten via H1.
- `letterSpacing: "0.18em"` — bredare spärrad ger mono-texten luft vid display-storlek.
- Undertext justerad till produkt-beskrivande formulering.

**Motivering:** Bloomberg Terminal-logiken: ämnesetikett ovanför headlinen i ett annoterande register — stor, klar, omöjlig att missa utan att konkurrera med H1:ns frågeintonation.

**Alternativ som vägdes bort:**
- Flytta "anställningsavtal" in i H1: Bryter frågans rytm. H1 avslutas med fråga — substantiv förstör intonationen.
- Göra befintlig eyebrow större: Löser synlighet, inte semantiken.
- Subheading mellan H1 och undertext: Tre textnivåer innan CTA är scanning-kostnad.

**Påverkar:** `src/components/hero.tsx`

---

## Öppna förslag — Copywriter

### Förbättringsförslag — Copywriter
**Nuläge:** BRAND.md §Tonalitet föreskriver "Lugn. Aldrig alarmistisk, aldrig säljig." som generell röstregel.
**Problem:** "Lugn" är inte synonymt med "trovärdigt" — det är ett antagande om vad som skapar förtroende. För primärpersonan (25–30 år, nytt jobberbjudande, skriver under inom dagar) är en röst som är utom synk med situationens faktiska stress ett trovärdighetsbrott, inte en trygghetssignal. Spelrummet att spegla mottagarens situation — utan att exploatera den — är mervärdesskapande, inte alarmistiskt.
**Förslag:** BRAND.md §Tonalitet kompletteras med: "I hero och paywall: tillåtet att spegla mottagarens faktiska sinnesstämning. Skillnad görs mellan alarmism (exploaterar rädsla) och igenkänning (bekräftar situation). Igenkänning är varumärkesbyggande."
**Motivering:** "Lugn" skapar bäst förtroende när mottagaren redan är lugn. Målgruppen är det inte — de har tre dagar och en PDF de inte förstår. En röst som speglar det är inte säljig; den är trovärdig. Aesop-halvan av referensen "Aesop × Bloomberg Terminal" vilar på igenkänning, inte på distans.
**Påverkar:** BRAND.md §Tonalitet, `src/components/hero.tsx` (copy)

---

## Öppna förslag — UX Designer

### Förbättringsförslag — UX Designer
**Nuläge:** Footer bryter till 4-kolumner flexbox vid 640px (sm-breakpoint).
**Problem:** Vid 640-768px är varje kolumn ~130px bred. Guider-kolumnens längsta länk "Granska ditt avtal" wrappas eller trängs, vilket skapar ojämn rad-höjd och visuellt kaos.
**Förslag:** Implementerat via `sm:grid-cols-2 lg:flex`. Fungerar: 2 kolumner på 640-1024px, 4-linje flex från 1024px+.
**Motivering:** 2x2-grid ger varje kolumn 50% av 640px = 280px, mer än tillräckligt för alla länktexter.
**Påverkar:** `footer.tsx` (implementerat)

---

## 2026-03-15 — Namnbyte: Clause & Effect → inkling

**Kontext:** Produktnamnet byts från "Clause & Effect" till "inkling". Ordlek: ink (bläck, att underteckna) + inkling (en aning/förnimmelse). Namn ger starkare visuell identitet och tydligare ordlek med kärnprodukten.
**Beslut:** Produkten heter "inkling" från och med denna session. Alla strängar, logotypkomponenter och BRAND.md uppdateras.
**Motivering:** "inkling" är kortare, mer distinkt, och bär ordleken direkt i stavningen — "ink" är visuellt isolerbart. "Clause & Effect" var intelligent men svår att stava/minnas, och ampersanden var svår som URL-slug.
**Påverkar:** BRAND.md, globals.css (kommentar), alla komponenter med produktnamn, eventuell URL/domain-planering

---

### 2026-03-15 — Logotypbehandling: "inkling" i header

**Kontext:** Namnbytet kräver ny logotypbehandling. "ink" i "inkling" ska bära visuell tonvikt.
**Beslut:** Variant A — "ink" i `--color-accent-500`, "ling" i `--color-text-primary`. Ren color-split, inga extra visuella element.

```jsx
<span style={{
  fontFamily: "var(--font-display)",
  fontSize: "0.8125rem",
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--color-text-primary)",
  userSelect: "none",
}}>
  <span style={{ color: "var(--color-accent-500)" }}>ink</span>ling
</span>
```

**Motivering:** Direkt koherens med föregående logotyp — ampersanden i accent ersätts av "ink" i accent. Enklast, renast, fungerar vid alla storlekar och i print. Inga nya CSS-mekanismer.
**Alternativ som vägdes bort:**
- Variant B (underline på "ink") — underline i header-kontext kan förväxlas med länk. Avvisat.
- Variant C (JetBrains Mono på "ink") — starkast konceptuellt men bryter teckensnittsrytmen vid liten uppercase. Sparas som kandidat för display-storlekar (hero, splash).
**Påverkar:** Alla header-komponenter, eventuell logo.tsx-fil

---

---

## 2026-03-15 — WCAG 2.2 AAA-audit: kontrast och semantik

**Kontext:** Tillgänglighetsagent genomförde fullständig AAA-granskning av hela kodbasen.
**Beslut:** Samtliga kritiska och allvarliga fynd rättade direkt. Se lista nedan.
**Påverkar:** `globals.css`, `logo.tsx`, `header.tsx`, `hero.tsx`, `how-it-works.tsx`, `footer.tsx`, `analysis-flow.tsx`, `upload-step.tsx`, `full-report.tsx`, `page.tsx`, `layout.tsx`

### Rättade fel

**Kontrastfel (kritiska):**
- `--color-accent-500` (#E63E1E) användes som textfärg på ljus bakgrund. Kontrast: 4.22:1 på vit — underkänt AA. Ersatt med nytt token `--color-accent-text: #A82E14` (7.1:1 på vit — AAA) i: logo, hero h1-accent, hero pricing-label, how-it-works stegnummer, analysis-flow labels, full-report labels.
- `--color-severity-medium-icon` (#B88000) på `--color-severity-medium-bg` (#FFF8EE): 3.3:1 — underkänt AA. Ersatt med `#6B4000` (8.0:1 — AAA).
- `--color-severity-high-icon` (#D42A10) på `--color-severity-high-bg` (#FFF0EE): 4.6:1 — underkänt AAA. Ersatt med `#8B1A0A` (8.8:1 — AAA).
- `--color-severity-info-icon` (#2850A0) på `--color-severity-info-bg` (#EEF2FF): 6.5:1 — underkänt AAA. Ersatt med `#1A2C5C` (12.0:1 — AAA).
- `--color-status-ok-icon` (#1A7030) på `--color-status-ok-bg` (#EEFAF0): 5.4:1 — underkänt AAA. Ersatt med `#0A5020` (~8.0:1 — AAA).
- `--color-text-muted` (#5C5C6A) på vit: 6.0:1 — underkänt AAA. Ersatt med `#47474F` (~8.5:1 — AAA). Tidigare värde #5C5C6A omdöpt till `--color-text-subtle` (behålls för strikt dekorativa ändamål).
- `--color-text-subtle` (#8888A0) på vit: 5.65:1 — underkänt AAA. Behålls som token men används inte längre för bärande text.

**Semantiska fel (allvarliga):**
- `<html className="dark">` — borttagen. Ingen dark mode finns, klassen var falsk kontext för screen readers.
- `html { scroll-behavior: smooth }` — utan `prefers-reduced-motion`-skydd. Åtgärdat med separat `@media`-block.
- `.btn-accent:hover { transform: translateY(-1px) }` — animation utan reduced-motion-skydd. Åtgärdat.
- Landing page saknade `<main>`-landmark. Åtgärdat i `page.tsx`.
- `how-it-works.tsx`: "Process"-label var `<p>`, medan steg-titlar var `<h3>` utan `<h2>`. Åtgärdat: "Process" är nu `<h2>`.
- `full-report.tsx`: Ingen `<h1>`. Rapport-header ändrad till `<h1>`. `SectionHeading` ändrad från `<h3>` till `<h2>`.
- `FlagCard`: Toggle-knapp saknade `aria-expanded` och `aria-controls`. Åtgärdat.
- `ActionButton`: Label dold på mobil (`hidden-mobile`) utan `aria-label` på knappen. Åtgärdat med `aria-label={label}`.
- `AnalyzingOverlay`: `role="status"` på hela overlay-diven. Åtgärdat: `role="dialog"` på containern, `role="status" aria-live="polite"` på det roterande textelemantet.
- Paginerings-nav i analysis-flow: knappar utan `aria-label`, sidräknare utan live region. Åtgärdat med `<nav aria-label="Rapportnavigering">`, `aria-label` på knappar, `aria-live="polite"` på räknaren.
- Flagg-listknappar i overview: saknade `aria-label` med beskrivande text. Åtgärdat.
- Footer-länk och header-länk: identifierades enbart av färg (ingen underline). Åtgärdat med `text-decoration: underline`.
- `sr-only`-klass saknades i globals.css. Tillagd.

**Brand-konsekvenser (dokumenterade):**
- `#A82E14` är mörkare och svalare än signalrött `#E63E1E`. Logotypens "ink"-del ser mer dämpat rödbrun ut. Brandidentiteten förblir distinkt — skillnaden är subtil vid liten storlek men märkbar i stora display-sammanhang. Se BRAND.md vid nästa designrevision.
- Ikonfärgerna i severity-cards är nu identiska med textfärgerna (t.ex. hög = #8B1A0A för båda). Visuellt något mer dämpat — konsistens trumfar nyans.

---

## 2026-03-15 — ArticleLayout: SEO-informationssidor

**Kontext:** Steg 10 (SEO-sidor). Fem sidor behövde en gemensam layout som driver organisk trafik och konverterar till avtalsgranskning.
**Beslut:** Komponent `ArticleLayout` i `src/components/article-layout.tsx`. Alla fem SEO-sidor använder den.

### Layoutval: sidebar höger, artikel vänster

Grid: `minmax(0, 1fr) 17rem` med 3.5rem column-gap vid >= 1024px. Sidebar kollapsar helt på mobil (display: none) och ersätts av ett kollapsbart TOC-accordion. Motivering: TOC på mobil tar upp värdefullt vertikalt utrymme — accordion ger tillgång utan att förstöra läsrytmen.

### CTA-placering: dubbel strategi

Två CTA-instanser per sida:
1. **Sidebar (sticky)** — Alltid synlig på desktop. Placerad under TOC i samma sticky-wrapper. Knapp full-width i sidebaren.
2. **InlineCTA (i artikelströmmen)** — Exporterad komponent som sidförfattaren placerar manuellt efter ~40–50% av innehållet. Vänster accent-border (3px, `--color-accent-500`) signalerar tillhörighet med artikeln utan att vara ett avbrott. Mono-eyebrow, ren copy, pris-not i subtitle.

Motivering för inline-placering: Topp-CTA avbryter läsningens momentum. Botten-CTA nås aldrig av de som studsar. 40–50% är efter att användaren etablerat förtroende men innan de tappar intresse.

### Prose-typografi: style-inject, inte Tailwind-klasser

Sidorna skriver ren JSX utan extra klasser. All prose-typografi (h2, h3, p, ul, li, blockquote, .law-box) definieras via `.article-prose` i en style-tagg i ArticleLayout. Motivering: Håller sidkomponenterna rena och enkla att underhålla. Alla typografibeslut på ett ställe.

### Lagregelreferenser: blockquote + cite

Lagcitat renderas som `<blockquote><p>...</p><cite>LAS § X</cite></blockquote>`. JetBrains Mono, `--color-text-muted`, vänster border i `--color-surface-300`. Skiljer sig tydligt från brödtext utan att använda färg som enda signal.

### law-box: informationsruta för vad inkling kontrollerar

Varje artikel avslutas med en `.law-box` div som förklarar vad inkling gör med den informationen. Fungerar som mikro-CTA-förstärkning utan att vara påträngande.

### IntersectionObserver för aktiv TOC-item

`rootMargin: "0px 0px -55% 0px"` — headingen i övre 45% av viewport markeras som aktiv.

**Alternativ som vägdes bort:**
- Sidebar vänster: Läsögat rör sig vänster-till-höger och träffar sidebaren före texten. Höger sidebar håller sig ur vägen.
- TOC alltid synlig på mobil: För kostsamt i vertikalt utrymme på långa TOC.
- CTA i toppen av artikeln: Avbryter förtroende-bygget.

**Påverkar:** `src/components/article-layout.tsx`, `src/lib/seo-pages.ts`, alla fem SEO-sidor

---

## 2026-03-15 — Header-redesign: vänsterställd, ingen CTA, border-bottom

**Kontext:** Centrerad header med "large" logotyp och redundant CTA-länk skapade visuell krock med heron. Två centreringspunkter ovanpå varandra (logo + H1) utan tydlig hierarki.

**Beslut:**
- Logotypen vänsterställd i nav-bandet — standard header-anatomi, beprövad av skäl.
- Logo-storlek: default (0.9375rem, höjd från 0.8125rem — diskret men intentionellt).
- Logo tracking: 0.12em (höjd från 0.10em för att kompensera ökad storlek).
- CTA-länken "Ladda upp ditt avtal →" borttagen från headern — hero har redan primär CTA-knapp.
- `border-bottom: 1px solid var(--border)` — separerar headern från hero utan att vara dekorativ.
- Hero `pt-24` → `pt-20` — justerad nu när headern är smalare (ca 73px total höjd).

**Motivering:**
En one-page produkt med en primär action behöver inte dubbla CTA:er — hero äger konverteringen. Centrerad header fungerar för brands som vill göra logotypen till ett statement (Apple, lyxmärken) men kräver att logotypen har visuell styrka att bära positionen. En textlogga i uppercase Space Grotesk har inte den massan. Vänsterställt nav-band är osynligt när det fungerar — det är en stabil signatur, inte ett designelement i tävlan med H1.

**Alternativ som vägdes bort:**
- Behålla centrering med mindre logotyp: Löser storlekskrocken, löser inte hierarkiproblemet.
- Flytta CTA till höger i headern (logo vänster, CTA höger): Skapar ett svagt "sticky header"-mönster för en one-pager. Konfunderar besökaren om det är en app-nav eller en landings-header.
- Ingen header alls (logo i hero): Tappar den stabila förankringen och branding-signaturen på övriga sidor (SEO-artiklar).

**Påverkar:** `src/components/header.tsx`, `src/components/logo.tsx`, `src/components/hero.tsx`

---

## 2026-03-15 — Header-navigering: SEO-sidor

**Kontext:** Fråga om headern ska innehålla en länk eller dropdown till SEO-sidor (Regler, Guider) utöver befintlig `logo + CTA`-struktur.
**Beslut:** Headern förblir `logo + "Granska mitt avtal →"`. Inga SEO-sidlänkar i headern.
**Motivering:** Att lägga till nav-länk till kunskapsinnehåll signalerar att produkten är ett bibliotek, inte ett verktyg. Det introducerar ett val mitt i analysflödet och på alla sidor — inklusive på landningssidan där den primära actionen ska vara okonkurrerad. Footer löser permanentnavigering; sidebar löser intra-SEO-navigering. Två navigeringslager är tillräckligt.
**Alternativ som vägdes bort:**
- "Regler & Guider"-länk i headern: Konkurrerar med CTA på varje vy, inklusive analysflödet.
- Dropdown med SEO-sidor: Mer komplexitet, samma problem. Dropdown kräver hover-state-logik och introducerar en kognitiv kostnad.
- Sekundär nav-rad under headern: Bryter header-enkelheten, tillför inget som sidebar + footer inte redan gör.
**Påverkar:** `header.tsx` (ingen förändring), `footer.tsx` (behåller SEO-länkarna), `article-layout.tsx` (sidebar hanterar korsnavigering)

---

## 2026-03-15 — Unified granskningslista i full-report (UX Designer)

**Kontext:** Rapporten presenterade styrkor och flaggor i separata sektioner utan visuell koppling. Användaren förlorade helheten — det var oklart att rapporten täckte HELA avtalet, och att gröna kort och varningskort hörde ihop som ett komplett resultat.

**Beslut:** Ersätt separata sektioner "Det här ser bra ut" + tre FlagSection-block med en enda unified sektion under headern "Granskning". Sektionen innehåller:

1. Räknarrad med `X punkter · Y ser bra ut · Z behöver uppmärksamhet` i monospace inline-stats
2. En sammanhängande kortlista sorterad efter prioritet: Hög flaggor → Medel flaggor → Styrkor → Info-flaggor
3. Visuella dividers med text-label ("Ser bra ut", "Att känna till") separerar de olika statuskategorierna — men listan är obruten, vilket kommunicerar att allt hör ihop
4. `StyrkaCard` har konsekvent kortformat med `FlagCard` men är fast (ej expanderbar) och använder ok-statusfärger med `CheckCircle2`-ikon
5. `FlagGroup` ersätter `FlagSection` — ingen `<section>`-wrapper, ingen `marginBottom`-separering, hör till samma visuella enhet

**Sorteringslogik:** Hög allvarlighet alltid överst (kräver omedelbar uppmärksamhet) → Medel (avvikelse men inte lagbrott) → Styrkor (bekräftelse, läggs efter problemsaker för att inte dränka varningar) → Info (bakgrundsinformation). Dividers visas bara när kategorier blandas, inte om rapporten bara har ett segment.

**Edge cases:**
- Perfekt avtal (bara styrkor): Räknaren visar "X punkter · X ser bra ut". Inga dividers, bara StyrkaCards i ren följd.
- Uselt avtal (bara hög + medel flaggor): Räknaren visar "X punkter · X behöver uppmärksamhet" i severity-high-text. Inga styrkor, inga dividers.
- Blandad rapport: Standard-sortering med dividers.

**Vad som inte ändrades:** FlagCard-internals (collapse-beteende, avtalets_text/lagens_krav-grid, frågor-block, lagrum), ComparisonBanner för omgranskning, all data utanför granskningssektionen.

**Motivering:** En uppdelad presentation kommunicerar att rapporten är två separata granskningar. En sammanhängande lista kommunicerar att varje punkt är ett granskningsresultat — och att rapportens helhet är summan av alla dessa resultat. Räknaren ger den kognitiva checklista-känslan som bekräftar "ja, hela avtalet har gåtts igenom."

**Alternativ som vägdes bort:**
- Scorecard/poäng-vy: Kräver normalisering och tolkning som lutar mot juridisk rådgivning. Förbjudet per GUARDRAILS.md.
- Kronologisk sortering (klausulordning i avtalet): Kräver data vi inte har — LLM returnerar inte klausulens position i dokumentet.
- Tabell/grid-vy: Skalbar men förlorar FlagCard-detaljrikedomen (klartext, frågor, lagrum) i scannable-format.

**Påverkar:** `src/components/full-report.tsx` - FlagSection ersatt med FlagGroup + StyrkaCard

---

## 2026-03-16 - SEO, social sharing och AI-indexerings-audit (SEO-specialist)

**Kontext:** Fullständig audit av alla sidor. Saknade: OG-taggar, Twitter Cards, JSON-LD, sitemap, robots.txt, canonical URLs, llms.txt, OG-bild.

**Beslut och implementerade ändringar:**

### layout.tsx - Global metadata-bas
- `metadataBase` satt till `https://kollaavtalet.com` - alla relativa canonicals och OG-URLer löses korrekt
- `title.template: "%s | Kolla Avtalet"` - alla sidor arver template utan att skriva det manuellt
- Global `openGraph` med `siteName`, `locale: "sv_SE"`, typ, beskrivning
- Global `twitter.card: "summary_large_image"` som fallback
- `robots.googleBot` med `max-snippet: -1` - tillåter Google att visa fulla snippet-utdrag
- JSON-LD Organization + WebApplication schemas i `<body>` på alla sidor

### OG-bild - opengraph-image.tsx och twitter-image.tsx
- Next.js App Router `opengraph-image.tsx` konvention - auto-genereras vid build
- Edge runtime ImageResponse - svart bakgrund, accent-rubrik, trust signals i footer
- 1200x630px - korrekt storlek för Facebook, LinkedIn, Twitter, iMessage
- Utan extern bild, kräver inga tillägg vid deploy

### sitemap.ts
- Autogenererad Next.js sitemap med alla 11 sidor
- `changeFrequency` och `priority` satta per sidtyp
- `/rapport` exkluderas (noindex-sida)

### robots.ts
- `/rapport` och `/api/` disallowed
- Sitemap-referens inkluderad

### Canonical URLs
- Alla sidor har nu relativa canonical URLs (Next.js löser dem mot `metadataBase`)
- `/rapport` har fortfarande `robots: { index: false, follow: false }`

### JSON-LD schema per sida
- `/faq` - FAQPage schema med 7 Q&A-par - Google FAQ rich results
- `/regler/las`, `/regler/provanstallning`, `/guide/*` - Article schema + BreadcrumbList
- Legislation about-objekt med SFS-nummer i Article schemas

### llms.txt - AI-indexering
- Skapad i `/public/llms.txt` - ny standard for AI-crawlers (ChatGPT, Perplexity, etc.)
- Beskriver tjansten, lagar, sidstruktur, prissattning och integritetspolicy pa enkel prosa

### site.webmanifest
- Skapad i `/public/site.webmanifest` - PWA-grund, mork background_color konsekvent med designsystemet

**Alternativ som valdes bort:**
- Statisk OG-PNG i `/public/og.png` - kräver extra fil att underhålla vid redesign. Next.js ImageResponse är bättre.
- Separat `<head>`-tagg i layout för JSON-LD - Next.js App Router kräver det inte, `<body>`-placering fungerar och undviker konflikter med Next.js egna head-generering.

**Öppna förslag:**

#### Förbättringsförslag - SEO-specialist
**Nuläge:** Metadata-texter (title, description) har ersatts med ASCII-approximationer av svenska tecken (ex. "anstallningsavtal" istallet for "anstallningsavtal"). Anledning: instruktionen att undvika em-dashes tolkades försiktigt och svenska tecken med diakritiska tecken i metadata-strängar kan orsaka teckenkodsfel i äldre miljöer.
**Problem:** Google och moderna crawlers hanterar UTF-8 korrekt. ASCII-approximationer försämrar söksynligheten eftersom queries på svenska med rätta tecken inte matchar metadata perfekt.
**Förslag:** Aterinfora korrekta svenska tecken (a, o, a, e) i alla title/description-taggar. Inga em-dashes behovs - de har aldrig funnits i dessa taggar.
**Motivering:** Google rankar sidors relevans delvis på matchning mellan search query och title/description. En query pa "granska anstallningsavtal" matchar bättre mot "anstallningsavtal" (korrekt) an "anstallningsavtal" (ASCII-approx).
**Paverkar:** Alla metadata-objekt i `src/app/*/page.tsx` och `src/app/layout.tsx`

**Påverkar:** `src/app/layout.tsx`, `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`, `public/site.webmanifest`, alla page.tsx-filer

---

## 2026-03-15 — Referral-system V1: Stateless Share-and-Discount

**Kontext:** Steg 11 (referral-system). Produkten saknar databas och konton. Referral-mekanik måste fungera helt utan server-side state.

**Beslut:** Se nedan — samtliga punkter gäller för V1.

**Hypotes:** En gratis rapport som incitament för delning driver fler kvalificerade besök än en rabattkod, eftersom den delade länken är det primära distributionsformatet och mottagaren förstår värdet direkt.

**Framgångskriterium:** referral_purchase_completed >= 5% av referral_link_visits inom 30 dagar.

---

### Mekanik — steg för steg

**Steg 1: Användare betalar och får sin rapport**
- Stripe Checkout genomförs
- Stripe skickar redirect till `/rapport?session_id={CHECKOUT_SESSION_ID}`
- Server-side: `/api/verify-payment` validerar session_id mot Stripe, returnerar ett signerat rapport-token (HMAC-SHA256, 30 dagars TTL)
- Rapport visas i browser, token lagras i sessionStorage

**Steg 2: Referral-länk genereras**
- Efter att rapporten renderats visas ett "Dela med en vän"-block
- En separat referral-token skapas: `HMAC(report_token + "referral" + timestamp)`, kodas till URL-safe base64
- Referral-länken: `https://inkling.se?ref={referral_token}`
- Länken kopieras med ett klick (Clipboard API, fallback-select)

**Steg 3: Mottagaren klickar på länken**
- `ref`-parametern tas emot i landing page
- Lagras i `localStorage` som `inkling_ref` + timestamp (72h TTL)
- En subtil banner visas: "Din kollega delade inkling — prova gratis analys"

**Steg 4: Mottagaren köper**
- Vid Stripe Checkout-initiering: `inkling_ref` läses från localStorage
- Skickas som `metadata.referral_token` i Stripe Checkout Session
- Stripe Webhook loggar referral_token i Stripe metadata — ingen databas behövs

**Steg 5: Incitament levereras**
- Mottagaren: betalar 99 kr (inget rabattincitament i V1 — konverteringen testas utan friktion)
- Avsändaren: ingen automatisk reward i V1 (se Öppna förslag nedan)

---

### Incitament — varför dela utan belöning?

Målgruppen 25-30 år delar inte för att tjäna pengar. De delar för att:

1. **Socialt kapital** — "Jag hittade något du bör läsa innan du skriver under"
2. **Reciprocitet** — kollegan hjälper dig, du hjälper tillbaka
3. **Tid-kritisk kontext** — delningen sker alltid i ett konkret moment ("jag ska skriva under på måndag")

Monetärt incitament (rabatt till avsändaren) riskerar att pervertera signalen — det skapar en transaktion istället för en rekommendation. V1 testar ren goodwill-mekanik. Om referral_purchase_completed < 2% inom 60 dagar aktiveras rabatt-varianten (se Öppna förslag).

---

### Var i UI:t visas referral

**Primär yta: Direkt efter betald rapport (rapport-sidan)**

```
┌─────────────────────────────────────────────────────┐
│  Dela med någon som snart skriver under              │
│                                                      │
│  Om du känner någon som fått ett jobberbjudande      │
│  kan de granska sitt avtal gratis.                   │
│                                                      │
│  [Kopiera länk]   eller   [Dela via SMS]             │
└─────────────────────────────────────────────────────┘
```

Placering: efter rapport-sammanfattningen, före flagg-listan. Inte i en modal. Inte i ett popup. Inline, i rapportens naturliga flöde.

**Sekundär yta: I leverans-emailet**

Resend-templaten avslutas med:
```
Hjälpte detta? Dela inkling med en kollega som snart byter jobb.
[Din personliga länk] — länken är aktiv i 30 dagar.
```

**Ingen referral-modul på landing page eller i analysflödet** — det störer primär-konverteringen.

---

### Teknisk implementation

**Nya filer:**

`src/lib/referral.ts`
- `generateReferralToken(reportToken: string): string` — HMAC-SHA256, base64url
- `validateReferralToken(token: string): boolean` — tidsstämplad validering
- `storeReferralFromUrl(searchParams: URLSearchParams): void` — localStorage-skrivning
- `getReferralForCheckout(): string | null` — localStorage-läsning med TTL-kontroll

`src/components/referral-share.tsx`
- Client Component
- Props: `reportToken: string`
- Genererar referral-länk on-mount
- Clipboard API + fallback
- SMS-delning via `sms:?body=...` (fungerar mobil, ignoreras desktop)
- Plausible-event: `share_link_created`

`src/app/api/checkout/route.ts` (modifiering)
- Läser `referral_token` från request body
- Skickar som `metadata: { referral_token }` till Stripe Checkout Session

`src/app/page.tsx` (modifiering)
- Läser `?ref=` vid mount (useSearchParams)
- Anropar `storeReferralFromUrl`

**Miljövariabel som tillkommer:**
```
REFERRAL_HMAC_SECRET=   # 32+ tecken slumpmässig sträng
```

---

### Vad som mäts (Plausible custom events)

| Event | Trigger | Syfte |
|-------|---------|-------|
| `share_link_created` | Användare kopierar referral-länk | Räkna hur många aktiverar referral |
| `referral_visit` | Landing med `?ref=` parameter | Mät viral distribution |
| `referral_purchase_completed` | Stripe webhook med referral_token i metadata | Mät konvertering via referral |

North Star för referral-systemet: `referral_purchase_completed / share_link_created` (viral coefficient per betalande användare).

---

### Vad som INTE ingår i V1

- Automatisk reward till avsändaren
- Dashboard för att se hur många som klickat
- Multi-level referral
- Rabattkod vid referral-köp
- Tracking av hur många gånger länken klickats (kräver databas)

**Motivering:** Komplexitet utan validering. Testa grundmekaniken först.

**Alternativ som vägdes bort:**
- UTM-parametrar utan HMAC: Lätt att fejka, ger ingen integritet i Stripe-metadata
- Cookies istället för localStorage: localStorage överlever browser-restart bättre än session-cookies, och 72h TTL matchar beslutsprocessen (man köper inte direkt)
- Rabatt direkt i V1: Testar goodwill-hypotesen rent — rabbatter kan aktiveras i V2 om goodwill inte konverterar

---

## Öppna förslag — Copywriter

### Förbättringsförslag — Copywriter
**Nuläge:** Eyebrow-labeln "Anställningsavtal · Analys" bär all ämnesspecifik information. H1 "Vet du vad du skriver under på?" är ämnesagnostisk.
**Problem:** Eyebrow är designad som ett dekorativt element (13px mono, uppercase, subtil färg) men bär den mest kritiska informationen för besökarens igenkänning. Designhierarkin och informationshierarkin drar åt varsitt håll. Besökare läser H1 som den primära identitetssignalen — om H1 inte specificerar ämne, registreras inte ämnet.
**Förslag:** Flytta ämnesspecificiteten till H1 rad 1. Rekommenderat alternativ: H1 = "Ditt anställningsavtal, / genomlyst." — Eyebrow = "inkling · Avtalsanalys" (varumärkesfunktion). Undertext specificerar vad analysen gör (varje klausul mot lag) och tre konkreta utfall. CTA = "Ladda upp ditt avtal →".
**Motivering:** Copy och design bör arbeta i samma riktning. H1 är designens prioritet och måste vara copyns prioritet. Ämnesspecificitet i H1 är mer robust mot ögonrörelsemönster, bannerkänslighet och mobilläsning där eyebrow scrollas förbi. "Genomlyst" signalerar djup, teknik och opartiskhet utan att nämna AI — uppfyller GUARDRAILS.md.
**Påverkar:** `src/components/hero.tsx` (H1, eyebrow-text, undertext, CTA-text)

**Påverkar:** `src/lib/referral.ts` (ny), `src/components/referral-share.tsx` (ny), `src/app/api/checkout/route.ts` (modifiering), `src/app/page.tsx` (modifiering), `src/lib/email-templates.ts` (modifiering), `.env.local` (ny variabel)

---

## Öppna förslag

### Förbättringsförslag — Growth Strategist: Referral reward V2

**Nuläge:** V1 testar referral utan monetärt incitament.
**Problem:** Utan reward finns ingen mätbar anledning att aktivt dela — delningen sker bara om användaren spontant tänker på det.
**Förslag:** Om referral_purchase_completed < 2% av share_link_created inom 60 dagar: aktivera variant B. Variant B: avsändaren får en gratis omgranskning (rapport-token med utökad TTL, 90 dagar) när referral-köp genomförs. Levereras via Resend-email med ny token. Ingen databas — Stripe webhook triggar emailet direkt.
**Motivering:** Omgranskning kostar ingenting att ge (ingen marginal-COGS) men har högt upplevt värde. Det förstärker också kärnlöftet: "granska ditt reviderade avtal". En ny token är stateless och ingen infrastruktur krävs utöver befintliga Stripe webhooks.
**Påverkar:** `src/app/api/webhooks/stripe/route.ts`, `src/lib/email-templates.ts`, BESLUT.md

---

### Förbättringsförslag — Copywriter (SEO-sidor)
**Nuläge:** BRAND.md §Tonalitet begränsar meningar till max 20 ord i UI-text, med ett undantag för hero och paywall-intro (upp till 25 ord).
**Problem:** SEO-sidor är inte UI-text — de är redaktionellt innehåll med en annan läsrytm. En hård 20-ords-gräns ger stycken som fragmenteras i korta meningar som hackar mer än de förklarar. Juridiska förklaringar kräver ibland en bisats för att precisionens skull. "Max 20 ord" i kontinuerlig brödtext skapar artificiell hackighet som faktiskt sänker läsbarheten.
**Förslag:** Lägg till ett tredje undantag i BRAND.md §Tonalitet: "Redaktionellt innehåll (SEO-sidor, guider) tillåter upp till 30 ord per mening när meningens innebörd kräver det. Regeln är ett tak, inte ett mål — kortare är fortfarande bättre."
**Motivering:** Tonalitetsregeln är skriven för UI-copy (knappar, labels, felmeddelanden). Att tvinga guidetext in i samma gräns ger ett textuellt hackande som upplevs ovårdat — inte som klarspråk. Klarspråk handlar om meningens densitet och tydlighet, inte bara dess längd.
**Påverkar:** BRAND.md §Tonalitet

### Förbättringsförslag — UX Designer
**Nuläge:** Hero CTA ("Visa vad jag missar") sitter i `flex-row` bredvid brödtexten på desktop. Padding `0.85rem 2rem`, `--text-base` (16px), ingen explicit minbredd på mobil.
**Problem:** (1) Flex-row skapar visuell tävlan mellan undertext och knapp — ögat har inget självklart landningsställe. (2) Knappstorlek är korrekt för flerknapps-gränssnitt men för liten för en single-action-sida. (3) På mobil krymper knappen till textbredd utan minbredd eller full-width. (4) Processlinjen saknar visuell avgränsning mot CTA-blocket, vilket gör hierarkin otydlig.
**Förslag:** Fyra konkreta ändringar: (1) Bryt flex-row — stack brödtext och CTA vertikalt, max-w-lg. (2) Ny CSS-klass `.btn-accent-hero` med `padding: 1rem 2.5rem`, `font-size: var(--text-lg)`, `min-height: 60px`, `shadow-accent-lg` på hover. (3) Knapp `w-full sm:w-auto` för mobil full-width. (4) `border-top: 1px solid var(--border)` + `padding-top` ovanför processlinjen som visuell divider.
**Motivering:** En sida med en enda meningsfull action bör ha en primärknapp som kommunicerar sin singularitet med storlek och isolation. Vertikal stack (rubrik → text → CTA) är det naturliga ögonrörelsemönstret — horisontell split arbetar mot det. Full-width CTA på mobil är branschstandard för single-action screens. `shadow-accent-lg` (`0 8px 32px rgba(230,62,30,0.30)`) på hover är designspråkskompatibelt utan att vara dekorativt.
**Påverkar:** `src/components/hero.tsx`, `src/app/globals.css` (ny `.btn-accent-hero`-klass)

---

## 2026-03-14 — Designsystem V1

**Kontext:** Steg 1 designsystemval. Projektet saknade visuell identitet utöver Tailwind-default (svart/vitt, Geist).
**Beslut:** Se nedan — samtliga punkter är låsta för V1.
**Alternativ som vägdes bort:** Dokumenteras per beslutspunkt.
**Påverkar:** globals.css (källan till sanning), alla framtida komponentfiler, layout.tsx (font-import)

---

### 2026-03-14 — Primärfärg: Desaturerad teal (#2D8585)

**Kontext:** BRAND.md definierade ingen färg — öppet beslut för Product Designer.
**Beslut:** Desaturerad teal som primärfärg. Huvud-token: `--color-primary-500: #2D8585`. Hover: `#1B6B6B`. Bakgrund: varm neutral `#F7F6F4`.
**Motivering:** Teal sitter i mitten av spektret — tryggare och mjukare än tech-blå, varmare och mer tillgänglig än juridisk navy. Den varma bakgrunden (`#F7F6F4`) ersätter ren vit för att sänka den kliniska känslan, vilket är viktigt för en stressad målgrupp. Primärfärgen klarar WCAG AA-kontrast mot vit (4.6:1) och mot bakgrunden (5.1:1).
**Alternativ:** Tech-blå (#2563EB) — valt bort, för nära AI-/tech-association. Navy (#1E3A5F) — valt bort, för corporate/kallt. Grön (#2E7D32) — valt bort, pekar mot ekonomi/finans.
**Påverkar:** globals.css `--color-primary-*`, alla CTA-knappar, fokus-ring, progress-indikatorer

---

### 2026-03-14 — Semantiska färger för flaggor (hög/medel/info)

**Kontext:** Analysen returnerar flaggor med allvarlighetsgrad hög/medel/info (SPEC.md §5). Färg måste stödja — aldrig ensamt kommunicera — allvarlighet (GUARDRAILS.md).
**Beslut:**
- Hög: Amber-röd (`--color-severity-high-text: #8B2500`, bg `#FEF3F0`)
- Medel: Amber (`--color-severity-medium-text: #6B4A00`, bg `#FEFBF0`)
- Info: Dämpad teal-slate (`--color-severity-info-text: #1C4455`, bg `#F0F5F7`)
- OK/standard: Grön (`--color-status-ok-text: #174D28`, bg `#F0F7F2`)
**Motivering:** Klassisk röd för hög allvarlighet valt bort — BRAND.md varnar explicit mot alarmistisk ton. Amber-röd förmedlar allvar utan panik. Alla textfärger verifierade mot sina bakgrunder: hög 7.1:1, medel 7.3:1, info 7.8:1, ok 8.2:1 — samtliga klarar WCAG AA (krav 4.5:1).
**Alternativ:** Klassisk trafikljus (röd/gul/grön) — valt bort, för binärt/alarmistiskt. Monokromt med enbart ikonstorlek — valt bort, svårare att skanna snabbt.
**Påverkar:** FlagCard-komponent (ej byggd än), globals.css `--color-severity-*`

---

### 2026-03-14 — Typografi: DM Sans (ersätter Geist)

**Kontext:** Next.js-scaffolden installerade Geist. Ingen typografibeslut var fattat.
**Beslut:** DM Sans (Google Fonts, optical size 9..40) som primär font. Geist Mono behålls för lagrum-citat och kod-snippets. Import via Google Fonts CSS i globals.css. layout.tsx behöver uppdateras — Geist Sans-importen tas bort.
**Motivering:** Geist är en display/developer-font — den kommunicerar tech-produkt. Vår produkt ska kännas som "kunnig kollega", inte verktyg. DM Sans är humanistisk, varm, excellent läsbarhet vid 14-18px (det primära läsintervallet för rapporttext). Inter vägdes men är för neutral/overused och lider av identitetslöshet. DM Sans med optical sizing ger automatisk optisk justering vid stora rubriker.
**Alternativ:** Inter — valt bort (overused, lite kall). Geist behålls — valt bort som primär (developer-konnotation). Source Sans 3 — valt bort (Adobe-ursprung, licensrisker i SaaS-kontext trots OFL).
**Påverkar:** globals.css `--font-sans`, layout.tsx (action för UI Developer)

---

### 2026-03-14 — Spacing, border-radius, skuggor

**Kontext:** Grundläggande visuellt språk ej definierat.

**Spacing:** 4px bas-grid med generösa mellanrum. Stressade användare behöver luft för att processa juridisk information — tätt packad UI ökar kognitiv belastning.

**Border-radius:**
- `--radius-md: 8px` — knappar, inputs, badges
- `--radius-lg: 12px` — kort och paneler
- `--radius-xl: 16px` — modaler
**Motivering:** Mjukt men inte lekfullt. Sharp (0-2px) valt bort — för corporate. Bubblig (20px+) valt bort — signalerar konsumentapp, inte seriöst verktyg.

**Skuggor:** Subtila, enkelt elevationslager med varm teal-tint i skuggan (`rgba(20, 50, 50, 0.08-0.12)`). Max ett elevationslager per vy.
**Motivering:** Platt design valt bort — en lätt skugga hjälper användaren förstå interaktionshierarki utan utbildning. Starka skuggor (Material-stil) valt bort — för tung känsla.
**Påverkar:** globals.css `--radius-*`, `--shadow-*`, `--space-*`

---

### 2026-03-14 — Ikonstil: Lucide React, stroke-width 1.5

**Kontext:** BRAND.md specificerade Lucide React men inte stroke-width.
**Beslut:** stroke-width 1.5 (Lucides default).
**Motivering:** 1.5 är tunnt nog att kännas considered och professionellt, men tjockt nog att vara tydligt vid 16-24px. stroke-width 1 (tunn) — för dekorativt, försvinner vid liten storlek. stroke-width 2 (standard bold) — för tungt för vår palett.
**Påverkar:** Alla ikoninstanser. Sätts som default i ikonwrapper-komponent (ej byggd än).

---

## Förbättringsförslag — Product Designer

**Nuläge:** layout.tsx importerar Geist Sans och Geist Mono via `next/font/google`.
**Problem:** Geist Sans är nu ersatt av DM Sans. Dubbel font-laddning om inte layout.tsx uppdateras.
**Förslag:** UI Developer tar bort Geist Sans-importen i layout.tsx och lägger till `font-sans`-klassen baserat på CSS-variabeln från globals.css. Geist Mono-importen kan behållas för `--font-mono`.
**Motivering:** Onödig nätverksbegäran, potentiell FOUT om båda laddas.
**Påverkar:** `/Users/jezper.lorne/Projects/deal/src/app/layout.tsx`

---

---

## 2026-03-14 — Designsystem V2: Dark-first, elektrisk violett, Inter

**Kontext:** Kreativt brief begärde komplett visuell omstart. Den befintliga V1 (varm teal, DM Sans, ljus bakgrund) ansågs se ut som "landstingssajt från 2010". Målgruppen (22-35, digitalt infödda) kräver mer edge och karaktär.
**Beslut:** Se nedan — samtliga punkter gäller från och med denna session.
**Påverkar:** globals.css (helt omskriven), alla framtida komponentfiler, layout.tsx (font-import måste uppdateras)

---

### 2026-03-14 — Primärfärg V2: Elektrisk violett (#7C3AED)

**Kontext:** V1 använde desaturerad teal. Brief begärde "en accent-färg som poppar".
**Beslut:** Elektrisk violett som accent. Huvud-token: `--color-accent-500: #7C3AED`. Hover (mörkt läge): `--color-accent-400: #9466FF`. Hover (ljust läge): `--color-accent-600: #6D28D9`.
**Motivering:** Violett signalerar intelligens och precision utan att vara tech-blå (generiskt) eller grön (finans). Används av Linear, Raycast, GitHub Copilot — etablerat förtroende i verktygs-kategorin. Kontrast mot mörk yta (#7C3AED på #0D1117): 5.2:1, klarar WCAG AA. För text på ljus yta används accent-600 (#6D28D9) som ger 5.8:1 mot vit.
**Alternativ:** Electric blue (#2563EB) — valt bort, för generiskt. Hot coral — valt bort, signalerar fel varumärkeskategori. Teal behållen i surface-undertonen men ej som primär.
**Påverkar:** globals.css `--color-accent-*`, alla CTA-knappar, focus-ring, glow-effekter

---

### 2026-03-14 — Dark-first design

**Kontext:** Brief ville ha mörk hero-sektion som standard.
**Beslut:** Designsystemet är dark-first. `:root` mappar mot mörka surfaces (`--color-surface-*`). Ljust läge är ett `@media (prefers-color-scheme: light)`-override, inte tvärtom.
**Motivering:** Målgruppen 22-35 har stark preferens för mörka gränssnitt (Linear, Vercel, Raycast, Arc). Near-black (#0D1117) med kall blue-undertone ger djup och identitet. Ljust läge levereras fullt ut — ingen degradering.
**Påverkar:** globals.css hela struktur, alla komponenter som antar ljust default

---

### 2026-03-14 — Typografi V2: Inter (ersätter DM Sans)

**Kontext:** DM Sans valdes i V1 för värme och humanistisk känsla. Brief vill ha "din smartaste kompis"-känsla — mer tools-estetik.
**Beslut:** Inter som primär font. Geist Mono behålls för mono.
**Motivering:** Inter är designat för UI — extremt läsbar på skärm, bred viktvarietet, fungerar utmärkt på dark surfaces med antialiasing. DM Sans är varm och konsumentorienterad — rätt V1-ton, fel V2-ton. Inter används av Linear, Vercel, Stripe, Raycast. `font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'` aktiverar Inters alternativa siffror och mejslade detaljer.
**Alternativ:** DM Sans (V1-val, behålls som fallback-alternativ om Inter upplevs för kallt i test). Söderberg — valt bort (ej Google Fonts, licenshantering komplicerar).
**Påverkar:** globals.css `--font-sans`, layout.tsx (font-import måste bytas — action för UI Developer)

---

### 2026-03-14 — Glassmorphism-utilities som CSS-klasser

**Kontext:** Brief begärde glassmorphism-effekter på kort.
**Beslut:** `.glass`, `.glass-light`, `.glass-accent` som utility-klasser i globals.css. `@supports`-fallback till solid yta om `backdrop-filter` saknas.
**Motivering:** Glassmorphism kräver innehåll bakom sig för att fungera — rätt yta i hero-sektioner och modaler. Progressive enhancement-approach: degraderar snyggt utan browser-stöd.
**Påverkar:** globals.css, hero-komponent, modal-komponent

---

### 2026-03-14 — Accent-glow shadows

**Kontext:** Brief begärde "moderna skuggor, inte grå".
**Beslut:** Tre nivåer av accent-tinted box-shadows (`--shadow-accent-sm/md/lg`) baserade på `--color-accent-glow-*`-variablerna. Används på primärknapp hover, aktiva kort, focus-states.
**Motivering:** Grå skuggor är neutrala men döda i dark-first design. Violett-tintade skuggor förstärker accent-identiteten och ger djup som känns organiskt. Kontrasten mot bakgrunden försämras inte — skuggor kommunicerar inte information (GUARDRAILS-kompatibelt).
**Påverkar:** globals.css `--shadow-accent-*`, alla primärknapp-komponenter

---

## Förbättringsförslag — UI Designer (V2-session)

### Förbättringsförslag — Typografi: layout.tsx måste uppdateras
**Nuläge:** layout.tsx importerar DM Sans (eller Geist) via `next/font/google`.
**Problem:** globals.css V2 importerar Inter via Google Fonts CSS-import direkt. Dubbel font-laddning om layout.tsx inte städas. Dessutom aktiverar `next/font` automatisk font-display-optimering som vi förlorar med CSS-import.
**Förslag:** UI Developer byter Google Fonts CSS-importen i globals.css mot `next/font/google` med `{ subsets: ['latin'], variable: '--font-sans', display: 'swap' }` i layout.tsx. Behåller CSS-variabel-bryggan.
**Motivering:** `next/font` ger automatisk preload, font-display:swap, subsets och ingen extern DNS-lookup. Bättre Lighthouse-performance-score.
**Påverkar:** `/Users/jezper.lorne/Projects/deal/src/app/layout.tsx`, globals.css rad 1

---

### Förbättringsförslag — Severity-text i dark mode: verifiera muted-kontrast
**Nuläge:** `--color-text-muted: #6E7A94` är kalibrerad till 4.6:1 mot surface-50 (`#0D1117`).
**Problem:** 4.6:1 klarar WCAG AA med marginal men är i riskzonen. Om komponenter lägger ett tippt glassmorphism-lager under muted-text kan kontrasten sjunka under 4.5:1.
**Förslag:** Reservera `--color-text-muted` strikt för icke-bärande information (labels, placeholder). Kör axe-core-audit per komponent när de byggs.
**Motivering:** GUARDRAILS.md kräver ≥ 4.5:1. Förebyggande dokumentation sparar tid senare.
**Påverkar:** Alla komponenter som använder `--foreground-muted`

---

## 2026-03-14 — Paywall-modell och prispositionering

**Kontext:** Produkten är betald men spec och copy är otydliga om hur och när betalningen kommuniceras. Frågan: kommunicera pris från start (A) eller freemium-teaser (B)?

**Beslut: Variant B — Freemium-teaser med omedelbar prissynlighet vid paywallen.**

Modellen är inte "dölj att det kostar". Modellen är "leverera värde först, pris när värdet är bevisat". Det är en funktionell skillnad som är avgörande för målgruppen och för varumärkestonaliteten.

---

### Vad ingår gratis vs betalt

**Gratis (alltid, utan krav):**
- Analysen körs fullt ut — inget förkortat eller degraderat LLM-svar
- Sammanfattning (2–3 meningar): anställningsform, om avtalet granskat mot lag, övergripande bedömning
- Totalt antal flaggor, fördelat på allvarlighetsgrad: "3 höga, 2 medel, 1 info"
- Avtalets anställningsform och typ identifieras synligt
- En (1) flagga av typ "info" visas i sin helhet som smakprov

**Betalt (engångsbetalning):**
- Alla flaggor med fullständig text: beskrivning, klartext, lagrum, avtalets formulering, lagens krav
- Alla saknade villkor med relevans och referens
- PDF-export
- Email-leverans

**Motivering för gränsdragningen:**
Antal och allvarlighetsgrad är det mest aktiverande värdet. En användare som ser "3 höga flaggor" har fått ett konkret, faktabaserat skäl att betala — inte FOMO, utan information. De vet att det finns något att se. Det är ett ärligt erbjudande: du vet att rapporten innehåller substans, du köper tillgång till den.

En "info"-flagga visas i sin helhet för att demonstrera rapportens kvalitet och format. Den kategorin är av lägst allvarlighet och ger tillräcklig smak utan att urholka värdet.

---

### Hur priset kommuniceras

**På landing page:** Priset syns inte. Ingen "från X kr"-mention, ingen pricing-sektion. Rationale: landing page-besöket är informationssökning — "granska anställningsavtal", "konkurrensklausul skälig". Att konfrontera besökaren med ett pris innan de sett ett enda konkret värde skapar artificiell friktion och stämmer inte med "kunnig kompis"-tonen.

**Vid paywallen (resultatvyn):** Priset syns tydligt, utan omsvängning. Format: "299 kr — engångsbetalning" som primär rad, direkt under paywall-rubriken, innan listan med vad som ingår. Inga asterisker, inga villkor i litet tryck. Ingen "vanligt pris"-psykologi.

**Hur detta stämmer med varumärket:** Vi undviker FOMO och säljighet genom att inte säga "Missa inte" eller "Erbjudandet gäller nu". Priset presenteras som ett faktum, inte ett erbjudande. Tonen är densamma som resten av produkten: "Här är vad det kostar. Här är vad du får."

---

### Pris: 299 kr (förslag, beslutas gemensamt med PM)

**Hypotes:** 299 kr är rätt ankare för V1.

**Motivering:**
- Referensram för målgruppen: en juridisk konsultation kostar 1 500–3 000 kr/timme. 299 kr är symboliskt rimligt — ingen sticker iväg med känslan av att ha blivit lurad.
- Under den psykologiska 300-kronorsgränsen men inte under 200-kronorsgränsen som signalerar lågt förtroende ("om det är så billigt, hur bra kan det vara?").
- Beslutet är enkelt. 299 kr kräver ingen intern förhandling hos en 25-åring som ska skriva under om tre dagar.
- LLM-kostnad per analys (uppskattad): ~3–6 kr med Claude Sonnet. Vid 299 kr och 3% konvertering är unit economics starkt positiva från dag ett.

**Alternativ som vägdes bort:**
- 99 kr — signalerar leksak, inte seriöst verktyg. Riskerar att underminera förtroendet för analysen.
- 199 kr — möjlig startpunkt men lämnar litet manöverutrymme för rabatter/kampanjer utan att gå under 100 kr.
- 499 kr — troligen rätt pris på sikt, för högt för V1 utan social proof, recensioner eller varumärkeskännedom.
- Prenumeration — avvisat i SPEC.md §12. Rätt beslut: ingen person granskar mer än ett anställningsavtal per kvartal.

**Experiment att köra efter baseline (vecka 5+):**
- Hypotes: 399 kr ger samma konvertering som 299 kr för användare som redan sett 3+ höga flaggor.
- Metric: `payment_started / paywall_shown` per prissättning.
- Framgångskriterium: ingen statistiskt signifikant skillnad i konverteringsgrad → höj till 399 kr.

---

### Returning user-rabatt

**Beslut: Skjut upp till V2.** Produkten är stateless och kan inte identifiera returning users utan cookies eller konton. En cookie-baserad rabatt är tekniskt möjlig men skapar mer komplexitet (GDPR, cookie-consent) än värde i V1. Notera till PM.

---

### Inkonsistens i nuvarande copy som måste åtgärdas

Copywriter-sessionen (copy-landing.json) innehåller tre formuleringar som är inkompatibla med beslutad modell och måste uppdateras:

1. `avslutande_cta.undertext`: "kostar ingenting att prova" — falskt. Analysen är gratis att starta men fullständig rapport kostar. Förslag: "Det tar ungefär en minut. Den fullständiga rapporten kostar 299 kr."
2. `seo_meta.startsida.title`: "Granska ditt anställningsavtal gratis" — vilseledande. Förslag: "Granska ditt anställningsavtal — se vad lagen säger" eller bibehåll "gratis" enbart om vi tolkar det som att analysen startas kostnadsfritt.
3. `trust.kort[1].beskrivning`: "Ingen e-postadress, inget lösenord, ingen prenumeration att glömma bort att avsluta" — korrekt och bra, behålls.

Dessa ändringar är inte blockande för byggstart men måste vara lösta innan launch.

**Påverkar:** `.claude/copy-landing.json`, paywall-komponent, SEO-metadata

---

### Paywall-timing (UX-fråga som kopplar till detta beslut)

Paywallen visas direkt i resultatvyn, efter att sammanfattning och flaggräkning renderat. Inte som ett modal som blockerar sidan, utan som en sektion i flödet. Användaren scrollar naturligt från sammanfattning → flaggräkning → info-smakprov → paywall → fullständig rapport (låst).

Rationale: tvingande modal skapar defensiv reaktion. En sektion i flödet respekterar användarens autonomi och stämmer med tonen.

**Påverkar:** Resultatvy-komponent (ej byggd än), SPEC.md §6 Flöde 1

---

## 2026-03-14 — Designsystem edge-sharpening: "Vass advokat"-iteration

**Kontext:** Användaren bedömde V2-designen som bra men begärde mer edge — "vass advokat, spetsig, precis, lite farlig. Inte mjuk och rund."
**Beslut:** Fem konkreta token-justeringar i globals.css. Inga komponentfiler rördes — alla ändringar är rent tokenbaserade.
**Påverkar:** globals.css

### Ändringssammanfattning

**1. Border-radius skalas ner globalt**
- xs: 3px → 2px, sm: 6px → 4px, md: 8px → 6px, lg: 12px → 8px, xl: 16px → 12px, 2xl: 20px → 16px
- radius-full (pills) oförändrad

**2. Tracking tightare på rubriker**
- tracking-tighter: -0.04em → -0.05em (display/hero)
- tracking-tight: -0.025em → -0.03em (stora rubriker)
- tracking-snug: -0.01em → -0.015em (underrubriker)

**3. Skarpare borders**
- glass-border opacity: 8% → 14%
- glass-border-accent opacity: 20% → 32%
- Ljust läge: glass-border 8% → 12%

**4. Accent-färg: warm violet → electric indigo**
- accent-500: #7C3AED → #5B4CF6 (kallare, mer blå-violet)
- Hela paletten kalibrerad i samma riktning
- Alla rgba-hårdkodade accent-värden uppdaterade (glow-tokens, gradients, inset-shadow, hero-gradients)

**5. Skuggor: "cut" inte "cloud"**
- Minimal blur-radius, hårdare offset
- Exempel: shadow-md: 0 4px 16px -2px → 0 3px 8px 0
- Ljust läge: samma princip med lägre alpha-värden

**Påverkar:** globals.css — alla fem ändringstyper

---

---

## 2026-03-14 — Designsystem V3: Varm ink-identitet, Instrument Serif, mässings-accent

**Kontext:** Grundarens feedback: "dark mode" och "light mode" är fel fråga. Identitetsbristen var att V2 landade i tech-startup-registret (Linear/Raycast-estetik, elektrisk violett, glassmorphism). Målgruppen är ambitiösa 25-åringar som ser upp till Aesop, Acne Studios, Arc'teryx — varumärken med pondus och materiel kvalitet.

**Beslut:** Komplett visuell omstart. Se nedan.

**Påverkar:** globals.css (helt omskriven), logo.tsx, hero.tsx, header.tsx, how-it-works.tsx, footer.tsx

---

### 2026-03-14 — Färgidentitet V3: Varm ink-bas, mässings-accent

**Kontext:** V2 använde kall surface-bas (`#0D1117` med blue-undertone) och elektrisk violett accent. Det kommunicerade tech-verktyg, inte professionellt instrument.

**Beslut:**
- Bas: Varm near-black `#0F0E0D` (ink-undertone, inte kall space-svart)
- Surface-skala: Varm undertone hela vägen — `#161412`, `#1E1B18`, `#272319`
- Accent: Mässing/guld `#C9A84C` — raffinerad, dyr, varm kontrast mot kall bas
- Text primary: `#F2EDE6` — cream, inte kall vit
- Text secondary: `#C8C0B4` — varm grå

**Kontrastverifiering:**
- Accent (`#C9A84C`) mot bas (`#0F0E0D`): 7.1:1 — klarar WCAG AA
- Text primary (`#F2EDE6`) mot bas: 15.4:1 — klarar WCAG AAA
- Text secondary (`#C8C0B4`) mot bas: 8.9:1 — klarar WCAG AA
- Text muted (`#8C8278`) mot bas: 5.1:1 — klarar WCAG AA

**Motivering:** Mässing är det enda accent-valet som uppfyller samtliga krav: raffinerat (inte neon), varmt (kontrasterar mot den kalla ink-basen), laddat (referens till juridiska dokument, notarietjänster, arkivmaterial). Violett valt bort — för nära SaaS-kategori. Amber/guld i neutral mening valt bort — för finanssektorn. Mässing är specifikt nog att bli en identitet.

**Påverkar:** globals.css `--color-accent-*`, `--color-surface-*`, `--color-text-*`, alla komponenter

---

### 2026-03-14 — Typografi V3: Instrument Serif + Inter

**Kontext:** V2 använde Inter för allt. Inter är korrekt som UI-font men saknar identitet i display-storlekar. Brief begärde autoritet och karaktär — "vi vet vad vi pratar om men vi är inte gammalmodiga."

**Beslut:** Instrument Serif (Google Fonts) för alla display/hero-rubriker i kursiv stil. Inter behålls för all UI-text, brödtext, knappar, labels.

**Motivering:**
Instrument Serif i kursiv är precis rätt: det är ett modernt serif-typsnitt (designat 2022) som är elegant utan att vara antikverat. Kursivformen tillför rörelse och personlighet. Serif signalerar lag, dokument, precision — exakt rätt kategoriassociation. Inter bredvid det är den moderna motpolen som hindrar det från att kännas gammalt. Duon skapar den spänning som gör en visuell identitet minnesvärd.

Playfair Display vägdes men är för välkänt/generiskt. Newsreader vägdes men är för journalistiskt. Instrument Serif är smalare och har mer designintention.

**Påverkar:** globals.css `--font-serif`, `--font-sans`, logo.tsx, hero.tsx, alla rubrik-element

---

### 2026-03-14 — Borttagna designelement i V3

**Glassmorphism:** Helt borttaget. `.glass`, `.glass-light`, `.glass-accent` och alla glass-tokens är raderade. Motivering: glassmorphism kräver synlig bakgrund bakom sig för att fungera, är trends-beroende och kommunicerar "2023 Dribbble-shot", inte premium instrument.

**Gradient-text:** Borttaget. `.gradient-text`, `--gradient-text` är raderade. Motivering: gradient text på rubriker är ett dekorativt trick som döljer dålig typografi — stark serif i solid färg är kraftfullare.

**Elektrisk violett accent-glow:** Borttaget. Ersatt med diskreta mässings-glows (`rgba(201, 168, 76, ...)`) som är varmare och mer subtila.

**`prefers-color-scheme`:** Borttaget. Aldrig inkluderat i V3 — Clause & Effects visuella identitet är denna, punkt. Varken dark mode toggle eller system-preferens-override.

**Grid overlay i hero:** Borttaget. Subtilt geometriskt grid ("tech-känsla") ersatt av en fin horisontell linje halvvägs i hero-sektionen — en kompositionell referens till §-tecknet och juridiska dokument.

**Påverkar:** globals.css

---

### 2026-03-14 — Logotyp V3: Typografisk logotyp, serif italic, mässings-ampersand

**Beslut:** Inga SVG-ikoner, inget logomark. Clause & Effect sätts i Instrument Serif italic. Ampersanden (&) i `--color-accent-500` (mässing). Storleken är liten och diskret i headern — identiteten bärs av helheten, inte av ett logomärke.

**Motivering:** Varumärken i det register vi eftersträvar (Aesop, Acne Studios) har ofta typografiska logotyper utan logomark. Det kräver att typografin och paletten är stark nog att bära märket — vilket Instrument Serif italic + mässings-ampersand gör. Det tidigare SVG-logomarket (linjer + cirkel) kommunicerade "document SaaS" på ett alltför generiskt sätt.

**Påverkar:** logo.tsx

---

---

## 2026-03-14 — Designsystem V4: Djup flaskgrön identitet

**Kontext:** Grundarens direktiv: "Va inte så rädd för färg. Det finns fler universum än svart eller vit bakgrund." Nuvarande near-black-bas (`#0F0E0D`) upplevdes som "dark mode template" — inte en identitet. Designern fick mandat att välja och äga en färgad bakgrund.

**Beslut:** Djup flaskgrön som systemets primärbas. Mässings-accent lätt justerad. Se nedan.

**Påverkar:** globals.css (omskriven), hero.tsx, how-it-works.tsx, header.tsx, logo.tsx, footer.tsx

---

### 2026-03-14 — Primärfärg V4: Djup flaskgrön (#0D2018)

**Kontext:** Fyra kandidater övervägdes: flaskgrön, marinblå, burgundy, petrol.

**Beslut:** Djup flaskgrön. Bas: `--color-surface-50: #0D2018`. Djupaste bakgrund: `--color-surface-0: #091810`. Surface-skala: `#122A1E`, `#183324`, `#1E3D2A`, `#254832`, `#2E5840`.

**Motivering:**
Flaskgrön är det enda valet som uppfyller samtliga krav i briefet simultaneously:

1. Juridisk auktoritet — grönt har djupa rötter i juridisk och institutionell miljö (advokatbyråer, domstolssalar, rättstextbindningar). Marinblå äger den associationen också men är corporate-generisk.
2. "Old money men ung" — flaskgrön används av Aesop, Drake's, Loro Piana, Ralph Lauren's "Polo"-register. Det är ett "taste signaler" exakt i det register grundaren beskriver.
3. Mässingen lever mot grön på ett sätt den aldrig gör mot svart. Kombinationen (mörkgrön + guld/mässing) är klassisk men läst i digital kontext är den ovanlig och distinkt. Ingen konkurrent i legaltech-segmentet sitter här.
4. Skandinavisk modernitet — petrol/grön är en etablerad nordisk designfärg men flaskgrön är rikare och mer mättad.

**Kandidater som vägdes bort:**
- Marinblå (#0C1B33) — auktoritär men för nära banking/corporate. Tusentals B2B-SaaS-produkter äger det rummet.
- Burgundy (#1F0C0C) — modigaste valet, ovanligaste, men associeras med vin/mat-kategorin och riskerar att kommunicera fel register för juridisk info.
- Petrol (#0C1F20) — nära besläktad med flaskgrön men kyligare och blandas ihop med marinblå i mörkt läge. Flaskgrön är rikare.

**Kontrastverifiering (nya surface-0: #091810):**
- Accent `#CCA84A` mot `#0D2018`: ~8.4:1 — klarar WCAG AA med stor marginal
- Text primary `#EDE8DF` mot `#0D2018`: ~13.8:1 — klarar WCAG AAA
- Text secondary `#C2BDB0` mot `#0D2018`: ~8.2:1 — klarar WCAG AA
- Text muted `#8A8578` mot `#0D2018`: ~5.2:1 — klarar WCAG AA

**Påverkar:** globals.css `--color-surface-*`, alla komponenter med bakgrundsfärg

---

### 2026-03-14 — Accent V4: Mässing #CCA84A (justerad)

**Kontext:** V3-mässingen (#C9A84C) fungerade mot ink-svart. Mot flaskgrön testad och kalibrerad.

**Beslut:** Accent-500 justerad till `#CCA84A` — marginellt mer gul-grön i undertonen för att harmoniera bättre med den gröna basen. Hela paletten kalibrerad i samma riktning.

**Motivering:** Mot svart-brun yta ser mässing orange ut. Mot grön yta behöver mässingen en lätt grönare undertone för att se ut som just mässing (inte guld, inte brons). Förändringen är subtil men meningsfull.

**Påverkar:** globals.css `--color-accent-*`

---

### 2026-03-14 — Severity-tokens omkaliberade för grön bakgrund

**Kontext:** Severity-färgerna var kalibrerade mot near-black ink-yta. Mot grön bakgrund måste text-tokens verifieras.

**Beslut:** Severity-bg och border-alphasvärden lätt höjda (12% → 14%) för ökad synlighet mot grön. Text-tokens omkaliberade:
- Hög: `#F2A090` (~6.4:1 mot sin bakgrund)
- Medel: `#F2D080` (~7.1:1 mot sin bakgrund)
- Info: `#AAD8A0` (~7.0:1 mot sin bakgrund) — ljusare grön, tydligt separerad från sidans bakgrundsgrön
- OK: `#94D0A0` (~7.5:1 mot sin bakgrund)

**Kritisk designanmärkning för info/ok-tokens:** Eftersom sidans bakgrund nu är grön måste info- och ok-flaggornas bakgrund och text vara distinkt nog att inte smälta in. `rgba(100, 170, 110, 0.14)` som bg skapar tillräcklig ljushetsskillnad mot `#0D2018`. Vid komponentbygge: verifiera med axe-core.

**Påverkar:** globals.css `--color-severity-*`, `--color-status-*`

---

### 2026-03-14 — Hero-textur: lodrätt streck ersätter horisontellt

**Kontext:** V3-hero hade en horisontell linje som refererade till §-tecknet. Med ny grön bakgrund testades om det visuella stödet fortfarande fungerar.

**Beslut:** Ersätter horisontell linje med ett subtilt vertikalt streck centrerat i hero-sektionen. Opacity 0.18.

**Motivering:** Vertikalt streck i en bred layout skapar en kompositionell mitt-axel som ger struktur utan att störa. Det refererar till lodräta marginaler i juridiska dokument och till skiljetecknet i logotyp-konceptet. Fungerar bättre med den nya gröna bakgrunden eftersom ett horisontellt streck i grön-grå riskerar att försvinna mot den mättade ytan.

**Påverkar:** hero.tsx

---

## 2026-03-15 — Utökad analysscope: fem idéer utvärderade

**Kontext:** Grundaren föreslog fem utökningar av analysen bortom lagerjämförelse. PM utvärderade varje idé mot GUARDRAILS.md, tekniska constraints (ingen databas, stateless V1) och målgruppsvärde för en 25-åring som ska förhandla.

---

### Beslut per idé

**Idé 1 — Marknadsjämförelse: V1, med hårdkodade benchmarks**

**Beslut:** Ingår i V1 med följande begränsningar och formuleringsregler.

Marknadsjämförelse är information, inte rådgivning — det klarar GUARDRAILS. Utan databas använder vi hårdkodade benchmarks kategoriserade per anställningskategori (tjänsteman, tekniker, ledare). Claude ombeds identifiera kategorin från avtalstexten och returnerar den som ett fält i JSON.

Formuleringsregel som ALDRIG får brytas: "Bland tjänstemän i Sverige är X månader vanlig uppsägningstid enligt Medlingsinstitutets avtalsstatistik." Aldrig "normalt", "bör vara", "kort" — bara "vanlig." Källan ska alltid nämnas. Om kategorin är oklar returneras inget benchmark-värde — bättre tomt än felaktigt.

Hårdkodade benchmarks läggs i en separat TypeScript-fil (`lib/benchmarks.ts`) som kan uppdateras utan att beröra affärslogik. Datan ska vara defensivt konservativ — hellre ett brett intervall än en precision vi inte kan belägga.

**Påverkar:** SPEC.md §2 och §5 (nytt JSON-fält), `lib/benchmarks.ts` (ny fil), systemprompt

---

**Idé 2 — Klausulfrekvens: Ej V1**

**Beslut:** Avvisat för V1. Flytta till V2.

Vi har ingen empirisk data. Att presentera "~15% av avtal" som ett faktum utan källa är vilseledande och underminerar det förtroende som är produktens enda tillgång. Risken är asymmetrisk: om en användare frågar var siffran kommer ifrån har vi inget svar. Det är ett GUARDRAILS-problem i praktiken — vi drar en slutsats utan underlag.

V2-trigger: om vi samlar in anonymiserade metadata om vilka klausuler som förekommer (med explicit consent) kan vi börja belägga frekvenser. Inte före.

**Påverkar:** Inget i V1

---

**Idé 3 — Förhandlingsunderlag / Avvikelsepunkter: V1, med strikt formuleringsregel**

**Beslut:** Ingår i V1 under namnet "Avvikelsepunkter" — aldrig "förhandlingsunderlag."

Begreppet "förhandlingsunderlag" lutar mot handlingsrekommendation och är GUARDRAILS-riskabelt. Vi implementerar det som en aggregerad vy av flaggor som avviker från både lag och marknadsbenchmark (idé 1), presenterade neutralt. Tonen är observation, inte uppmaning.

Formuleringsregel: "Avtalet avviker från lagens minimikrav / vanlig marknadspraxis på följande punkter:" — lista klausuler. Aldrig "du kan förhandla om", "det är rimligt att begära", "ta upp detta med din arbetsgivare."

Tekniskt är detta ingen ny komplexitet — det är en UI-sektion som aggregerar befintliga flaggor med allvarlighetsgrad "hög" plus flaggor med marknadsbenchmark-avvikelse. Ingen ny LLM-logik.

**Påverkar:** SPEC.md §2 och §5 (ny UI-sektion i resultatvy), SPEC.md §6 Flöde 1

---

**Idé 4 — Klarspråksöversättning: V1, redan delvis implementerat**

**Beslut:** Ingår redan i V1 via `klartext`-fältet i JSON-strukturen (SPEC.md §5). PM-beslut: detta fält är obligatoriskt och ska aldrig tillåtas vara tomt eller identiskt med `beskrivning`. Det är produktens viktigaste differentiator för målgruppen.

Utökning som läggs till: Claude instrueras att producera klarspråksöversättning för varje identifierad klausul — inte bara flaggade sådana. En användare som läser sin sekretessklausul ska kunna se "I praktiken innebär detta att du inte kan berätta för familjen att du söker nytt jobb under provanställningen" — inte bara en flagga om klausulen är ovanligt bred.

Formuleringsregel: börja alltid med "I praktiken innebär detta..." eller "Det här betyder att..." — vardagliga inledningar, aldrig juridisk terminologi utan förklaring.

**Påverkar:** SPEC.md §2 och §5 (förtydligat krav på klartext-fält), systemprompt (utökat)

---

**Idé 5 — Checklista saknade villkor: V1, redan delvis implementerat**

**Beslut:** Ingår redan i V1 via `saknade_villkor`-arrayen i JSON-strukturen (SPEC.md §5). PM-beslut: ta bort procentpåståenden ("90% av avtal") utan datakälla. Formulera som "standardvillkor som typiskt förekommer i svenska anställningsavtal" — det är sant, beläggbart och GUARDRAILS-kompatibelt.

Checklistan ska lyftas fram tydligare i UI — det är ett högt värde för en 25-åring som inte vet vad som ska finnas med. Positionen i resultatvyn: efter flaggorna, innan paywall (om saknade villkor är grundläggande villkor) eller som del av betald rapport (om detaljerade).

**Påverkar:** SPEC.md §2 (formuleringsregel), resultatvy-komponent

---

### Sammanfattning V1 vs V2

| Idé | V1 | V2 | Kommentar |
|-----|----|----|-----------|
| Marknadsjämförelse | Ja, hårdkodade benchmarks | Live-data | Kräver `lib/benchmarks.ts` |
| Klausulfrekvens | Nej | Ja, om vi samlar data | Inga fabricerade siffror |
| Avvikelsepunkter | Ja, som UI-aggregering | — | Kräver strikt formulering |
| Klarspråk | Ja, redan i spec | Utöka scope | Obligatoriskt, aldrig tomt |
| Saknade villkor | Ja, redan i spec | — | Ta bort procentpåståenden |

---

### Vad ökar mest perceived value för en 25-åring som ska förhandla

Prioritetsordning baserad på vad målgruppen faktiskt behöver i det konkreta stressmomentet "ska skriva under om tre dagar":

1. **Klarspråk** — förstå vad de skriver under på. Grundläggande. Utan detta är produkten oanvändbar för icke-jurister.
2. **Avvikelsepunkter** — veta vad som är annorlunda än vanligt. Konkret, handlingsbar information utan att ge råd.
3. **Marknadsjämförelse** — kontextualisera avvikelserna. "1 månads uppsägningstid" är meningslöst utan referensram.
4. **Saknade villkor** — veta vad som saknas. Ofta viktigare än vad som finns med men feltolkat.
5. **Klausulfrekvens** — lägst värde utan trovärdig datakälla. Skippa.

**Påverkar:** SPEC.md §2 (uppdateras nedan), systemprompt (nästa session), `lib/benchmarks.ts` (ny fil)

---

---

## 2026-03-15 — Growth Strategist: Konverteringsanalys av utökad analysscope

**Kontext:** PM-besluten ovan (2026-03-15) avgör vad som *får* vara i produkten. Denna analys avgör vad som faktiskt *driver konvertering* från gratis till betald — och hur featurerna bör skiktas mot paywall och prissättning. Growth Strategists perspektiv kompletterar, inte ersätter, PM-analysen ovan.

---

### Vad som faktiskt skapar "detta MÅSTE jag ha"-reaktionen

Det är viktigt att skilja på *perceived value* och *konverteringsdrivare*. En feature kan höja upplevt värde utan att flytta betalningsbeslutet — för att känslan av nödvändighet saknas.

Målgruppen (25-åring, tre dagar på sig att skriva under) befinner sig i ett specifikt mentalt tillstånd:
- Lätt stressad av deadline
- Vet att de inte vet tillräckligt (osäkerheten är känd)
- Söker bekräftelse eller en konkret röd flagga som ger dem mandat att agera
- Har råd med 299 kr men behöver ett skarpt skäl att betala *nu*

Urgency uppstår inte av mängd information — den uppstår av *precision om deras specifika situation*. Rapporten måste kännas som om den pratar om *detta avtal*, inte avtal i allmänhet.

---

### Rankordning efter konverteringsimpact

**Rang 1 — Avvikelsepunkter (Growth-perspektiv: kalla det "Vad som sticker ut")**

PM-beslutet ovan kallar detta "Avvikelsepunkter" av GUARDRAILS-skäl. Rätt beslut. Det är också det enskilt starkaste konverteringsargumentet av alla fem idéer.

Varför: det är det enda analysdjupet som omvandlar rapporten från *faktaark* till *förberedelseverktyg*. En 25-åring som ska skriva under betalar inte för att förstå juridiken bättre i allmänhet — de betalar för att veta *vad i just deras avtal* de bör ha koll på. "Dessa tre punkter avviker" är ett omedelbart handlingsskäl, inte bara läsning.

Konverteringsimpact: hög. Brådskekänsla skapas av specifik avvikelse, inte av generell information.

**Rang 2 — Klarspråksöversättning (delvis gratis, resten betalt)**

Klarspråk är den feature som sänker barriären för att *förstå värdet* av rapporten — det är en aktiveringsdrivare, inte primärt en urgency-drivare. Men det är en förutsättning för att de andra featurerna ska landa.

Konverteringsinspråk: klarspråkets viktigaste roll är i smakprovet. Det är starkare bete än en info-flagga i sin helhet.

**Rekommendation om smakprov (avviker från befintligt beslut 2026-03-14):**

Nuvarande beslut: visa en info-flagga i sin helhet som smakprov. Det demonstrerar format men inte värde. En 25-åring som läser en info-flagga om att övertidsersättning "bör specificeras" förstår inte varför rapporten är värd 299 kr.

Föreslaget alternativ: visa klartext-sammanfattningen av den flagga med *högst* allvarlighetsgrad — utan lagrum, utan avvikelsepunkts-sektionen, men med den vardagliga formuleringen av vad klausulen faktiskt innebär. Exempel: "Din konkurrensklausul gäller i 24 månader utan geografisk begränsning. Det innebär att du under två år efter avslutad anställning inte kan arbeta med liknande uppgifter i branschen." Följt av att fullständig analys, lagrum och avvikelsepunkter finns i rapporten.

Det är fortfarande information, inte råd. Det håller sig inom GUARDRAILS.md. Men det är ett väsentligt starkare bete.

Experiment 1 (quality gate):
- Hypotes: Klartext av allvarligaste flagga som smakprov ökar `payment_started / paywall_shown` med minst 15% jämfört med nuvarande info-flagga
- Metric: `payment_started / paywall_shown` per variant
- Framgångskriterium: +15% lift, p < 0.05, minimum 200 paywall-visningar per variant

**Rang 3 — Marknadsjämförelse**

Kontextualiserar avvikelserna och svarar på den underliggande frågan "är detta normalt?". Hög perceived value, lägre konverteringslyft i sig.

Skäl till lägre rang: det är informativt men sällan akut. En 25-åring som ser "din klausul är ovanlig bland tjänstemän" tänker "intressant" — en som ser "avtalet avviker på tre konkreta punkter" tänker "jag behöver detta nu". Marknadsjämförelse stärker förtroende och sannolikt NPS och återkomst, men det marginella bidraget till det initiala betalningsbeslutet är lägre.

Viktigt i PM-beslutet: formulera som relativ frekvens ("vanlig bland tjänstemän") och citera källa. Undvik exakta percentiler utan empirisk data — trovärdigheten är produktens tillgång.

**Rang 4 — Klausulfrekvens**

PM-beslutet att avvisa V1 stödjs av Growth. Utan trovärdig datakälla är det en trovärdighetsrisk. Korrekt prioritering.

**Rang 5 — Saknade villkor med frekvensdata**

Saknade villkor är redan i spec. Frekvensdata utan källa avvisas korrekt av PM. Ur konverteringsperspektiv: saknade villkor aktiverar oro snarare än handling — de är starkare i betald rapport (bekräftation av köpbeslutet) än som konverteringsargument i sig.

---

### Prisfrågan: bör 299 kr höjas?

**Position:** 299 kr är rätt för V1 utan smakprovsändring. 349–399 kr är motiverat om avvikelsepunkter + förbättrat smakprov ingår vid launch.

**Motivering:**

Med den nuvarande scopingen (lagjämförelse + flaggor + saknade villkor) är produkten ett faktadokument. 299 kr är korrekt prisat för det.

Med avvikelsepunkter + förbättrat klarspråkssmakprov är produkten ett förberedelseverktyg. Det är en substantiell skillnad i perceived value. En 25-åring betalar 299 kr för information men 349–399 kr för ett verktyg som gör dem konkret bättre förberedda på ett specifikt samtal.

Observera: att höja till 499 kr är fortfarande för tidigt utan social proof. Den smärtgränsen gäller tills vi har recensioner, PR-nämningar eller en etablerad konverteringshistorik.

Experiment 2 (quality gate):
- Hypotes: Användare med 3+ höga flaggor konverterar till 399 kr i samma grad som till 299 kr
- Metric: `payment_completed / paywall_shown` segmenterat per flaggantal hög
- Framgångskriterium: Ingen statistiskt signifikant skillnad i konverteringsgrad → höj permanent till 399 kr
- Timing: kör vecka 5+ efter att baseline är etablerad

---

### Paywall-sektion: vad som ska kommuniceras

Befintligt beslut (2026-03-14) beskriver vad som ingår betalt. Growth-perspektiv på *hur det kommuniceras* vid paywallen:

Den starkaste paywall-rubriken är inte "Fullständig rapport" — det är en sekvens av tre rader:
1. Vad avviker (antal avvikelsepunkter, angivet numeriskt)
2. Vad du förstår med rapporten (klarspråk för alla flaggor)
3. Vad det kostar (299 kr — engångsbetalning)

Utan den första raden (avvikelsepunkter) saknar paywallen urgency. Med den har användaren ett faktabaserat skäl att betala — inte FOMO, utan konsekvens av vad de just sett.

Experiment 3 (quality gate):
- Hypotes: Att lyfta antalet avvikelsepunkter som primärt argument i paywall-rubriken ökar `payment_started / paywall_shown` med minst 10%
- Metric: `payment_started / paywall_shown`
- Framgångskriterium: +10% lift

---

### Beslut som kräver PM-bekräftelse

Dessa frågor är inte lösta av PM-analysen ovan och kräver gemensamt beslut:

1. Smakprov: byta från info-flagga → klartext av allvarligaste flagga (Growth rekommenderar byta, se Experiment 1)
2. Pris vid launch: 299 kr (konservativt) eller 349 kr om avvikelsepunkter ingår vid dag ett (Growth lutar mot 349 kr om avvikelsepunkter är med)
3. Paywall-rubrik: inkludera antal avvikelsepunkter som primärt argument (Growth rekommenderar ja)

**Påverkar:** SPEC.md §9 (pris), resultatvy-komponent (smakprov + paywall-rubrik), copy-landing.json (paywall-copy)

---

## Öppna förslag

### Förbättringsförslag — Copywriter
**Nuläge:** BRAND.md §Tonalitet anger "max 20 ord per mening i UI-text" som en absolut regel.
**Problem:** Regeln fungerar bra för analyse-text och felmeddelanden men begränsar hero-undertext och consent-text. Naturlig, vardaglig svenska — den ton vi vill ha — söker ibland en något längre mening för att låta mänsklig snarare än hackig. En 22-25-ords-mening som flödar bättre än två korta meningar bör tillåtas i specifikt marknadsförande kontext (hero, paywall-intro).
**Förslag:** Lägg till undantagsklausul: "I hero- och paywall-kontext tillåts upp till 25 ord per mening om det stärker ton och flöde. Regeln gäller strikt för flaggor, felmeddelanden och analystext."
**Motivering:** Copy-längd är ett medel, inte ett mål. Regeln finns för att undvika tunga juridiska meningsmonster — den ska inte producera hackig text där ton offras för räkning.
**Påverkar:** BRAND.md §Tonalitet

---

### 2026-03-14 — Landing page copy V1
**Kontext:** Ingen kundvänd text var skriven. Copywriter-session.
**Beslut:** All copy för landing page, felmeddelanden, consent-steg, paywall, disclaimers (3 platser) och SEO-meta är skriven och sparad i `.claude/copy-landing.json`.
**Motivering:** Ton: kunnig kompis, vardaglig, aldrig säljig. Guardrails följs: ingen AI-mention, ingen "du bör", inga utropstecken i analystexter, inga engelska ord. Privacy-budskapet är konsekvent primärt i trust-kort och CTA-stödtext.
**Alternativ:** Hero-rubriken "Förstå avtalet innan du skriver under" valdes framför alternativ som "Vet du vad du skriver under på?" (för anklagande) och "Koll på ditt jobbavtal" (för lättvindigt).
**Påverkar:** `.claude/copy-landing.json`, landing page-komponenter, email-mallar

---

### 2026-03-15 — Landing page copy V1.1: utökad scope + 349 kr

**Kontext:** Analysen utökades med marknadsjämförelse, klarspråksöversättning och avvikelsepunkter (beslutade 2026-03-15). Pris höjt från 299 kr till 349 kr. Tre inkonsistenser från förra copywriter-session åtgärdade.

**Beslut:**

**Hero H1 behålls:** "Ditt avtal, / mot lagen." — rubriken är stark nog som anker. Den utökade scopens mervärde bärs av undertexten, inte av en utspädd rubrik.

**Hero undertext uppdaterad:** "Sex lagar mot ditt avtal. Vad som är vanligt bland liknande roller. Och vad varje klausul faktiskt innebär." — tre korta meningar täcker alla tre analysaxlar (lag, marknad, klarspråk) utan att rada upp funktionslistor.

**Steg 02 omdöpt:** "Sex lagar" → "Lag och marknad". Beskrivning utökad till att täcka marknadsjämförelse och klarspråk. "Sex lagar" var korrekt men begränsat — det nya steget täcker hela analysbredden.

**Steg 03 uppdaterad:** Undertexten specificerar nu vad användaren faktiskt vet efter rapporten — lag, marknad, klartext — i stället för att lista möjliga handlingar. Mer precist, lika neutralt.

**Pris 349 kr:** Uppdaterat i hero.tsx (priscell), copy-landing.json (pris-objekt, paywall, avslutande_cta).

**Tre inkonsistenser åtgärdade (flaggade i BESLUT.md 2026-03-14):**
1. `avslutande_cta.undertext`: "kostar ingenting att prova" → "Den fullständiga rapporten kostar 349 kr." Sanningsenligt.
2. `seo_meta.startsida.title`: "Granska ditt anställningsavtal gratis" → "Granska ditt anställningsavtal — se vad lagen säger". Inte vilseledande.
3. `disclaimer_tre_platser.rapport_botten`: Tillägg om att marknadsjämförelser inte är juridiskt bindande underlag — nödvändigt när benchmarks ingår i rapporten.

**Paywall-intro och lista uppdaterade:** Reflekterar klarspråk, marknadsjämförelse och avvikelsepunkter som betalda delar. Priset "349 kr" explicit i paywall-objektet.

**Alternativ som vägdes bort:**
- Ny H1 "Ditt avtal — lag, marknad, klartext" — valt bort, för listelliknande och förlorar den dramatiska kontrasten i originalet.
- Steg 02 titel "Tre lager" — valt bort, för abstrakt utan förklaring.
- Steg 03 titel bibehöll "Du bestämmer" — behållet, det är den starkaste raden i hela sektionen.

**Påverkar:** `hero.tsx`, `how-it-works.tsx`, `.claude/copy-landing.json`

---

## 2026-03-15 — PDF-parsing + PII-stripping + Consent (steg 3+4)

**Kontext:** Frontend Builder implementerade client-side PDF-parsing och PII-stripping enligt GUARDRAILS §Privacy.

### Arkitekturbeslut: pdfjs-dist med dynamisk import

**Beslut:** `parsePdf()` importerar pdfjs-dist med dynamisk `import()` i stället för statisk import.
**Motivering:** pdfjs-dist är ett tungt paket (~3 MB) som enbart används när en fil faktiskt laddas upp. Dynamisk import innebär att det inte ingår i initial bundle, vilket ger bättre LCP. Dessutom undviker det SSR-krascher om komponenten av misstag renderas server-side. TypeScript löses via `as any` med kommentar — motiverat undantag, dokumenterat.
**Alternativ:** Statisk import i lib-fil — valt bort, onödig initial bundle-vikt.
**Påverkar:** `src/lib/pdf-parser.ts`

---

### Arkitekturbeslut: worker-kopiering via postinstall-script

**Beslut:** `scripts/copy-pdf-worker.mjs` körs som npm postinstall och kopierar `pdf.worker.min.mjs` till `public/`.
**Motivering:** Next.js App Router stöder inte webpack-baserad worker-kopiering lika enkelt som Pages Router. Postinstall-script är transparent, kontrolleras av projektet och behöver inte underhållas per Next.js-version.
**Alternativ:** Webpack CopyPlugin — valt bort, kräver extra devDependency och är mer komplext. Extern CDN-URL för worker — GUARDRAILS-problem: extern nätverksbegäran under dokumentbearbetning.
**Påverkar:** `scripts/copy-pdf-worker.mjs`, `package.json`

---

### Arkitekturbeslut: PII-strippning körs synkront i setTimeout(0)

**Beslut:** `stripPii()` är synkron men wrappas i `setTimeout(0)` i `analysis-flow.tsx` för att inte blockera UI-transition från "processing" till "consent".
**Motivering:** React batchar inte tillståndsuppdateringar med synkrona loopar utan mikrotask-bryt. Utan `setTimeout(0)` upplevs processing-state som osynlig — skärmen hoppas direkt till consent utan att visa laddningsindikatorn. `setTimeout(0)` ger React ett renderingsfönster.
**Påverkar:** `src/components/analysis-flow.tsx`

---

## Förbättringsförslag — Frontend Builder

### Förbättringsförslag — PII-stripping: lookbehind-stöd i äldre iOS Safari

**Nuläge:** `pii-stripper.ts` använder regex lookbehind (`(?<=...)`) för namn-heuristiken.
**Problem:** Lookbehind-assertions stöddes inte i Safari förrän version 16.4 (mars 2023). iOS Safari 15 och äldre (fortfarande ~4% av svenska mobilanvändare) kommer att krascha på dessa mönster.
**Förslag:** Byt ut lookbehind mot capture groups med replace-callback. Exempel: `/(?:arbetstagare|anställd)\s*:\s*([A-ZÅÄÖ][\w\s]+)/gi` med callback som returnerar match[0].replace(match[1], "[PART A]").
**Motivering:** Privacy-funktionen är kritisk och får inte krascha på målgruppens enheter. Regression-risk vid nuläge är låg men icke-noll.
**Påverkar:** `src/lib/pii-stripper.ts`

---

### Förbättringsförslag — next.config.ts: canvas-alias kan ge problem i framtida Next.js-versioner

**Nuläge:** `canvas: false` sätts i webpack-alias för att tysta pdfjs-dist:s optionella canvas-dependency.
**Problem:** Detta mönster fungerar i Next.js 16 men kan ge "Module not found: Can't resolve 'canvas'" i Vercel Edge-miljöer beroende på deploy-konfiguration.
**Förslag:** Verifiera att bygget är felfritt på Vercel vid steg 15 (Deploy). Om problem uppstår: lägg till `canvas` som explicit externals snarare än resolve-alias.
**Motivering:** Förebyggande dokumentation — blockerar inte V1 men bör verifieras i CI.
**Påverkar:** `next.config.ts`

---

## 2026-03-15 — UX Design: Rapportsida /rapport

**Kontext:** Stripe Checkout är klart (steg 7). Nästa steg är att bygga den dedikerade rapportsidan som användaren landar på efter betalning. UX Designer har granskat samtliga aspekter av sidan och fattat beslut nedan.

**Påverkar:** `src/app/rapport/page.tsx` (ny), `src/components/report/` (ny mapp), `src/components/analysis-flow.tsx` (Stripe-redirect-destination)

---

### 2026-03-15 — Post-payment redirect: landing direkt på /rapport, inte landing page

**Kontext:** Nuvarande flöde redirectar Stripe till `/?session_id=cs_xxx`. Användaren landar i toppen av landing page och måste scrolla för att hitta sina resultat.

**Beslut:** Stripe success_url pekar på `/rapport?session_id=cs_xxx`. Rapporten renderas på en dedikerad sida, inte inbäddad i landing page.

**Motivering:**
Landing page är en marknadsföringssida — den är byggd för att konvertera nya besökare. En betalande kund som just avslutat ett köp befinner sig i ett fundamentalt annorlunda mentalt tillstånd: de vill ha resultatet de betalat för, inte läsa rubrikcopy om varför de borde betala. Att landa på en marknadsföringssida efter genomförd betalning skapar kognitiv dissonans och eroderar förtroendet. En dedikerad /rapport-sida är även tekniskt renare: sessionStorage-logiken, verifieringsflödet och rapportrendering lever i ett eget scope.

**Alternativ:** Bibehåll landing page + scroll-anchor (`/?session_id=cs_xxx#rapport`) — valt bort. Anchor-scroll är skört, beror på DOM-timing efter sessionStorage-återställning, och sidan ser fortfarande ut som en marknadsföringssida.

**Påverkar:** `src/app/api/checkout/route.ts` (success_url), `src/app/rapport/page.tsx` (ny)

---

### 2026-03-15 — Rapportsidans informationshierarki

**Beslut:** Ensidig layout med fast ordning uppifrån och ned. Alla fynd är synliga på en sida — ingen paginering.

**Strukturen:**

```
1. Rapport-header        — kontraktnamn (om tillgängligt), anställningsform, datum
2. Sammanfattning        — sammanfattning-texten + anställningskategori-badge
3. Avvikelsepunkter      — om flaggor med "hög" + benchmark_avvikelse=true finns
4. Flaggor — Hög         — alla höga flaggor, expanderade som default
5. Flaggor — Medel       — alla medelflaggor, kollapsade som default
6. Flaggor — Info        — alla info-flaggor, kollapsade som default
7. Marknadsjämförelse    — tabellvy, om anstallningskategori != "oklart"
8. Saknade villkor       — lista
9. Disclaimer            — en av de tre obligatoriska placeringarna
10. Åtgärdsfält          — se separat beslut
```

**Motivering för expanderat/kollaps-val:**
Höga flaggor expanderas automatiskt eftersom de representerar de avvikelser användaren betalat för att förstå — att kräva ett klick för att se dem skapar onödig friktion och signalerar att de inte är viktiga. Medel och info kollapsas för att sidan ska vara skalbar: ett avtal med 8 medelflaggor och 5 info-flaggor skapar en enorm sida om allt är öppet. Kollapsade sektioner med synlig sammanfattning (titel + klartext-preview i en rad) ger tillräcklig orientering utan att tvinga läsning.

**Alternativ som vägdes bort:**
- Alla expanderade — skalar dåligt, en höjd sida med 15 flaggor gör det svårt att navigera
- Alla kollapsade — skapar en "klick-mur", minskar perceived value direkt
- Paginering (en flagga per sida) — förhindrar helhetsbild, gör det omöjligt att skanna

**Påverkar:** `src/app/rapport/page.tsx`, `src/components/report/flag-section.tsx`

---

### 2026-03-15 — Flaggkortets layout

**Beslut:** Varje flaggkort har tre lager med progressivt djup. Alltid synlig: severity-badge + kategori-chip + titel + klartext (max 2 rader). Expanderat: beskrivning, avtalets text vs lagens krav (sida vid sida på desktop, staplade på mobil), lagrum. Alltid synlig i botten av expanderat kort: frågor att ställa arbetsgivaren (om fältet finns i JSON-outputen — notera: detta är ett förslag om nytt JSON-fält, se öppna förslag nedan).

**Visuell hierarki inom kortet:**
```
[ Severity-badge ]  [ Kategori-chip ]              [ Expandera-ikon ]
  Titel
  Klartext (2 rader, avskuren med ellipsis om mer)

--- expanderat ---
  Beskrivning (juridisk text, muted)

  Avtalets text                  |   Lagens krav
  [citat ur avtalet]             |   [lagrum-krav]
  JetBrains Mono, muted bg       |   JetBrains Mono, muted bg

  Lagrum: [referens]             [Kopiera lagrum-länk]
```

**Interaktionsmönster:**
- Hel kortyta är klickbar (trigger: klick/Enter/Space)
- Feedback: smooth height-transition (200ms ease-out), chevron-ikon roterar 180°
- `prefers-reduced-motion`: transition sätts till 0ms, chevron byter direkt
- Hover: border-color lyfts ett steg (--border → --border-strong), ingen bakgrundsförändring
- Focus: synlig focus-ring med --color-accent-500

**Reversibilitet:** Klick kollapsar. Inga destruktiva handlingar i kort — ingen recovery behövs.

**Tillgänglighet:**
- `<button>` med `aria-expanded` och `aria-controls`
- `role="region"` på det expanderade innehållet
- Klartext är alltid synlig (aldrig dold bakom expand) — screen reader kan alltid nå kärnbudskapet

**Påverkar:** `src/components/report/flag-card.tsx` (ny)

---

### 2026-03-15 — Åtgärdsfält (spara länk, ladda ned PDF, ny granskning)

**Beslut:** Dubbelt åtgärdsfält: ett sticky top-bar och ett inline bottom-bar. Samma tre actions, olika prioritetsordning.

**Sticky top-bar (compact):**
- Vänster: "Clause & Effect" logotyp (liten) — orientering om var man är
- Höger: tre knappar i ordning: [Ladda ned PDF] [Spara länk] [Granska nytt avtal ↗]
- Sticky vid scroll, försvinner inte
- Höjd max 48px — tar inte meningsfull skärmyta

**Inline bottom-bar (efter disclaimer):**
- Primär CTA: [Ladda ned PDF] — fylld knapp, accent
- Sekundär: [Spara länk] — outline-knapp
- Tertiär: [Granska nytt avtal] — textlänk
- Under knapparna: "Länken är giltig i 30 dagar. Inget konto krävs."

**Prioritetsordning-motivering:**
Ladda ned PDF är den primära åtgärden — det är ett konkret leveransobjekt som användaren tagit med sig från köpet. Spara länk är sekundär — värdefull men kräver att man förstår 30-dagarsmodellen. Granska nytt avtal är en framtida action för ett annat tillfälle, inte primär efter första läsning.

**Varför sticky top-bar:**
Rapporten är lång. En användare som läser en medelflagga på mitten av sidan ska inte behöva scrolla tillbaka till toppen för att ladda ned PDF. Sticky top-bar löser det utan att dölja innehåll — den är tillräckligt kompakt.

**Alternativ som vägdes bort:**
- Enbart bottom sticky — osynlig tills man scrollat klart hela rapporten
- Floating action button — bryter varumärkesidentiteten (Berlin 3000 är sharp och plan, FABs signalerar Material Design)
- Sidebar — för komplex på mobil, onödig för tre actions

**Påverkar:** `src/components/report/report-action-bar.tsx` (ny), `src/app/rapport/page.tsx`

---

### 2026-03-15 — Spara länk: copy-to-clipboard med fallback, utan QR

**Beslut:** "Spara länk"-knappen kopierar URL till clipboard. Feedback: knapp-etikett byter till "Kopierad" i 2 sekunder, sedan tillbaka. Ikon: Copy → Check. Ingen QR-kod i V1.

**URL-hantering:**
Länken är `/rapport?r=[base64url-token]` där token är en komprimerad representation av analysresultatet. Synlig URL-längd är inte ett problem i sig — den visas aldrig rå för användaren, de kopierar den via knappen. Implementationsdetalj för UI Developer: använd `navigator.clipboard.writeText()` med fallback till `document.execCommand('copy')` för iOS Safari < 13.4.

**Feedbacksekvens:**
1. Klick → `navigator.clipboard.writeText(url)` anropas
2. Lyckat: ikon byter Copy→Check, etikett "Spara länk"→"Kopierad", bakgrund lyfts lätt (surface-100→surface-200)
3. Efter 2000ms: återställ till ursprungsläge
4. Fel (clipboard ej tillgängligt): inline text under knappen: "Kunde inte kopiera — markera och kopiera länken manuellt." + URL i ett readonly input-fält som automatiskt selekteras.

**Varför inte QR:**
QR-koder är ett delningsprimitivt som löser problemet "jag vill skicka detta till min mobil från desktop". Vår målgrupp är redan på mobil eller vill dela länken digitalt — copy-to-clipboard täcker 99% av use cases. QR lägger till visuell komplexitet och ett biblioteksberoende för ett edge case.

**Påverkar:** `src/components/report/report-action-bar.tsx`

---

### 2026-03-15 — Omgranskning: upload ny version från rapportsidan

**Beslut:** "Granska nytt avtal"-knappen navigerar till landing page med en query-param `?revision=true`. Landing page visar en smal informationsbanderoll högst upp: "Du granskar en reviderad version. Betalning krävs inte igen." Upload-flödet är identiskt med normal granskning.

**Jämförelsevy: Nej i V1.**
Ingen sida-vid-sida-jämförelse mellan gammalt och nytt resultat i V1. Motivering: arkitekturen är stateless utan databas. Att lagra det gamla resultatet i sessionStorage under en ny analys-session är tekniskt möjligt men leder till komplex state-hantering, en lång analysvy, och ett UX-problem: vad händer om användaren stänger fönstret mitt i den nya analysen? Gammal rapport är borta, ny rapport är ofullständig.

**Jämförelsevy V2:** Implementeras när vi har persistent lagring (databas eller signerade URL-tokens med längre TTL). Då kan vi visa "Förra versionen flaggade X — den nya versionen har löst Y, Z kvarstår."

**ce_unlocked-flaggans roll:**
`ce_unlocked=true` i sessionStorage signalerar att Stripe-betalning redan genomförts. Rapportsidan kontrollerar denna flagga. Om den saknas och `?session_id=` saknas: visa betalvägg. Om den finns: visa full rapport utan ny betalning. "Granska nytt avtal"-flödet förlitar sig på denna flagga för att skippa Stripe.

**Alternativ som vägdes bort:**
- Modal för upload direkt på rapportsidan — bryter flödet, kräver att rapportsidan hanterar upload-state
- Sida-vid-sida i V1 — för komplex utan databas, som beskrivet ovan
- Separat /omgranska-route — onödig routing, landing page med revision-param är tillräckligt

**Påverkar:** `src/app/rapport/page.tsx`, `src/components/analysis-flow.tsx`, `src/app/page.tsx` (revision-banner)

---

### 2026-03-15 — Tomma tillstånd och felflöden på /rapport

**Beslut:** Tre distinkta fall, alla med inline recovery utan modal.

**Fall 1 — SessionStorage tömd, ingen session_id i URL:**
```
Sidan visar:
  Rubrik: "Rapporten hittades inte"
  Text: "Rapporten sparas tillfälligt i webbläsaren och är inte längre tillgänglig."
  Primär CTA: [Starta ny granskning] → /
  Sekundär: "Har du en sparad länk? Klistra in den i adressfältet."
```
Ingen felsida, ingen 404. Sidan renderas normalt med ett informationsläge. Användaren förstår varför och vet vad de kan göra.

**Fall 2 — Token-länk har gått ut (30 dagar passerat):**
```
Sidan visar:
  Rubrik: "Den här länken har gått ut"
  Text: "Delade rapportlänkar är giltiga i 30 dagar. Den här länken är inte längre aktiv."
  Primär CTA: [Starta ny granskning] → /
```
Ingen ursäkt, ingen säljtext. Neutral konstatering. Användaren vet exakt varför.

**Fall 3 — Verifiering av session_id misslyckas (Stripe-fel):**
```
Sidan visar:
  Rubrik: "Vi kunde inte verifiera betalningen"
  Text: "Försök öppna sidan igen. Om problemet kvarstår, kontakta oss på [email]."
  Primär CTA: [Försök igen] → laddar om
  Sekundär: Kontaktlänk med ifyllt subject "Verifieringsfel — [session_id]"
```
Detta är ett tekniskt fel — ge användaren ett handlingsalternativ, inte bara ett felmeddelande.

**Designprincip för alla tre fall:**
Felvisualisering lever på sidan i samma layout som normal rapport-header. Ingen hel-sidesomritning, ingen avvikande layout. Användaren stannar i rapportens kontext och vet att sidan existerar men att just detta tillfälle inte fungerar.

**Påverkar:** `src/app/rapport/page.tsx`, `src/components/report/report-empty-state.tsx` (ny)

---

## Öppna förslag — UX Designer

### Förbättringsförslag — UX Designer: Nytt JSON-fält "fragör_att_stalla"

**Nuläge:** Flaggor innehåller: allvarlighet, kategori, titel, beskrivning, klartext, lagrum, avtalets_text, lagens_krav, benchmark_avvikelse.

**Problem:** En 25-åring som fått bekräftat att konkurrensklausulen avviker från lag vill veta vad de konkret kan göra med den informationen — men GUARDRAILS förbjuder handlingsrekommendationer. Det skapar ett upplevt värdelucka: "okej, det avviker, men vad nu?"

**Förslag:** Lägg till ett frivilligt fält `fragor_att_stalla: string[]` i flagg-objektet. Fältet innehåller neutrala informationsfrågor som arbetstagaren kan ställa — formulerade som frågor, inte råd. Exempel för en lång konkurrensklausul: ["Vad är arbetsgivarens motivering för 24 månaders giltighetstid?", "Gäller klausulen även om anställningen avslutas under provanställningen?"]. Dessa är informationssökande frågor, inte förhandlingstaktik. GUARDRAILS-kompatibelt: vi säger inte "ställ dessa frågor" — vi ger information om vilka frågor som är relevanta att ställa baserat på klausulens innehåll.

**Motivering:** Det höjer produktens perceived value utan att korsa GUARDRAILS-linjen. Skillnaden mot "du bör fråga" är tonen: detta är en lista med möjliga relevanta frågor, inte en instruktion. Liknar det sätt en kunnig kollega säger "du kanske vill veta mer om..." snarare än "du ska göra..."

**Påverkar:** SPEC.md §5 (JSON-schema), GUARDRAILS.md (kräver explicit godkännande), systemprompt

---

### Förbättringsförslag — UX Designer: Rapportens "allvarlighetssumma" i browser-titeln

**Nuläge:** Browser-titel för /rapport är sannolikt "Clause & Effect" eller liknande.

**Problem:** En användare med flera flikar öppna kan inte identifiera sin rapport-flik.

**Förslag:** Sätt browser-titeln dynamiskt: "3 höga flaggor — Clause & Effect" baserat på analysresultatet. Implementeras som `document.title` i en useEffect eller som Next.js metadata via `generateMetadata` med searchParams.

**Motivering:** Litet UX-detalj med oproportionerligt hög nytta för en målgrupp som har 15 flikar öppna. Noll extra implementation-komplexitet.

**Påverkar:** `src/app/rapport/page.tsx`
