# Anställningsavtalsgranskning — Produktspecifikation v1

> Alla spec-filer är utgångspunkt, inte tak. Varje expertroll har mandat att förbättra dem.

---

## 1. Vad vi bygger

En webbapplikation där användare laddar upp sitt anställningsavtal (PDF) och får en strukturerad analys: vad som är standard, vad som avviker från svensk arbetsrätt, och vad som är ovanligt eller riskabelt.

### Kärnlöftet
"Förstå ditt anställningsavtal innan du skriver under."

### Vad det INTE är
- Inte juridisk rådgivning. Aldrig "du bör göra X." Alltid "lagen säger Y, avtalet säger Z."
- Inte en generisk AI-kontraktsgranskare.
- Inte en plattform med konton i V1.

---

## 2. V1 Scope — Sverige

### Relevanta lagar
- **LAS** (SFS 1982:80) — uppsägning, turordning, provanställning
- **Semesterlagen** (SFS 1977:480) — semester, semesterlön
- **Arbetstidslagen** (SFS 1982:673) — arbetstid, övertid, dygnsvila
- **Diskrimineringslagen** (SFS 2008:567) — otillåtna villkor
- **Föräldraledighetslagen** (SFS 1995:584) — skydd mot missgynnande

### Vad analysen täcker

#### Lagerjämförelse (kärna)
1. Anställningsform — fast, vikariat, provanställning, timanställning
2. Uppsägningstid — jämför mot LAS-minimikrav
3. Lön och förmåner — flagga om saknas eller otydlig
4. Konkurrensklausul — identifiera och bedöm skälighet mot AVLK
5. Sekretessklausul — flagga om ovanligt bred eller utan tidsgräns
6. Provanställning — max 6 månader (LAS §6)
7. Arbetstid och övertid — avvikelser från Arbetstidslagen
8. Saknade villkor — standardvillkor som saknas i avtalet

#### Klarspråksöversättning (V1)
Varje identifierad klausul (inte bara flaggade) får en klarspråksöversättning i `klartext`-fältet. Formuleras alltid som "I praktiken innebär detta..." eller "Det här betyder att...". Fältet är obligatoriskt och får aldrig vara tomt eller identiskt med den juridiska `beskrivning`-texten. Det är produktens viktigaste differentiator för målgruppen.

#### Marknadsjämförelse — hårdkodade benchmarks (V1)
Utvalda villkor (uppsägningstid, konkurrensklausullängd, provanställningstid) jämförs mot aggregerade branschnormer kategoriserade per anställningskategori (tjänsteman, tekniker, ledare). Benchmarks är hårdkodade i `lib/benchmarks.ts` och uppdateras manuellt. Källangivelse är obligatorisk. Formuleringsregel: "Bland [kategori] i Sverige är [X] vanlig [villkor] enligt [källa]." Aldrig "normalt", "bör vara" eller värderande adjektiv. Om kategorin inte kan identifieras med rimlig säkerhet returneras inget benchmark-värde.

#### Avvikelsepunkter (V1)
En aggregerad vy av klausuler som avviker från antingen lagens minimikrav eller marknadsbenchmarks. Presenteras som neutral observation: "Avtalet avviker från lagens minimikrav / vanlig marknadspraxis på följande punkter:". Aldrig "du kan förhandla om", "det är rimligt att begära" eller handlingsrekommendationer. Tekniskt: UI-aggregering av befintliga flaggor med allvarlighetsgrad "hög" plus flaggor med benchmark-avvikelse — ingen ny LLM-logik.

### Vad analysen INTE täcker i V1
- Kollektivavtal (för komplex variation — V2)
- Chefsavtal med individuella villkor
- Handskrivna tillägg
- Juridisk rådgivning
- Klausulfrekvens ("X% av avtal har detta") — ingen tillförlitlig datakälla utan databas, V2

---

## 3. Privacy-arkitektur

### Princip
Originaldokumentet lämnar ALDRIG användarens enhet.

### Flöde
```
[KLIENT]                                    [SERVER]
   │                                            │
   ├─ 1. Upload: Användaren väljer PDF          │
   ├─ 2. Parse: pdf.js extraherar text          │
   ├─ 3. PII Strip: Regex + mönster            │
   ├─ 4. Consent: Confidence meter visas        │
   │     [Analysera] ← ett klick               │
   │                                            │
   │──── Anonymiserad text ────────────────────>│
   │                                     5. Claude API
   │<──── Strukturerad rapport ────────────────│
   │                                            │
   ├─ 6. Resultat renderas i browsern           │
   └─ Inget sparas server-side                  │
```

---

## 4. Teknisk stack

- Next.js (App Router)
- Tailwind CSS
- pdfjs-dist (client-side, worker i public/)
- Anthropic Claude Sonnet (claude-sonnet-4-20250514)
- Stripe Checkout
- Resend
- Plausible
- Vercel
- Ingen databas i V1

---

## 5. Outputformat (JSON från Claude)

```json
{
  "anstallningsform": "fast | vikariat | provanstallning | timanstallning | oklart",
  "anstallningskategori": "tjänsteman | tekniker | ledare | oklart",
  "tillämplig_lag": "string",
  "sammanfattning": "2-3 meningar",
  "löneanalys": {
    "angiven_lön": null,
    "valuta": "SEK",
    "period": "månad | år | timme | oklart",
    "kommentar": "string"
  },
  "flaggor": [
    {
      "allvarlighet": "hög | medel | info",
      "kategori": "uppsägningstid | konkurrensklausul | sekretess | provanställning | arbetstid | lön | saknas | klausul",
      "titel": "string",
      "beskrivning": "string — juridisk text, max 3 meningar",
      "klartext": "string — OBLIGATORISK, aldrig identisk med beskrivning, börja med 'I praktiken innebär detta...' eller 'Det här betyder att...', max 2 meningar",
      "lagrum": "string — OBLIGATORISK, aldrig tom",
      "avtalets_text": "string",
      "lagens_krav": "string",
      "benchmark_avvikelse": "boolean | null — true om villkoret avviker från marknadsbenchmark, null om inget benchmark finns"
    }
  ],
  "saknade_villkor": [
    {
      "villkor": "string",
      "allvarlighet": "hög | medel | info — differentierad: lag gäller ändå = info, oklar rättsställning utan lag = medel, substantiellt skyddsunderskott utan lagsäkerhet = hög",
      "relevans": "string — formuleras som 'standardvillkor som typiskt förekommer i svenska anställningsavtal'",
      "referens": "string"
    }
  ],
  "marknadsjämförelse": [
    {
      "villkor": "string — t.ex. 'Uppsägningstid'",
      "avtalets_värde": "string",
      "benchmark_värde": "string",
      "benchmark_källa": "string — källhänvisning, t.ex. 'Medlingsinstitutets avtalsstatistik 2024'",
      "benchmark_kategori": "string — den kategori benchmarken gäller",
      "formulering": "string — 'Bland [kategori] i Sverige är [X] vanlig [villkor] enligt [källa].'"
    }
  ]
}
```

**Formuleringsregler för JSON-output (ska in i systemprompt):**
- `klartext` är ALDRIG tom och ALDRIG identisk med `beskrivning`
- `lagrum` är ALDRIG tomt
- `marknadsjämförelse` returneras BARA om `anstallningskategori` inte är "oklart"
- `benchmark_avvikelse` sätts till `null` om inget benchmark finns för kategorin
- Aldrig "normalt", "bör vara", "rekommenderas" eller värderande adjektiv i benchmark-formuleringar

---

## 6. Användarflöden

### Flöde 1: Analys → Betald rapport
```
1. Landing page → upload-CTA
2. Upload → processing → consent → analys
3. Resultat — gratis del (sammanfattning + delvis)
4. Paywall → Stripe Checkout
5. Full rapport → email + PDF-export
```

### Flöde 2: SEO-sidor
```
/regler/las
/regler/provanstallning
/guide/konkurrensklausul
/guide/uppsagningstid
/guide/granska-anstallningsavtal
```

---

## 7. Juridiska skyddsmekanismer

### Disclaimer-placeringar
1. Innan analys
2. I varje flagga (lagrum + hänvisning till jurist)
3. Vid PDF-export

### Formuleringsprinciper
- Referera lag, dra inte slutsatser
- Peka mot myndigheter (Arbetsdomstolen, DO, Arbetsmiljöverket)
- Aldrig "du bör", "vi rekommenderar", "detta är olagligt"

---

## 8. Tillgänglighet (WCAG 2.2 AA)

- Kontrastkvot ≥ 4.5:1 för all text
- Tangentbordsnavigering
- Synliga focus-indikatorer
- Semantisk HTML
- `prefers-reduced-motion` respekteras
- Felmeddelanden inline

---

## 9. Affärsmodell V1

- Förhandsvisning: Gratis
- Full rapport: Betald (pris beslutas av PM + Growth)
- Returning user: Rabatt (beslutas av PM + Growth)
- Ingen target vecka 1–4 — mät, sätt mål sedan
- Benchmark: 3–5% free-to-paid

---

## 10. Metrics

```
upload_started, upload_completed, pii_strip_completed,
analysis_requested, analysis_completed, analysis_error,
paywall_shown, payment_started, payment_completed,
report_emailed, pdf_exported, share_link_created
```

North Star och konverteringsmål sätts av PM + Data Analyst efter baseline.

---

## 11. V1 Checklista

- [ ] Landing page
- [ ] PDF-parsing + PII-stripping
- [ ] Consent-steg
- [ ] Claude API-integration
- [ ] Resultatvy + paywall
- [ ] Stripe Checkout
- [ ] Email-leverans
- [ ] PDF-export
- [ ] SEO-sidor
- [ ] Referral-system
- [ ] Plausible analytics
- [ ] WCAG-audit
- [ ] Responsiv-test
- [ ] Deploy

---

## 12. Vad som INTE ingår i V1

- Konton / inloggning
- Databas
- Kollektivavtalsanalys
- Andra jurisdiktioner
- OCR / foto-upload
- Prenumerationsmodell
