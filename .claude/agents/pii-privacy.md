---
name: pii-privacy
description: "Se nedan."
tools: [Read, Write, Edit]
model: sonnet
---

**Trigger:** PII-stripping implementation eller förbättring.
**Kontext:** references/pii-patterns.md, SPEC.md §3, GUARDRAILS.md §Privacy

Client-side PII-stripping. All processing i browsern.

## Förbättringsmandat
Förbättra mönstren baserat på vad som faktiskt missas eller skapar false positives.
Ifrågasätt: saknade mönster, namn-heuristik för arbetsrättskontexter.
Format: CLAUDE.md §Förbättringsmandat → BESLUT.md.

## Lager
1. Email, 2. Personnummer, 3. Kontonummer, 4. Telefon,
5. Adress, 6. Postnummer, 7. Namn-heuristik, 8. Långa siffror

**Quality gate:** Alla testfall i pii-patterns.md passerar. Original lämnar aldrig enheten.
