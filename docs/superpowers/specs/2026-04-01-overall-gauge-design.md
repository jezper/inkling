# Overall Gauge — Visuell helhetsbedömning

## Sammanfattning

Ersätt den nuvarande färgade textrutan för `helhetsbedömning` med en tre-segments horisontell bar ("gauge") som visuellt kommunicerar avtalets övergripande status: grön (bra), orange (godkänt), röd (risk).

## Bakgrund

Helhetsbedömningen finns redan i datamodellen (`Helhetsbedömning.nivå`) och renderas som en färgad box med text. Användaren vill ha en mer visuell, omedelbart avläsbar indikator — en gauge som ger ett tydligt intryck vid första ögonkastet.

## Design

### Komponent: `OverallGauge`

En delad komponent som används i både gratisvy och betald rapport.

**Props:**
```typescript
interface OverallGaugeProps {
  assessment: Helhetsbedömning; // { nivå, rubrik, beskrivning }
}
```

**Visuell struktur:**
```
[ ████ grön ]  [ ████ orange ]  [ ████ röd ]    ← bar, ~12px hög, rundade hörn
                                                   aktiv segment: full färg
                                                   inaktiva: muted (surface-200)
                                                   2px gap mellan segment

              "Rubrik från helhetsbedömning"       ← centrerad, under baren
         "Beskrivning från helhetsbedömning"        ← centrerad, under rubriken
```

**Färger (befintliga CSS-variabler):**
- Grön (bra): `--color-status-ok-*`
- Orange (godkänt): `--color-severity-medium-*`
- Röd (risk): `--color-severity-high-*`
- Inaktiva segment: `--color-surface-200`

**Beteende:**
- Ingen animation, ingen nål, inga siffror
- Tre diskreta segment — kommunicerar "kategori, inte poäng"
- Responsiv: baren skalar med container-bredd (max ~300px)

### Placering

Komponenten ersätter befintliga helhetsbedömning-boxar på två ställen:

1. **Gratisvy** (`analysis-flow.tsx`, ~rad 229–254) — den färgade boxen med rubrik/beskrivning
2. **Betald rapport** (`full-report.tsx`, `OverallAssessment`-komponenten) — samma ersättning

Samma komponent, samma rendering, i båda vyer.

### Designbeslut

| Beslut | Val | Motivering |
|--------|-----|------------|
| Gauge-typ | Horisontell tre-segments bar | Diskreta nivåer, inte kontinuerlig skala. Undviker "credit score"-känsla. |
| Synlighet | Både gratis och betald vy | Gauge fungerar som konverteringsverktyg: grön = trygghet, orange/röd = incitament att betala för detaljer. |
| Speedometer/nål | Nej | Implicerar precision som inte finns. Gamifierat intryck krockar med "kunnig kompis"-tonen. |

## Vad som INTE ändras

- **Datamodell** — `Helhetsbedömning`-interfacet behålls som det är. Inga nya fält.
- **LLM-prompt** — inga ändringar i bedömningsregler eller scoring-logik.
- **Bedömningströsklar** — befintliga regler (bra/godkänt/risk) är redan kalibrerade för att vara förlåtande. De flesta standardavtal → "bra".

## Scope

- En ny komponent: `src/components/overall-gauge.tsx`
- Uppdatera `analysis-flow.tsx`: ersätt helhetsbedömning-box med `OverallGauge`
- Uppdatera `full-report.tsx`: ersätt `OverallAssessment` med `OverallGauge`
- Tester för den nya komponenten
