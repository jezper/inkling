# UX-analys: Landing page — trim

**Datum:** 2026-03-14
**Fråga:** Kan sidan kortas ner utan att tappa konvertering?
**Svar:** Ja, betydligt.

---

## Användarsituationen som styr allt

Primär persona: 25-åring som googlat "granska anställningsavtal." De är redan övertygade om att de behöver hjälp — de letar efter en tjänst, inte en övertalning. Deras friktionspunkter är förtroende och osäkerhet på hur det fungerar, inte brist på motivation.

Det innebär att sidan inte behöver sälja in behovet. Den behöver bara svara på tre frågor i rätt ordning:

1. Är det här rätt ställe? (Hero)
2. Kan jag lita på det? (Trust)
3. Hur fungerar det? (tillräckligt, inte uttömmande)

Sedan: handling.

---

## Sektionsanalys — behåll, slå ihop, ta bort

### Hero — BEHÅLL, justera
Rubriken "Förstå avtalet innan du skriver under" är träffsäker. Den speglar exakt vad personas inre monolog är.

Undertexten är ett ord för lång. "Du har fått ett jobberbjudande och dagarna räknas" är bra. Andra meningen kan komprimeras.

CTA-knappen och mikrotexten under ("Ingen registrering. Dokumentet lämnar inte din enhet.") gör dubbelt jobb mot Trust-sektionen. Det är bra — det är rätt plats att säga det.

### Trust — OMARBETA, integrera delar i Hero
Trust-sektionen är den svåraste att motivera som fristående sektion.

Problemet: Den kommer direkt efter Hero och bryter momentum precis när användaren är redo att klicka. Tre glasskort med förklarande text är mer text att läsa, inte mindre friktion.

Av de tre punkterna är "Dokumentet stannar hos dig" den enda som kan stoppa en klick. Den finns redan som mikrotext i Hero. De andra två ("Inget konto behövs", "Information, inte juridik") är inte förtroendehinder — de är features.

**Rekommendation:** Ta bort Trust som sektion. Flytta "Inget konto behövs" till Hero-mikrotexten (tre ord: "Ingen registrering · Inget konto · Dokumentet stannar hos dig"). "Information, inte juridik" hör hemma i Footer, inte som ett säljargument.

### How it works — BEHÅLL, komprimera
Tre steg är rätt antal. Innehållet är bra. Sektionen svarar på "hur fungerar det?" vilket en stressad användare behöver veta innan de laddar upp ett dokument.

Men: steg 02 (PII-rensning) är ett implementationsdetalj som fördjupar förtroende, inte ett steg användaren gör. Det kan omformuleras för att bli mer användarcentrisk eller absorberas i steg 01.

Föreslagen formulering för steg 01: "Ladda upp avtalet — bearbetningen sker i webbläsaren, namn och personnummer rensas automatiskt."
Steg 02 kan då bli: "Analysen körs" (med betoning på vad som händer, inte teknik).

**Alternativ:** Slå ihop How it works med en reducerad variant av AnalysisCovers (se nedan) till en enda "Så fungerar det"-sektion.

### AnalysisCovers — KRAFTIGT REDUCERA eller ta bort
Detta är den tyngsta sektionen och den med lägst konverteringseffekt.

En stressad 25-åring behöver inte veta att analysen täcker exakt 8 kategorier. De behöver veta att analysen täcker "det viktiga i deras avtal." Listan med alla 8 kategorier skapar läsarbete utan att tillföra förtroende.

Risken med att lista allt: användaren börjar tänka "täcker det min specifika situation?" istället för att klicka.

**Rekommendation alternativ A (minst):** Ta bort sektionen helt. Låt How it works bära hela "vad analysen gör"-budskapet.

**Rekommendation alternativ B (kompromiss):** Ersätt bento-griden med en enda mening i direkt anslutning till How it works: "Analysen täcker anställningsform, provanställning, uppsägningstid, konkurrensklausuler, semester, arbetstid, sekretess och lön." En rad. Ingen rubrik, ingen sektion.

### CtaSection — TA BORT
CtaSection är en typisk "bottom-of-funnel"-sektion för en sida med mycket innehåll. Den motiveras av att användaren scrollat långt och behöver påminnas om att klicka.

Om sidan kortas ner radikalt (Hero + HowItWorks + Footer) når användaren botten snabbt och CTA:n i Hero är fortfarande synlig. En andra CTA-knapp är då redundant.

**Undantag:** Om AnalysisCovers behålls i någon form kan CtaSection motiveras — men den bör då ligga direkt efter och inte ha 28 py.

### Footer — BEHÅLL, utöka marginellt
Footern är korrekt: juridisk disclaimer + copyright. Den är kort och rätt.

"Information, inte juridik"-frasen från Trust kan absorberas här naturligt.

---

## Minimum viable landing page

```
Hero
  - Rubrik (behåll)
  - Undertext (komprimera till 1 mening)
  - CTA-knapp
  - Mikrotext: "Ingen registrering · Inget konto · Dokumentet stannar hos dig"

How it works (2-3 steg, komprimerade)
  - Steg 1: Ladda upp (+ PII-rensning integrerat)
  - Steg 2: Analysen körs
  - Steg 3: Se resultatet punkt för punkt

Footer
  - Juridisk disclaimer (behåll)
  - Copyright
```

Det är hela sidan. Tre sektioner. Användaren förstår vad det är, varför de kan lita på det och hur det fungerar — på under 15 sekunders scroll.

---

## Vad som faktiskt stoppade klick i nuläget

Ingenting i den nuvarande sidan är aktivt dåligt. Problemet är ordning och volym:

- Trust-sektionen skapar ett lässtopp precis efter Hero-momentum
- AnalysisCovers är längst ner och läses troligen inte alls av primär persona
- CtaSection existerar för att kompensera för att sektionerna däremellan tappade momentum

Ta bort det som tappade momentum, så behövs inte kompensationen.

---

## Vad som INTE ska tas bort

Privacy-budskapet ("dokumentet lämnar inte din enhet") är central för konvertering. Det måste finnas i Hero, inte bara i en sektion längre ner. Det är redan korrekt placerat som mikrotext under CTA-knappen — det ska stanna där.

---

## Rekommenderad sekvens för implementation

1. Ta bort CtaSection
2. Ta bort Trust (flytta privacy-texten till Hero-mikrotext om den inte redan täcks)
3. Komprimera HowItWorks till 2 steg eller behåll 3 med reviderade texter
4. Ta bort AnalysisCovers (alternativt: ersätt med en enda textrad i HowItWorks)
5. Verifiera att Footer håller juridisk disclaimer

Resultatet: sidan halveras i längd, Hero-momentum bryts inte och konverteringsflödet är rakare.
