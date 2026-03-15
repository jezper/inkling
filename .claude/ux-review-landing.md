# UX Review — Landing Page
Datum: 2026-03-14
Granskare: UX Designer

---

## Sammanfattning

Grundstrukturen är sund och tonaliteten stämmer väl mot BRAND.md. Produkten kommunicerar kärnerbjudandet tydligt och undviker fällorna (inga AI-mentions, inga utropstecken, klarspråk genomgående). Däremot finns strukturella svagheter: sidan saknar ett konverteringsdrivande avslut, trust-sektionen sitter fel i flödet, och det finns ingen mekanisme som reducerar den primära barriären — rädslan att ladda upp ett känsligt dokument.

---

## 1. Sektionsordning

### Nuläge
Hero → Hur det funkar → Vad analysen granskar → Trygghet → Footer

### Bedömning: Delvis rätt, men Trust är placerad fel

Trust-sektionen löser en invändning: "Vill jag ladda upp ett känsligt dokument?" Den invändningen uppstår senast i sekund 3 på sidan — inte efter att användaren läst igenom tre sektioner. Privacy-argumentet är produktens starkaste differentiator och behöver ligga tidigt.

Rätt ordning för personas (22–35 år, ska skriva under inom dagar):

```
1. Hero           — Kärnlöftet + CTA
2. Trust          — Löser privacy-invändningen direkt
3. Hur det funkar — Nu när trust är etablerat: visa processen
4. Vad analysen granskar — Detaljdjup för den som vill veta mer
5. CTA-sektion    — Saknas helt idag (se punkt 4)
6. Footer
```

Motivering: Konverteringspsykologi. Användaren måste svara "ja" på frågorna i denna ordning: (1) Är detta relevant för mig? (2) Kan jag lita på det? (3) Hur funkar det? (4) Vad får jag? (5) Gör det nu. Nuläget hoppar direkt till (3) och låter (2) vänta till sent i flödet.

---

## 2. Vad som saknas

### 2a. Avslutande CTA-sektion — kritisk brist

Sidan slutar med en trust-sektion och sedan footer. Det finns ingen nedre CTA. Användare som scrollat hela sidan är de mest motiverade — de ska mötas av en tydlig uppmaning att ladda upp, inte av copyright-text.

Behov: En enkel sektion med rubriken ungefär "Redo att granska ditt avtal?" och samma primär-CTA som i hero.

### 2b. Social proof saknas helt

För en ny produkt utan varumärkeskännedom är social proof den starkaste konverteringsfaktorn. Sidan har ingenting: inga citat, inga siffror, inget.

Alternativ att väga mot varandra (i prioritetsordning för V1):
- Räknare: "X avtal granskade hittills" — kräver backend, inte V1
- Citat från tidiga testanvändare — låg kostnad, hög effekt om äkta
- Specificerat värdeargument i siffror: "Granskar 8 punkter mot 5 lagar på under en minut" — kräver inga externa källor

Minsta möjliga sociala signal utan externa källor är att konkretisera värde med siffror. Det är trovärdigt och kräver ingen tredje part.

### 2c. FAQ saknas

Primära frågor som målgruppen ställer sig och som inte besvaras på sidan:
- "Vad händer med mitt dokument?"
- "Är det verkligen gratis?"
- "Vad händer om avtalet är på engelska?"
- "Gäller det bara PDF?"
- "Är det verkligen inte juridisk rådgivning?"

Privacy-frågan besvaras delvis i Trust-sektionen, men de övriga lämnas öppna. Obehandlad osäkerhet dödar konvertering. En FAQ med 4–5 frågor under analysdelen eller innan footer löser detta utan att tynga övriga sektioner.

### 2d. Paywall-förväntning saknas

SPEC §6 beskriver att resultatvyn har en paywall: gratis sammanfattning, betald fullrapport. Sidan nämner "Gratis förhandsvisning" under hero-CTA:n, men förklarar aldrig vad det innebär eller vad den betalda delen tillför. Detta skapar en friktion-spike när paywall visas — användaren känner sig lurad.

Rekommendation: Explicit kommunicera modellen på landing page. Inte i brödtext — i ett litet stycke nära upload-CTA eller i FAQ. Exempelformulering: "Sammanfattning visas gratis. Full analys med alla flaggor och lagrumshänvisningar är betald."

---

## 3. Copy-tonalitet per BRAND.md

### Hero

"Förstå ditt anställningsavtal innan du skriver under" — perfekt. Direkt, icke-alarmistisk, speglar kärnlöftet exakt.

"Ladda upp ditt avtal och få en analys mot svensk arbetsrätt. Ingen registrering, inga konton. Ditt dokument lämnar aldrig din enhet." — Bra. Tre separata löften på tre rader. Fungerar.

"PDF-format. Gratis förhandsvisning." — Svag. Informationen är nödvändig men formuleringen är ett plasteringsalternativ, inte ett värdeargument. Se förbättringsförslag nedan.

### Hur det funkar

Steg 1–3 är korrekt tonläge. Steg 2 ("Personuppgifter tas bort") är produktens starkaste differentiator och placeras som mellanlager utan extra vikt. Det bör framhävas mer.

### Vad analysen granskar

Rubrik: "Vad analysen granskar" — neutral och informativ, passar. Ingenproblem.

Brödtext nämner lagarnas officiella namn utan parentes-förklaring. "LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen" — för en 25-åring som googlade "anställningsavtal" är LAS inte ett känt begrepp. Klarspråksprincipen kräver förklaring eller en parentesformulering: "LAS (regler om uppsägning), Semesterlagen...".

### Trust

"Byggt för din trygghet" — rubriken är generisk och marginellt meningsbär. Specificera hellre: "Ditt avtal stannar på din enhet" eller liknande. "Trygghet" är ett tomt ord i denna kontext.

Punkterna i sig håller rätt ton. "Vi citerar lag och jämför mot ditt avtal. Vi ger aldrig juridiska rekommendationer." — precis rätt.

### Footer

Disclaimer-texten är korrekt och nödvändig. Den sitter där den ska.

---

## 4. Övriga iakttagelser

### Hero CTA: anchor-länk utan destination

`href="#upload"` pekar på ett element med `id="upload"` som inte existerar i någon av komponenterna. Upload-funktionaliteten är ännu inte byggd, men ankar-länken bör antingen tas bort tills vidare eller ersättas med `/upload` som sida. Som det ser ut nu händer ingenting vid klick (eller sidan scrollar till toppen). Det är en dead end vid första interaktionen.

### HowItWorks: steg-nummer utan visuell sekvens

Steg-numren renderas som text ("Steg 1") under ikonen, men eftersom ikonerna är cirklar utan nummer finns ingen visuell sekvens. Antingen: lägg numret inuti cirkeln (ta bort ikonen), eller: lägg till ett horisontellt flöde med pilar/linje mellan stegen på desktop. Som det ser ut nu kommunicerar sekvensen endast via textetiketten.

### AnalysisCovers: `AlertTriangle` för "Arbetstid och övertid"

`AlertTriangle` signalerar varning/fara. Det bryter mot GUARDRAILS §Brand: "ALDRIG enbart färg för att kommunicera information" gäller även ikon-semantik. "Arbetstid och övertid" är en neutral analysKategori, inte en varning. Välj en neutral ikon (t.ex. `Clock` är redan använd — `Timer` eller `CalendarClock` passar bättre).

### Trust och HowItWorks: overlap i budskap

Steg 1 i HowItWorks: "Dokumentet stannar på din enhet" och Trust punkt 1: "Dokumentet lämnar aldrig din enhet" kommunicerar exakt samma sak. Repetition har värde för trust-building, men i detta fall konkurrerar de med varandra istället för att komplettera. Om Trust flyttas upp (se sektionsordning ovan) bör HowItWorks-steg 1 formuleras om för att fokusera på handlingen ("Välj din PDF"), inte privacy-löftet.

---

## 5. Förbättringsförslag

### Förslag 1 — Sektionsordning
**Nuläge:** Trust hamnar sent i flödet
**Problem:** Privacy-invändningen uppstår omedelbart, besvaras för sent
**Förslag:** Flytta Trust till position 2 (direkt efter Hero)
**Motivering:** Konverteringsdata på service-produkter med känsliga dokument visar konsekvent att privacy-bekräftelse behöver komma innan processbeskrivning
**Påverkar:** page.tsx (komponentordning), HowItWorks (steg 1 formulering)

### Förslag 2 — Lägg till avslutande CTA-sektion
**Nuläge:** Sidan avslutas med trust-punkter och footer
**Problem:** Motiverade användare som scrollat klart möter ingen uppmaning
**Förslag:** Ny komponent `cta-bottom.tsx` med rubrik + samma primary-knapp som hero
**Motivering:** Standardmönster med stark evidensbas. Nollkostnad att implementera
**Påverkar:** Ny komponent, page.tsx

### Förslag 3 — Synliggör affärsmodellen i hero
**Nuläge:** "Gratis förhandsvisning" utan förklaring av vad det innebär
**Problem:** Skapar friktion-spike vid paywall om användaren inte är förberedd
**Förslag:** Ersätt med "Sammanfattning alltid gratis. Full analys är betald." eller lägg till FAQ-post
**Motivering:** Transparent kommunikation om affärsmodell ökar, inte minskar, konvertering — den som vet vad som är gratis är mer benägen att komma igång
**Påverkar:** hero.tsx, ev. ny faq.tsx

### Förslag 4 — FAQ-sektion
**Nuläge:** Saknas
**Problem:** Obehandlade frågor om format, innehåll och privacy dödar konvertering tyst
**Förslag:** Ny komponent `faq.tsx` med 4–5 frågor. Placering: efter AnalysisCovers, innan avslutande CTA
**Motivering:** Besökarens mentala modell behöver kalibreras. FAQ är det lägst hängande frukten för att reducera exit-rate
**Påverkar:** Ny komponent, page.tsx

### Förslag 5 — Förklara lagar i AnalysisCovers
**Nuläge:** Lagar listas med officiella namn utan förklaring
**Problem:** "LAS" är okänt för primärpersonan
**Förslag:** Lägg till kort parentesförklaring per lag, eller ersätt lagarnas namn med vad de reglerar
**Motivering:** BRAND.md: "Klarspråk. Användaren är intelligent men inte arbetsrättsjurist."
**Påverkar:** analysis-covers.tsx

---

## 6. Krav som uppfylls

- Inga AI-mentions i kundvänd text
- Inga utropstecken
- Inga engelska ord där svenska finns
- Inga emojis
- Disclaimer i footer
- Focus-visible hanteras i CTA-knappen
- Semantisk HTML (section, h1/h2/h3, ol, ul, footer)
- Inline-felhantering specificerad i GUARDRAILS uppfylls inte på landing page (inte relevant — ingen interaktivitet ännu)

---

## 7. Prioritering

| Prioritet | Åtgärd | Anledning |
|-----------|--------|-----------|
| 1 | Fixa `href="#upload"` — dead end vid första klick | Bruten primär-CTA |
| 2 | Flytta Trust till position 2 | Konverteringseffekt, låg implementationskostnad |
| 3 | Lägg till avslutande CTA-sektion | Hög konverteringseffekt, minimal kod |
| 4 | Kommunicera affärsmodellen tydligare | Förebygger tapp vid paywall |
| 5 | FAQ-sektion | Reducerar exit-rate |
| 6 | `AlertTriangle`-ikon i AnalysisCovers | GUARDRAILS-principen om ikon-semantik |
| 7 | Förklara lagnamn i klarspråk | Klarspråkskrav |
