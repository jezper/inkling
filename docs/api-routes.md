# API Routes

Documentation for all API endpoints in Kolla Avtalet.

---

## POST `/api/analyze`

Analyzes an employment contract against Swedish labor law using Claude.

### Request body

```json
{
  "text": "string (required, max 50 000 characters)"
}
```

### Response (200)

```json
{
  "result": {
    "flaggor": [ ... ],
    "helhetsbedömning": { ... },
    ...
  }
}
```

The `result` object conforms to the `AnalysisResult` type defined in `src/lib/analysis-types.ts`.

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "error": "Ogiltig förfrågan." }` | Invalid JSON body |
| 400 | `{ "error": "Ingen avtalstext skickades." }` | Missing or empty `text` |
| 400 | `{ "error": "Avtalstexten är för lång. Max 50 000 tecken." }` | `text` exceeds 50 000 chars |
| 429 | `{ "error": "Du har nått gränsen för antal analyser. Försök igen om en timme." }` | Rate limit exceeded (5/IP/hour). Header: `Retry-After: 3600` |
| 500 | `{ "error": "Serverkonfigurationsfel. Försök igen senare." }` | Missing `ANTHROPIC_API_KEY` |
| 500 | `{ "error": "Något gick fel. Försök igen." }` | Non-text response from Claude |
| 500 | `{ "error": "Något gick fel vid analys. Försök igen." }` | Claude returned invalid JSON |
| 500 | `{ "error": "Analysen kunde inte genomföras korrekt. Försök igen." }` | Missing `flaggor` array in result |
| 500 | `{ "error": "Något gick fel. Försök igen om en stund." }` | Generic API error |
| 504 | `{ "error": "Analysen tog för lång tid. Försök igen." }` | Timeout from Claude API |

---

## POST `/api/checkout`

Creates a Stripe Checkout session for purchasing the full report.

### Request body

```json
{
  "referralToken": "string (optional)"
}
```

Body may be empty or omitted entirely.

### Response (200)

```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 500 | `{ "error": "Serverkonfigurationsfel." }` | Missing `STRIPE_PRICE_ID` |
| 500 | `{ "error": "Kunde inte starta betalningen. Försök igen." }` | Stripe API error |

---

## GET `/api/checkout/verify`

Verifies whether a Stripe Checkout session has been paid.

### Query parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `session_id` | string | Yes | Stripe Checkout session ID (must start with `cs_`) |

### Response (200)

```json
{
  "paid": true,
  "email": "user@example.com"
}
```

`email` is `null` if not available from Stripe.

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "paid": false }` | Missing or invalid `session_id` |
| 400 | `{ "paid": false }` | Stripe retrieval error |

---

## POST `/api/rapport/token`

Creates a shareable report link from an analysis result.

### Request body

```json
{
  "result": {
    "flaggor": [ ... ],
    ...
  }
}
```

`result` must be a valid `AnalysisResult` with a `flaggor` array.

### Response (200)

If Vercel KV is configured (short link):

```json
{
  "token": "abc123",
  "url": "https://kollaavtalet.com/r/abc123"
}
```

Fallback (long token URL):

```json
{
  "token": "<base64-encoded-token>",
  "url": "https://kollaavtalet.com/rapport?t=<base64-encoded-token>"
}
```

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "error": "Ogiltig data." }` | Missing `result` or invalid `flaggor` |
| 500 | `{ "error": "Kunde inte skapa länk." }` | Server error |

---

## POST `/api/email`

Sends the full analysis report to the user's email via Resend.

### Request body

```json
{
  "email": "string (required)",
  "result": { ... }
}
```

`result` must be a valid `AnalysisResult` with a `flaggor` array. Email is validated against a basic regex pattern.

### Response (200)

```json
{
  "ok": true
}
```

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "error": "Email och analysresultat krävs." }` | Missing `email` or `result`, or invalid `flaggor` |
| 400 | `{ "error": "Ogiltig emailadress." }` | Email fails format validation |
| 500 | `{ "error": "Kunde inte skicka email. Försök igen." }` | Resend API error |
| 500 | `{ "error": "Något gick fel." }` | Generic server error |

---

## POST `/api/refund`

Submits a refund request. Sends an email notification to the site owner.

### Request body

```json
{
  "reason": "string (required, min 10 chars)",
  "reportUrl": "string (optional)",
  "sessionId": "string (optional)"
}
```

### Response (200)

```json
{
  "ok": true
}
```

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "error": "Ange en mer utförlig anledning." }` | `reason` missing or shorter than 10 characters |
| 500 | `{ "error": "Kunde inte skicka förfrågan. Kontakta support@kollaavtalet.com." }` | Resend API error |
| 500 | `{ "error": "Något gick fel. Kontakta support@kollaavtalet.com." }` | Generic server error |

---

## POST `/api/referral`

Generates a referral token from an existing report token.

### Request body

```json
{
  "reportToken": "string (required)"
}
```

### Response (200)

```json
{
  "referralToken": "string"
}
```

### Error responses

| Status | Body | Condition |
|--------|------|-----------|
| 400 | `{ "error": "Missing token" }` | Missing or non-string `reportToken` |
| 500 | `{ "error": "Kunde inte skapa delningslänk." }` | Server error |
