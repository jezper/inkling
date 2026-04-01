# Overall Gauge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the helhetsbedömning text box with a three-segment horizontal gauge bar in both free and paid views.

**Architecture:** A new `OverallGauge` component renders three horizontal bar segments (green/orange/red). The active segment is fully colored, inactive ones muted. The component is used in both `analysis-flow.tsx` (free preview) and `full-report.tsx` (paid report), replacing the current colored text boxes. No data model or prompt changes.

**Tech Stack:** React, TypeScript, CSS custom properties (existing design system variables), Vitest

---

### Task 1: Create `OverallGauge` component with tests

**Files:**
- Create: `src/components/overall-gauge.tsx`
- Create: `tests/components/overall-gauge.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
// tests/components/overall-gauge.test.ts
import { describe, it, expect } from "vitest";
import { getGaugeConfig } from "@/components/overall-gauge";

describe("getGaugeConfig", () => {
  it("returns correct config for 'bra'", () => {
    const config = getGaugeConfig("bra");
    expect(config.activeIndex).toBe(0);
    expect(config.label).toBe("Ser bra ut");
    expect(config.activeColor).toContain("status-ok");
  });

  it("returns correct config for 'godkänt'", () => {
    const config = getGaugeConfig("godkänt");
    expect(config.activeIndex).toBe(1);
    expect(config.label).toBe("Några saker att notera");
    expect(config.activeColor).toContain("severity-medium");
  });

  it("returns correct config for 'risk'", () => {
    const config = getGaugeConfig("risk");
    expect(config.activeIndex).toBe(2);
    expect(config.label).toBe("Värt att granska noga");
    expect(config.activeColor).toContain("severity-high");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run tests/components/overall-gauge.test.ts`
Expected: FAIL — `getGaugeConfig` not found

- [ ] **Step 3: Write the component**

```tsx
// src/components/overall-gauge.tsx
"use client";

import type { Helhetsbedömning } from "@/lib/analysis-types";

interface GaugeConfig {
  activeIndex: number; // 0 = bra, 1 = godkänt, 2 = risk
  label: string;
  activeColor: string;
  labelColor: string;
}

const SEGMENTS = [
  {
    color: "var(--color-status-ok-bg)",
    borderColor: "var(--color-status-ok-border)",
    activeColor: "var(--color-status-ok-border)",
  },
  {
    color: "var(--color-severity-medium-bg)",
    borderColor: "var(--color-severity-medium-border)",
    activeColor: "var(--color-severity-medium-border)",
  },
  {
    color: "var(--color-severity-high-bg)",
    borderColor: "var(--color-severity-high-border)",
    activeColor: "var(--color-severity-high-border)",
  },
];

export function getGaugeConfig(nivå: Helhetsbedömning["nivå"]): GaugeConfig {
  switch (nivå) {
    case "bra":
      return {
        activeIndex: 0,
        label: "Ser bra ut",
        activeColor: "var(--color-status-ok-border)",
        labelColor: "var(--color-status-ok-text)",
      };
    case "godkänt":
      return {
        activeIndex: 1,
        label: "Några saker att notera",
        activeColor: "var(--color-severity-medium-border)",
        labelColor: "var(--color-severity-medium-text)",
      };
    case "risk":
      return {
        activeIndex: 2,
        label: "Värt att granska noga",
        activeColor: "var(--color-severity-high-border)",
        labelColor: "var(--color-severity-high-text)",
      };
  }
}

export function OverallGauge({ assessment }: { assessment: Helhetsbedömning }) {
  const config = getGaugeConfig(assessment.nivå);

  return (
    <div style={{ textAlign: "center" }}>
      {/* Three-segment bar */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
        role="img"
        aria-label={`Helhetsbedömning: ${config.label}`}
      >
        {SEGMENTS.map((seg, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "12px",
              borderRadius:
                i === 0
                  ? "6px 0 0 6px"
                  : i === 2
                    ? "0 6px 6px 0"
                    : "0",
              backgroundColor:
                i === config.activeIndex
                  ? seg.activeColor
                  : "var(--color-surface-200)",
              transition: "background-color 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: config.labelColor,
          marginTop: "0.75rem",
        }}
      >
        {config.label}
      </p>

      {/* Rubrik */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.01em",
          marginTop: "0.25rem",
        }}
      >
        {assessment.rubrik}
      </p>

      {/* Beskrivning */}
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          maxWidth: "540px",
          margin: "0.5rem auto 0",
        }}
      >
        {assessment.beskrivning}
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run tests/components/overall-gauge.test.ts`
Expected: PASS — all 3 tests green

- [ ] **Step 5: Commit**

```bash
git add src/components/overall-gauge.tsx tests/components/overall-gauge.test.ts
git commit -m "feat: add OverallGauge component with three-segment bar"
```

---

### Task 2: Integrate gauge into free preview (analysis-flow.tsx)

**Files:**
- Modify: `src/components/analysis-flow.tsx:229-255`

- [ ] **Step 1: Replace the helhetsbedömning box**

At the top of `analysis-flow.tsx`, add the import:

```typescript
import { OverallGauge } from "@/components/overall-gauge";
```

Replace lines 229–255 (the helhetsbedömning `<div>` block):

```tsx
        {/* Helhetsbedömning */}
        {result.helhetsbedömning && (
          <div style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-lg)",
            border: `2px solid ${
              result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-border)"
              : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-border)"
              : "var(--color-surface-300)"
            }`,
            backgroundColor:
              result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-bg)"
              : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-bg)"
              : "var(--color-surface-0)",
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem",
              color: result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-text)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-text)" : "var(--color-text-muted)",
            }}>
              {result.helhetsbedömning.nivå === "bra" ? "Ser bra ut" : result.helhetsbedömning.nivå === "risk" ? "Värt att granska noga" : "Några saker att notera"}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
              {result.helhetsbedömning.rubrik}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {result.helhetsbedömning.beskrivning}
            </p>
          </div>
        )}
```

With:

```tsx
        {/* Helhetsbedömning — gauge */}
        {result.helhetsbedömning && (
          <OverallGauge assessment={result.helhetsbedömning} />
        )}
```

- [ ] **Step 2: Check for other helhetsbedömning rendering in the same file**

There is a second helhetsbedömning box around line 387–398 (shown after payment in the redirect view). Replace that block too:

```tsx
        {/* Old block (~line 387-398): */}
        {result.helhetsbedömning && (
          <div style={{
            border: `2px solid ${result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-border)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-border)" : "var(--color-surface-300)"}`,
            backgroundColor: result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-bg)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-bg)" : "var(--color-surface-0)",
            ...
          }}>
```

With:

```tsx
        {result.helhetsbedömning && (
          <OverallGauge assessment={result.helhetsbedömning} />
        )}
```

- [ ] **Step 3: Verify build**

Run: `npx next build`
Expected: Build succeeds with no type errors

- [ ] **Step 4: Commit**

```bash
git add src/components/analysis-flow.tsx
git commit -m "feat: replace helhetsbedömning box with OverallGauge in free preview"
```

---

### Task 3: Integrate gauge into full report (full-report.tsx)

**Files:**
- Modify: `src/components/full-report.tsx:369-372, 1379-1452`

- [ ] **Step 1: Add import and replace usage**

At the top of `full-report.tsx`, add:

```typescript
import { OverallGauge } from "@/components/overall-gauge";
```

Replace lines 369–372:

```tsx
          {data.helhetsbedömning && (
            <div style={{ marginBottom: "1.5rem" }}>
              <OverallAssessment assessment={data.helhetsbedömning} />
            </div>
          )}
```

With:

```tsx
          {data.helhetsbedömning && (
            <div style={{ marginBottom: "1.5rem" }}>
              <OverallGauge assessment={data.helhetsbedömning} />
            </div>
          )}
```

- [ ] **Step 2: Remove the old `OverallAssessment` function**

Delete the entire `OverallAssessment` function (lines ~1379–1452):

```tsx
function OverallAssessment({
  assessment,
}: {
  assessment: AnalysisResult["helhetsbedömning"];
}) {
  // ... entire function through closing }
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build`
Expected: Build succeeds. No references to `OverallAssessment` remain.

- [ ] **Step 4: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (including the new overall-gauge tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/full-report.tsx
git commit -m "feat: replace OverallAssessment with OverallGauge in full report"
```
