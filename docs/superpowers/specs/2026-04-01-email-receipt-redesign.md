# Email Redesign: Receipt + Report PDF

## Sammanfattning

Skriv om mejlet som skickas efter betalning. Mejlets HTML-kropp fungerar som kvitto (alla lagkrav för förenklad faktura). Avtalsrapporten bifogas som PDF genererad server-side med `@react-pdf/renderer`. Mejlet blir minimalt och rent istället för att dumpa hela analysen i HTML.

## Bakgrund

Nuvarande mejl innehåller hela analysen som inline HTML — flaggor, styrkor, marknadsjämförelse. Det blir väldigt tätpackat ("government sendout"-känsla). Dessutom saknas kvittofunktion, vilket krävs enligt lag för momspliktig försäljning.

## Design

### 1. Mejlets HTML-kropp (kvitto + bärare)

**Layout (uppifrån och ner):**

```
KOLLA AVTALET                          [brand header, krimson, mono-style]
────────────────────────────────────── [accent line]

Tack för din beställning.

Din avtalsrapport finns bifogad som PDF.
Du kan även se en interaktiv version här: [länk]
Länken är giltig i 30 dagar. Vi lagrar ingen data
från din analys efter denna period.

────────────────────────────────────── [subtle divider]

KVITTO

Datum:              [YYYY-MM-DD]
Kvittonummer:       [Stripe session ID]
Tjänst:             Avtalsanalys

Belopp exkl. moms:  39,20 kr
Moms (25%):           9,80 kr
Totalt:              49,00 kr

Säljare:
Jezper Lorné
Gamla Kilandavägen 9
44930 Nödinge, Sweden
Org.nr: [from BUSINESS_ORG_NR env var]
Momsreg.nr: SE800827491501

────────────────────────────────────── [subtle divider]

[disclaimer, kort version]
Detta mejl skickades av Kolla Avtalet. Svara inte på detta mejl.
```

**Styling:**
- Vit bakgrund, system fonts (Arial/Helvetica fallback)
- Brand krimson (#DC1E38) för header och accent-linje
- Kall grå (#47474F) för brödtext
- Generöst whitespace
- Inga bilder (utom eventuellt en enkel text-logga)
- Alla styles inline (email client compatibility)

**Kvittokrav (förenklad faktura, momsregistrerad):**
- Säljarens namn, adress, org.nr, momsreg.nr
- Datum
- Beskrivning av tjänst
- Belopp exkl. moms, momsbelopp, momssats, totalbelopp
- Unikt nummer (Stripe session ID)

### 2. Bifogad PDF: Avtalsrapport

Genereras server-side med `@react-pdf/renderer`. Innehåller samma data som den betalda rapportvyn:

**Sida 1 — Header + helhetsbedömning:**
- "KOLLA AVTALET · AVTALSRAPPORT · [datum]"
- Helhetsbedömning-gauge (förenklad för PDF: tre rektanglar med labels "Bra"/"Notera"/"Risk", aktiv markerad)
- Rubrik + beskrivning
- Sammanfattning

**Följande sidor — Analys:**
- Flaggor, grupperade efter allvarlighet (hög → medel → info)
  - Varje flagga: titel, kategori-badge, beskrivning, klartext, avtal vs lag, frågor att ställa, lagrum
- Styrkor
- Saknade villkor (med allvarlighets-badge)
- Marknadsjämförelse (tabell)
- Nästa steg

**Sista sidan — Footer:**
- Disclaimer (samma som på webbsidan)
- "Genererad av Kolla Avtalet · [datum]"
- Sidnummer i footer på alla sidor

**Styling:**
- A4, enkolumn
- Space Grotesk (registrerad som custom font i react-pdf) för rubriker
- Inter eller Helvetica fallback för brödtext
- Brand krimson för accent/headers
- Severity-färger för flagg-badges
- Automatiska sidbrytningar (react-pdf hanterar detta)

### 3. Vad som ändras

| Fil | Ändring |
|-----|---------|
| `src/lib/email-template.ts` | **Omskriven** — strip all analysis content, add receipt fields, minimal clean styling |
| `src/lib/report-pdf.tsx` | **Ny** — `@react-pdf/renderer` Document-komponent som tar `AnalysisResult` |
| `src/app/api/email/route.ts` | **Modifierad** — generera PDF via react-pdf, bifoga via Resend attachments API |
| `.env.local` | **Lägg till** `BUSINESS_ORG_NR` (personnummer, känsligt — aldrig i kod) |

### 4. Vad som INTE ändras

- Datamodell (`AnalysisResult` etc.)
- LLM-prompt
- Stripe-flöde
- Rapportsida (`/rapport`)
- Analysis flow
- Report token / delbar länk

### 5. Tekniska detaljer

**PDF-generering:**
- `@react-pdf/renderer` körs server-side i API-routen
- `renderToBuffer()` producerar en `Buffer` som skickas som attachment
- Resend stöder attachments via `attachments: [{ filename, content }]`

**Miljövariabler:**
- `BUSINESS_ORG_NR` — personnummer/org.nr (ny)
- Övriga befintliga: `RESEND_API_KEY`, `NEXT_PUBLIC_SITE_URL`

**Prissättning hardcoded:**
- Pris: 49,00 kr inkl. moms
- Exkl. moms: 39,20 kr
- Moms (25%): 9,80 kr
- Om priset ändras i Stripe behöver detta uppdateras i koden (acceptabelt för V1, inga dynamiska priser)

**From-adress:**
- Nuvarande: `onboarding@resend.dev` (sandbox)
- Bör uppdateras till egen domän innan produktion (separat uppgift)
