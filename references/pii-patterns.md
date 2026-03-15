# pii-patterns.md — PII-stripping

## Processordning
1. Email, 2. Personnummer, 3. Kontonummer, 4. Telefon,
5. Adress, 6. Postnummer, 7. Namn-heuristik, 8. Långa siffror

## Namn-heuristik (arbetsrättskontexter)
arbetstagare / anställd → [PART A]
arbetsgivare / företaget / bolaget → [PART B]

## Testfall
anna@foretag.se → [EMAIL]
19850412-1234 → [PERSONNUMMER]
070-123 45 67 → [TELEFON]
Arbetstagare: Anna Svensson → Arbetstagare: [PART A]
Arbetsgivare: AB Exempel → Arbetsgivare: [PART B]
