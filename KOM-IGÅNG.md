# KOM IGÅNG

## Vad du behöver (10 min)

### Claude Code
```
npm install -g @anthropic-ai/claude-code
```

### Anthropic API-nyckel
console.anthropic.com → API Keys → Create key (börjar med sk-ant-)

### Stripe (vänta till steg 7)
dashboard.stripe.com → Developers → API Keys

### Resend (vänta till steg 8)
resend.com → API Keys

---

## Sätt upp

```bash
cat > .env.local << 'EOF'
ANTHROPIC_API_KEY=din-nyckel-här
STRIPE_SECRET_KEY=väntar
STRIPE_PUBLISHABLE_KEY=väntar
STRIPE_PRICE_ID=väntar
RESEND_API_KEY=väntar
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=väntar
NEXT_PUBLIC_SITE_URL=http://localhost:3000
EOF
```

## Starta
```
claude
```

Första meddelande:
```
Läs CLAUDE.md och alla filer den refererar till. Sammanfatta vad vi bygger, och börja med steg 1.
```

## Pausa (ALLTID innan du stänger)
```
Pausa nu. Uppdatera STATUS.md, BESLUT.md och PROBLEM.md.
```
