# GUARDRAILS.md — Hårda regler & Kvalitetsgrindar

> Denna fil är den ENDA spec-filen som inte ifrågasätts.
> Juridiska och etiska gränser — gäller alltid.

## Absoluta förbud

### Juridiskt
- **ALDRIG** formulera som rådgivning: "du bör", "vi rekommenderar", "detta är olagligt"
- **ALDRIG** dra juridiska slutsatser — bara jämför avtal mot lag
- **ALDRIG** utelämna lagrum-referens i en flagga
- **ALDRIG** ge specifika handlingsrekommendationer
- **ALLTID** inkludera disclaimer på alla tre platser

### Privacy
- **ALDRIG** skicka original-PDF till server
- **ALDRIG** logga eller lagra avtalstext efter API-svaret
- **ALDRIG** spara PII i loggar
- **ALLTID** stripa PII client-side INNAN API-anrop
- **ALLTID** visa consent-steget — får aldrig skippas

### UX
- **ALDRIG** kräv registrering för grundfunktionen
- **ALDRIG** visa loading utan progress-indikation
- **ALDRIG** `outline: none` utan synlig ersättning
- **ALDRIG** toast-notiser för felmeddelanden — inline alltid
- **ALDRIG** enbart färg för att kommunicera information

### Kod
- **ALDRIG** hårdkoda API-nycklar eller konfiguration
- **ALDRIG** `console.log` i produktion
- **ALDRIG** `any` i TypeScript utan kommentar
- **ALDRIG** API-anrop till Claude från client-side
- **ALDRIG** lagra betalningsinformation

### Brand
- **ALDRIG** nämn "AI" i kundvänd UI-text
- **ALDRIG** utropstecken i flaggor eller analystexter
- **ALDRIG** engelska ord där ett svenskt finns
- **ALDRIG** emojis i analysresultat

## Kvalitetsgrindar — innan deploy

- [ ] Lighthouse accessibility ≥ 95
- [ ] Alla interaktiva element nåbara via Tab
- [ ] Kontrast ≥ 4.5:1 (axe-core)
- [ ] Fungerar på 375px
- [ ] PII-stripping fångar: personnummer, telefon, email, kontonummer
- [ ] Consent-steg visas alltid
- [ ] Claude API returnerar valid JSON
- [ ] Stripe fungerar (testläge)
- [ ] Email-leverans fungerar
- [ ] Disclaimer på alla tre platser
- [ ] Plausible events fires korrekt
- [ ] Inga TypeScript errors
- [ ] Inga `console.log`

## Per flagga
Varje flagga MÅSTE ha: allvarlighet, titel, beskrivning, klartext, lagrum, avtalets_text, lagens_krav.

## Error handling
- PDF kan inte parsas → "Vi kunde inte läsa dokumentet. Prova en annan PDF."
- 0 PII → Visa consent ändå ("0 personuppgifter hittade — dubbelkolla gärna")
- API timeout → "Analysen tog för lång tid. Försök igen."
- Ogiltigt JSON → "Något gick fel. Försök igen." + logga server-side
- Email fail → "Rapporten visas här. Vi kunde inte skicka email."
