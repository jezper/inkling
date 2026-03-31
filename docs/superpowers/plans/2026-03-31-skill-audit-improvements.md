# Skill Audit Improvements — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Address all improvements identified by the 22-skill audit: testing infrastructure, accessibility fixes, frontend performance, CI pipeline, E2E tests, error handling, and documentation.

**Architecture:** Six phases — foundation (testing), accessibility, frontend perf, infrastructure, E2E, docs. Each phase produces independently shippable improvements. Tests use Vitest (unit/integration) and Playwright (E2E). CI via GitHub Actions.

**Tech Stack:** Vitest, @testing-library/react, Playwright, GitHub Actions, React error boundaries

---

## Phase 1: Testing Foundation

### Task 1: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json` (add scripts + devDependencies)
- Create: `tsconfig.test.json`

- [ ] **Step 1: Install Vitest + testing deps**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 2: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});
```

- [ ] **Step 3: Create tests/setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add test scripts to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Verify setup with a smoke test**

Create `tests/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("test setup", () => {
  it("works", () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm test`
Expected: 1 test passes.

- [ ] **Step 6: Delete smoke test and commit**

```bash
rm tests/smoke.test.ts
git add vitest.config.ts tests/setup.ts package.json package-lock.json
git commit -m "chore: set up Vitest testing infrastructure"
```

---

### Task 2: PII stripper unit tests

**Files:**
- Create: `tests/lib/pii-stripper.test.ts`

- [ ] **Step 1: Write failing tests for all PII patterns**

```ts
import { describe, it, expect } from "vitest";
import { stripPii } from "@/lib/pii-stripper";

describe("stripPii", () => {
  describe("email", () => {
    it("replaces email addresses", () => {
      const { strippedText, piiCount, piiTypes } = stripPii(
        "Kontakt: anna.svensson@example.com",
      );
      expect(strippedText).toBe("Kontakt: [EMAIL]");
      expect(piiCount).toBe(1);
      expect(piiTypes).toContain("e-postadress");
    });

    it("replaces multiple emails", () => {
      const { strippedText, piiCount } = stripPii(
        "anna@ex.com och bo@ex.com",
      );
      expect(strippedText).toBe("[EMAIL] och [EMAIL]");
      expect(piiCount).toBe(2);
    });
  });

  describe("personnummer", () => {
    it("replaces YYYYMMDD-XXXX format", () => {
      const { strippedText } = stripPii("Personnummer: 19900101-1234");
      expect(strippedText).toBe("Personnummer: [PERSONNUMMER]");
    });

    it("replaces YYMMDD-XXXX format", () => {
      const { strippedText } = stripPii("Pnr: 900101-1234");
      expect(strippedText).toBe("Pnr: [PERSONNUMMER]");
    });

    it("replaces without dash", () => {
      const { strippedText } = stripPii("199001011234");
      expect(strippedText).toContain("[PERSONNUMMER]");
    });
  });

  describe("kontonummer", () => {
    it("replaces bank account numbers", () => {
      const { strippedText } = stripPii("Konto: 1234-5678901");
      expect(strippedText).toBe("Konto: [KONTONUMMER]");
    });
  });

  describe("telefon", () => {
    it("replaces Swedish mobile numbers", () => {
      const { strippedText } = stripPii("Tel: 070-123 45 67");
      expect(strippedText).toBe("Tel: [TELEFON]");
    });

    it("replaces +46 format", () => {
      const { strippedText } = stripPii("+46 70 123 45 67");
      expect(strippedText).toContain("[TELEFON]");
    });
  });

  describe("adress", () => {
    it("replaces street addresses", () => {
      const { strippedText } = stripPii("Bor på Storgatan 12");
      expect(strippedText).toBe("Bor på [ADRESS]");
    });

    it("replaces addresses with letter suffix", () => {
      const { strippedText } = stripPii("Kungsgatan 3A");
      expect(strippedText).toBe("[ADRESS]");
    });
  });

  describe("postnummer", () => {
    it("replaces 5-digit postal codes", () => {
      const { strippedText } = stripPii("Postnr: 114 32");
      expect(strippedText).toBe("Postnr: [POSTNUMMER]");
    });
  });

  describe("namn-heuristik", () => {
    it("replaces employee name (Part A)", () => {
      const { strippedText } = stripPii("arbetstagare: Anna Svensson");
      expect(strippedText).toBe("arbetstagare: [PART A]");
    });

    it("replaces employer name (Part B)", () => {
      const { strippedText } = stripPii("arbetsgivare: Företaget AB");
      expect(strippedText).toBe("arbetsgivare: [PART B]");
    });
  });

  describe("long numbers", () => {
    it("replaces 10+ digit numbers", () => {
      const { strippedText } = stripPii("Ref: 1234567890123");
      expect(strippedText).toBe("Ref: [BORTTAGET]");
    });
  });

  describe("combined PII", () => {
    it("strips multiple PII types in one text", () => {
      const text =
        "arbetstagare: Anna Svensson, tel 070-123 45 67, email anna@test.se";
      const { piiCount, piiTypes } = stripPii(text);
      expect(piiCount).toBeGreaterThanOrEqual(3);
      expect(piiTypes.length).toBeGreaterThanOrEqual(3);
    });

    it("returns clean text with no PII", () => {
      const text = "Uppsägningstid 3 månader. Semesterersättning 12%.";
      const { strippedText, piiCount } = stripPii(text);
      expect(strippedText).toBe(text);
      expect(piiCount).toBe(0);
    });
  });
});
```

- [ ] **Step 2: Run tests**

```bash
npm test -- tests/lib/pii-stripper.test.ts
```
Expected: All tests pass (the implementation already exists).

- [ ] **Step 3: Commit**

```bash
git add tests/lib/pii-stripper.test.ts
git commit -m "test: add PII stripper unit tests covering all pattern types"
```

---

### Task 3: Analysis types validation tests

**Files:**
- Create: `tests/lib/analysis-validation.test.ts`
- Create: `src/lib/analysis-validation.ts`

- [ ] **Step 1: Write failing tests for analysis result validation**

```ts
import { describe, it, expect } from "vitest";
import { validateAnalysisResult } from "@/lib/analysis-validation";

const validResult = {
  anstallningsform: "fast",
  anstallningskategori: "tjänsteman",
  tillämplig_lag: "LAS",
  sammanfattning: "Avtalet ser standard ut.",
  helhetsbedömning: { nivå: "bra", rubrik: "Bra avtal", beskrivning: "Allt ok." },
  löneanalys: { angiven_lön: "35000", valuta: "SEK", period: "månad", kommentar: "Standard" },
  flaggor: [
    {
      allvarlighet: "hög",
      kategori: "uppsägningstid",
      titel: "Kort uppsägningstid",
      beskrivning: "Uppsägningstid 1 mån.",
      klartext: "I praktiken innebär detta att du har kort uppsägningstid.",
      lagrum: "LAS §11",
      avtalets_text: "1 månad",
      lagens_krav: "1-6 månader beroende på anställningstid",
      benchmark_avvikelse: false,
    },
  ],
  styrkor: [{ titel: "Tydlig lön", beskrivning: "Lönen anges tydligt." }],
  nästa_steg: [{ titel: "Fråga om övertid", beskrivning: "Be om klargörande.", typ: "fråga" }],
  saknade_villkor: [
    { villkor: "Övertidsersättning", allvarlighet: "medel", relevans: "Standardvillkor.", referens: "Arbetstidslagen" },
  ],
  marknadsjämförelse: [],
};

describe("validateAnalysisResult", () => {
  it("accepts a valid result", () => {
    expect(validateAnalysisResult(validResult)).toEqual({ valid: true, errors: [] });
  });

  it("rejects missing flaggor", () => {
    const { valid, errors } = validateAnalysisResult({ ...validResult, flaggor: undefined });
    expect(valid).toBe(false);
    expect(errors).toContain("flaggor is required and must be an array");
  });

  it("rejects flagga with empty klartext", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], klartext: "" }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("klartext");
  });

  it("rejects flagga with empty lagrum", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], lagrum: "" }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("lagrum");
  });

  it("rejects klartext identical to beskrivning", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], klartext: validResult.flaggor[0].beskrivning }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("identical");
  });

  it("rejects invalid allvarlighet value", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], allvarlighet: "kritisk" }],
    };
    const { valid } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
  });

  it("validates saknade_villkor allvarlighet", () => {
    const bad = {
      ...validResult,
      saknade_villkor: [{ ...validResult.saknade_villkor[0], allvarlighet: "låg" }],
    };
    const { valid } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/lib/analysis-validation.test.ts
```
Expected: FAIL — `validateAnalysisResult` does not exist yet.

- [ ] **Step 3: Implement validation function**

Create `src/lib/analysis-validation.ts`:

```ts
import type { AnalysisResult } from "./analysis-types";

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_ALLVARLIGHET = ["hög", "medel", "info"];

export function validateAnalysisResult(data: unknown): ValidationResult {
  const errors: string[] = [];
  const d = data as Record<string, unknown>;

  if (!d || typeof d !== "object") {
    return { valid: false, errors: ["data must be an object"] };
  }

  // Required top-level fields
  if (!Array.isArray(d.flaggor)) {
    errors.push("flaggor is required and must be an array");
  } else {
    for (let i = 0; i < d.flaggor.length; i++) {
      const f = d.flaggor[i] as Record<string, unknown>;
      if (!f.klartext || typeof f.klartext !== "string" || f.klartext.trim() === "") {
        errors.push(`flaggor[${i}]: klartext must be non-empty`);
      }
      if (!f.lagrum || typeof f.lagrum !== "string" || f.lagrum.trim() === "") {
        errors.push(`flaggor[${i}]: lagrum must be non-empty`);
      }
      if (f.klartext && f.beskrivning && f.klartext === f.beskrivning) {
        errors.push(`flaggor[${i}]: klartext must not be identical to beskrivning`);
      }
      if (typeof f.allvarlighet === "string" && !VALID_ALLVARLIGHET.includes(f.allvarlighet)) {
        errors.push(`flaggor[${i}]: invalid allvarlighet "${f.allvarlighet}"`);
      }
    }
  }

  if (Array.isArray(d.saknade_villkor)) {
    for (let i = 0; i < d.saknade_villkor.length; i++) {
      const sv = d.saknade_villkor[i] as Record<string, unknown>;
      if (typeof sv.allvarlighet === "string" && !VALID_ALLVARLIGHET.includes(sv.allvarlighet)) {
        errors.push(`saknade_villkor[${i}]: invalid allvarlighet "${sv.allvarlighet}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test -- tests/lib/analysis-validation.test.ts
```
Expected: All tests pass.

- [ ] **Step 5: Integrate validation in analyze route**

In `src/app/api/analyze/route.ts`, after `JSON.parse(jsonText)`, add:

```ts
import { validateAnalysisResult } from "@/lib/analysis-validation";

// After: result = JSON.parse(jsonText);
const validation = validateAnalysisResult(result);
if (!validation.valid) {
  console.error("[analyze] Validation errors:", validation.errors);
  // Still return the result — validation is defensive, not blocking
}
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/analysis-validation.ts tests/lib/analysis-validation.test.ts src/app/api/analyze/route.ts
git commit -m "feat: add analysis result validation with tests"
```

---

## Phase 2: Accessibility Fixes

### Task 4: Fix AnalyzingOverlay focus trap

**Files:**
- Modify: `src/components/analysis-flow.tsx` (AnalyzingOverlay function, approx line 280+)

- [ ] **Step 1: Read the current AnalyzingOverlay component**

Read `src/components/analysis-flow.tsx` from line 280 to end to find the AnalyzingOverlay.

- [ ] **Step 2: Replace AnalyzingOverlay with native dialog + focus trap**

Replace the `AnalyzingOverlay` function with:

```tsx
function AnalyzingOverlay() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Analyserar ditt avtal"
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        maxWidth: "100vw",
        maxHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(10, 10, 12, 0.92)",
        border: "none",
        padding: 0,
        margin: 0,
        zIndex: 50,
      }}
      onCancel={(e) => e.preventDefault()}
    >
      <div
        aria-live="polite"
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}
      >
        {/* Spinner */}
        <div style={{ width: "2.5rem", height: "2.5rem", border: "2px solid var(--color-surface-400)", borderTopColor: "var(--color-accent-500)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-surface-0)", letterSpacing: "-0.02em" }}>
          Analyserar avtalet&hellip;
        </p>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-surface-400)", letterSpacing: "0.05em" }}>
          Brukar ta 15&ndash;30 sekunder
        </p>
      </div>
    </dialog>
  );
}
```

Add `useRef` to the imports at the top if not already imported.

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000, upload a PDF, confirm the overlay:
1. Appears as a modal
2. Tab key cycles within the dialog (nowhere to go, which is correct — no interactive elements)
3. Escape key does NOT close it (onCancel prevents this)
4. Focus is trapped inside the dialog

- [ ] **Step 4: Commit**

```bash
git add src/components/analysis-flow.tsx
git commit -m "fix: replace AnalyzingOverlay with native dialog for focus trap (WCAG 2.4.11)"
```

---

### Task 5: Fix focus ring contrast

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Find and update focus ring color**

In `src/app/globals.css`, find the `--focus-outline-color` variable or the focus ring styles. Change the focus ring color from `--color-accent-500` to `--color-accent-700` (#941228) which gives 8.5:1 contrast on white — exceeds AAA requirements.

Look for the `outline` or `focus-visible` styles and update:
```css
--focus-outline-color: var(--color-accent-700);
```

Or if it's defined inline in the focus styles, change the accent-500 reference to accent-700.

- [ ] **Step 2: Verify contrast**

The new color #941228 on white (#FFFFFF) = 8.5:1 contrast ratio, which exceeds WCAG 2.2 AAA's 3:1 requirement for UI components.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "fix: focus ring contrast now AAA-compliant (accent-700, 8.5:1)"
```

---

## Phase 3: Frontend Performance

### Task 6: Lazy-load Tesseract.js

**Files:**
- Modify: `src/lib/pdf-parser.ts`

The current code already uses `await import("tesseract.js")` dynamically inside `runOcrOnPdf`, which means it's only loaded when OCR is needed. This is already lazy-loaded correctly.

- [ ] **Step 1: Verify Tesseract is dynamically imported**

Read `src/lib/pdf-parser.ts` line 150: `const Tesseract = await import("tesseract.js");`

This is correct — Tesseract is already lazy-loaded. No changes needed.

- [ ] **Step 2: Check bundle impact**

```bash
npx next build 2>&1 | grep -A5 "Route\|Size"
```

Verify that Tesseract doesn't appear in the main bundle.

- [ ] **Step 3: Mark as verified — no commit needed**

---

### Task 7: Add error boundary

**Files:**
- Create: `src/components/error-boundary.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create error boundary component**

```tsx
"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "50vh",
              padding: "2rem",
              gap: "1rem",
              textAlign: "center",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-xl)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
              }}
            >
              Något gick fel
            </p>
            <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-muted)" }}>
              Prova att ladda om sidan.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "var(--color-accent-500)",
                color: "white",
                border: "none",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
              }}
            >
              Ladda om
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

- [ ] **Step 2: Wrap layout children with ErrorBoundary**

In `src/app/layout.tsx`, add inside `<body>`:

```tsx
import { ErrorBoundary } from "@/components/error-boundary";

// In the return:
<body>
  {/* JSON-LD scripts stay outside */}
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
  <Analytics />
</body>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Build passes with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/error-boundary.tsx src/app/layout.tsx
git commit -m "feat: add ErrorBoundary with Swedish fallback UI"
```

---

## Phase 4: CI Pipeline

### Task 8: GitHub Actions CI

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create CI workflow**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Verify PDF worker exists
        run: test -f public/pdf.worker.min.mjs

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Unit tests
        run: npm test

      - name: Build
        run: npm run build
        env:
          ANTHROPIC_API_KEY: dummy-for-build
          STRIPE_SECRET_KEY: dummy-for-build
          STRIPE_PUBLISHABLE_KEY: dummy-for-build
          STRIPE_PRICE_ID: dummy-for-build
```

- [ ] **Step 2: Commit**

```bash
mkdir -p .github/workflows
git add .github/workflows/ci.yml
git commit -m "ci: add GitHub Actions pipeline (lint, typecheck, test, build)"
```

---

## Phase 5: E2E Tests

### Task 9: Set up Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/upload-flow.spec.ts`
- Modify: `package.json`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Create playwright.config.ts**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 3: Add E2E test script**

Add to `package.json` scripts:
```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: Write landing page smoke test**

Create `e2e/upload-flow.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads with correct title and upload section", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Kolla Avtalet/);

    // Upload section exists
    const uploadSection = page.locator("#upload");
    await expect(uploadSection).toBeVisible();
  });

  test("shows FAQ page", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("SEO pages load", async ({ page }) => {
    for (const path of ["/regler/las", "/guide/uppsagningstid"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });
});
```

- [ ] **Step 5: Run E2E tests**

```bash
npm run test:e2e
```
Expected: All tests pass.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts e2e/ package.json package-lock.json
git commit -m "test: add Playwright E2E tests for critical page loads"
```

---

## Phase 6: Documentation & Metrics

### Task 10: Document API routes

**Files:**
- Create: `docs/api-routes.md`

- [ ] **Step 1: Write API documentation**

```markdown
# API Routes

## POST /api/analyze
Sends anonymized contract text to Claude for analysis.

**Request:**
```json
{ "text": "string (max 50,000 chars)" }
```

**Response (200):**
```json
{ "result": AnalysisResult }
```

**Errors:** 400 (missing/invalid text), 429 (rate limit: 5/hour/IP), 500 (config/API error), 504 (timeout)

---

## POST /api/checkout
Creates a Stripe Checkout session.

**Request:**
```json
{ "referralToken?": "string" }
```

**Response (200):**
```json
{ "url": "string (Stripe checkout URL)" }
```

---

## GET /api/checkout/verify
Verifies payment status.

**Query:** `?session_id=cs_xxx`

**Response (200):**
```json
{ "paid": true, "email": "user@example.com" }
```

---

## POST /api/rapport/token
Creates a shareable report link (encrypted or short-link via Vercel KV).

**Request:**
```json
{ "result": AnalysisResult }
```

**Response (200):**
```json
{ "token": "string", "url": "string" }
```

---

## POST /api/email
Sends the report via email.

**Request:**
```json
{ "email": "string", "result": AnalysisResult }
```

**Response (200):**
```json
{ "ok": true }
```

---

## POST /api/refund
Sends a refund request email to the operator.

**Request:**
```json
{ "reason": "string (min 10 chars)", "reportUrl?": "string", "sessionId?": "string" }
```

**Response (200):**
```json
{ "ok": true }
```

---

## POST /api/referral
Handles referral token creation/validation.
```

- [ ] **Step 2: Commit**

```bash
git add docs/api-routes.md
git commit -m "docs: add API route documentation"
```

---

### Task 11: Update PROBLEM.md with resolved issues

**Files:**
- Modify: `PROBLEM.md`

- [ ] **Step 1: Mark resolved issues**

Update PROBLEM.md:
- Mark "Ingen fokustrapfångst i AnalyzingOverlay" as LÖST with date 2026-03-31
- Mark "Focus ring kontrast" as LÖST with date 2026-03-31

- [ ] **Step 2: Update STATUS.md with session notes**

Add new session entry to STATUS.md documenting all changes made.

- [ ] **Step 3: Commit**

```bash
git add PROBLEM.md STATUS.md
git commit -m "docs: update status — skill audit improvements complete"
```
