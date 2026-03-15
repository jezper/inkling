# CLAUDE.md — Projektinstruktioner

## Projekt
Anställningsavtalsgranskning — en webbapp där användare laddar upp sitt anställningsavtal (PDF) och får analys mot svensk arbetsrätt.

## Dokumentstruktur

### Levande filer (läs + uppdatera varje session)
- `STATUS.md` — Var projektet är. Läs FÖRST.
- `BESLUT.md` — Fattade beslut. Kolla här innan du frågar om något.
- `PROBLEM.md` — Kända problem och tech debt.

### Spec-filer (utgångspunkt — får ifrågasättas och förbättras)
1. `CONTEXT.md` — Vision, mission, mål, målgrupp
2. `SPEC.md` — Produktspecifikation
3. `BRAND.md` — Designfilosofi och tonalitet
4. `GUARDRAILS.md` — **Enda filen som INTE ifrågasätts.** Juridiska och etiska gränser.
5. `AGENTS.md` — Agentöversikt
6. `.claude/agents/` — En fil per agent
7. `SESSION.md` — Sessionshantering
8. `references/` — Lagtexter, PII-mönster, systemprompt, SEO-plan

> Alla spec-filer utom GUARDRAILS.md är utgångspunkt, inte tak.
> Varje expertroll har mandat att föreslå förbättringar inom sitt område.
> Se §Förbättringsmandat nedan.

## FÖRBÄTTRINGSMANDAT — GÄLLER ALLA AGENTER

Varje agent förväntas använda sin expertis för att aktivt förbättra produkten,
inte bara följa instruktioner.

**Det innebär:**
- Om BRAND.md begränsar en bättre lösning → föreslå förändringen
- Om SPEC.md beskriver ett suboptimalt flöde → föreslå alternativet
- Om en designregel hindrar tillgänglighet → rätta direkt och dokumentera
- Om copy-regler ger sämre UX → föreslå bättre formuleringar

**Format för förbättringsförslag:**
```
## Förbättringsförslag — [din roll]
**Nuläge:** [vad som gäller idag]
**Problem:** [varför det är suboptimalt]
**Förslag:** [vad du föreslår]
**Motivering:** [expertargument]
**Påverkar:** [vilka filer/beslut]
```

Lägg i BESLUT.md under `## Öppna förslag`. Blockera inte arbetet —
fortsätt med uppgiften som om förslaget är under övervägande.

## SESSIONSPROTOKOLL — FÖLJ ALLTID

### Vid sessionens START
1. Läs STATUS.md
2. Läs BESLUT.md (beslut + öppna förslag)
3. Läs PROBLEM.md
4. Sammanfatta kort innan du fortsätter

### Under sessionen
- Avslutat steg → STATUS.md direkt
- Fattat beslut → BESLUT.md direkt
- Hittat problem → PROBLEM.md direkt
- Förbättringsförslag → BESLUT.md `## Öppna förslag`

Skriv `✅ Checkpoint sparad` efter varje uppdatering.

### Vid sessionens SLUT
Uppdatera alla tre filer + handoff-not i STATUS.md `## Senaste session`.

## Teknik
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **PDF-parsing:** pdfjs-dist (client-side, worker i public/)
- **LLM:** Anthropic Claude Sonnet via @anthropic-ai/sdk
- **Betalning:** Stripe Checkout
- **Email:** Resend
- **Analytics:** Plausible
- **Hosting:** Vercel
- **Databas:** Ingen i V1

## Kodkonventioner
- TypeScript strict mode
- Funktionella React-komponenter
- Server Components default, Client Components vid behov
- Filnamn: kebab-case, Komponentnamn: PascalCase
- All UI-text på svenska
- Ingen `console.log` i produktion
- Miljövariabler i `.env.local` alltid

## Miljövariabler
```
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
RESEND_API_KEY=
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
NEXT_PUBLIC_SITE_URL=
```

## Arbetsordning
1. ⬜ Scaffold Next.js + Tailwind
2. ⬜ Landing page
3. ⬜ Client-side PDF-parsing + PII-stripping
4. ⬜ Consent-steg
5. ⬜ Claude API-endpoint med arbetsrättsprompt
6. ⬜ Resultatvy + paywall
7. ⬜ Stripe Checkout
8. ⬜ Email-leverans (Resend)
9. ⬜ PDF-export
10. ⬜ SEO-sidor
11. ⬜ Referral-system
12. ⬜ Plausible analytics
13. ⬜ WCAG-audit
14. ⬜ Responsiv-test
15. ⬜ Deploy till Vercel
