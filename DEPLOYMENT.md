# DEPLOYMENT.md — Release- och deploymentrutiner

## Branch-strategi

```
main          ← produktionskod, alltid deploybar
  └── feat/*  ← ny funktionalitet (feat/salary-data, feat/email-v2)
  └── fix/*   ← buggfixar (fix/session-storage-edge-case)
  └── chore/* ← underhåll (chore/update-deps, chore/scb-data-refresh)
```

### Regler
- **main** = produktion. Pusha aldrig direkt till main.
- Allt arbete sker i feature branches → PR → merge till main.
- Varje merge till main triggar auto-deploy via Vercel.
- Rollback = revert-commit på main (se nedan).

## Workflow: ny feature

```bash
# 1. Skapa branch från main
git checkout main && git pull
git checkout -b feat/min-feature

# 2. Jobba, committa
git add -A && git commit -m "Add salary percentile display"

# 3. Pusha och skapa PR
git push -u origin feat/min-feature
gh pr create --title "Add salary percentile display" --body "..."

# 4. Review (eller self-review) → merge
gh pr merge --squash

# 5. Städa
git checkout main && git pull
git branch -d feat/min-feature
```

## Workflow: hotfix

```bash
# Samma som ovan men med fix/ prefix
git checkout -b fix/stripe-redirect-bug
# ... fix ...
git push -u origin fix/stripe-redirect-bug
gh pr create --title "Fix Stripe redirect on Safari"
gh pr merge --squash
```

## Rollback

Om en deploy går fel:

```bash
# 1. Hitta senast fungerande commit
git log --oneline -10

# 2. Revert den trasiga commiten
git revert <commit-hash>
git push origin main
# → Vercel deployer automatiskt reverten
```

Aldrig `git push --force` på main.

## Vercel-setup

### Miljövariabler (lägg till i Vercel Dashboard → Settings → Environment Variables)
```
ANTHROPIC_API_KEY=sk-ant-...
STRIPE_SECRET_KEY=sk_live_...        ← LIVE-nyckel i produktion
STRIPE_PUBLISHABLE_KEY=pk_live_...   ← LIVE-nyckel i produktion
STRIPE_PRICE_ID=price_...            ← Skapa ny produkt med live-nyckel
RESEND_API_KEY=re_...
REPORT_SECRET=...                    ← Samma som lokalt ELLER ny
REFERRAL_HMAC_SECRET=...
NEXT_PUBLIC_SITE_URL=https://inkling.se
```

### Preview Deployments
Varje PR får en egen preview-URL från Vercel. Använd den för att testa innan merge.

### Produktion vs Preview
- `main` → produktion (inkling.se)
- PR-branches → preview (random-name.vercel.app)

## Checklista före release

- [ ] `npm run build` lyckas lokalt
- [ ] TypeScript: inga fel (`npx tsc --noEmit`)
- [ ] Testat flödet manuellt (upload → analys → betalning → rapport)
- [ ] Miljövariabler konfigurerade i Vercel
- [ ] Stripe i live-mode (inte test-mode)
- [ ] Resend-domän verifierad (rapport@inkling.se)
- [ ] REPORT_SECRET och REFERRAL_HMAC_SECRET satta

## Versionshantering

Vi använder inte semver — det är en webapp, inte ett bibliotek. Istället:
- Varje merge till main är en release
- Git-historiken ÄR release-loggen
- `git log --oneline main` visar alla releaser

## Kostnadsövervakning

Kolla månadsvis:
- **Anthropic**: claude.ai/settings → Usage (budget alert vid $50)
- **Stripe**: dashboard.stripe.com → Payments
- **Vercel**: vercel.com/usage (gratis-tier räcker länge)
- **Resend**: resend.com/usage (3000 mail/mån gratis)
