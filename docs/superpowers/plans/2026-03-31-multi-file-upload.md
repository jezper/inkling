# Multi-file Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow users to upload 1-5 PDF files, see them listed with parse status, and explicitly click "Analysera" to analyze the combined text.

**Architecture:** UploadStep becomes a multi-file manager: each file is validated and parsed independently on add, displayed in a file list, and the user triggers analysis manually. AnalysisFlow's `handleParsed` is replaced with `handleAnalyze` that receives combined text. No changes to pdf-parser, pii-stripper, API routes, or downstream components.

**Tech Stack:** React (existing), Vitest (existing), Lucide icons (existing)

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/components/upload-step.tsx` | Modify | Multi-file drop zone, file list, "Analysera" button |
| `src/components/analysis-flow.tsx` | Modify | Update `handleParsed` → `handleAnalyze`, update `ParsedData` interface |
| `tests/components/upload-step.test.tsx` | Create | Unit tests for file validation, list management, text concatenation |

---

### Task 1: Write tests for multi-file upload logic

**Files:**
- Create: `tests/components/upload-step.test.tsx`

- [ ] **Step 1: Write tests for the file management logic**

We can't easily test the full component (it depends on pdf-parser which needs browser APIs), but we can extract and test the pure logic. Instead, we'll test the `validateFile` function and the text concatenation logic by extracting them. But `validateFile` is currently not exported. We'll test via the component's behavior using @testing-library/react.

Actually, the simplest approach: extract `validateFile` and a new `combineFileTexts` helper as named exports, and test those directly.

Create `tests/components/upload-step.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";

// We test the pure functions that will be extracted from upload-step
// These will be created in Task 2

import { validateFile, combineFileTexts, MAX_FILES } from "@/components/upload-step";

describe("validateFile", () => {
  it("rejects non-PDF files", () => {
    const file = new File(["hello"], "test.txt", { type: "text/plain" });
    expect(validateFile(file)).toBe("Filen måste vara en PDF.");
  });

  it("accepts PDF files", () => {
    const file = new File(["hello"], "test.pdf", { type: "application/pdf" });
    expect(validateFile(file)).toBeNull();
  });

  it("rejects files over 25 MB", () => {
    const bigContent = new Uint8Array(26 * 1024 * 1024);
    const file = new File([bigContent], "big.pdf", { type: "application/pdf" });
    expect(validateFile(file)).toContain("för stor");
  });

  it("accepts PDF by extension even without mime type", () => {
    const file = new File(["hello"], "contract.pdf", { type: "" });
    expect(validateFile(file)).toBeNull();
  });
});

describe("combineFileTexts", () => {
  it("combines multiple texts with separator", () => {
    const entries = [
      { text: "Avtal del 1", pageCount: 2 },
      { text: "Avtal del 2", pageCount: 3 },
    ];
    const result = combineFileTexts(entries);
    expect(result.text).toBe("Avtal del 1\n\n---\n\nAvtal del 2");
    expect(result.pageCount).toBe(5);
  });

  it("returns single text without separator", () => {
    const entries = [{ text: "Bara en fil", pageCount: 1 }];
    const result = combineFileTexts(entries);
    expect(result.text).toBe("Bara en fil");
    expect(result.pageCount).toBe(1);
  });

  it("handles empty array", () => {
    const result = combineFileTexts([]);
    expect(result.text).toBe("");
    expect(result.pageCount).toBe(0);
  });
});

describe("MAX_FILES", () => {
  it("is 5", () => {
    expect(MAX_FILES).toBe(5);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test -- tests/components/upload-step.test.tsx
```

Expected: FAIL — `validateFile`, `combineFileTexts`, and `MAX_FILES` are not exported from upload-step.

- [ ] **Step 3: Commit failing tests**

```bash
git add tests/components/upload-step.test.tsx
git commit -m "test: add failing tests for multi-file upload logic"
```

---

### Task 2: Rewrite UploadStep for multi-file support

**Files:**
- Modify: `src/components/upload-step.tsx`

- [ ] **Step 1: Rewrite upload-step.tsx**

Replace the entire contents of `src/components/upload-step.tsx` with:

```tsx
"use client";

import { useRef, useState, useCallback, useId } from "react";
import { Upload, FileText, AlertCircle, Loader2, X } from "lucide-react";

// --- Exported pure functions (testable) ---

export const MAX_FILES = 5;
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_COMBINED_CHARS = 50_000;

export function validateFile(file: File): string | null {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Filen måste vara en PDF.";
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return `Filen är för stor. Max ${MAX_FILE_SIZE_MB} MB tillåts.`;
  }
  return null;
}

export function combineFileTexts(
  entries: { text: string; pageCount: number }[],
): { text: string; pageCount: number } {
  if (entries.length === 0) return { text: "", pageCount: 0 };
  return {
    text: entries.map((e) => e.text).join("\n\n---\n\n"),
    pageCount: entries.reduce((sum, e) => sum + e.pageCount, 0),
  };
}

// --- Types ---

interface FileEntry {
  id: string;
  file: File;
  status: "parsing" | "ready" | "error";
  text: string;
  pageCount: number;
  errorMessage?: string;
}

export interface UploadStepProps {
  onAnalyze: (result: { text: string; pageCount: number; fileNames: string[] }) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
}

// --- Component ---

export function UploadStep({ onAnalyze, onError, isProcessing }: UploadStepProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const errorId = useId();

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      setValidationError(null);

      const remaining = MAX_FILES - files.length;
      if (remaining <= 0) {
        setValidationError(`Max ${MAX_FILES} filer tillåts.`);
        return;
      }

      const toAdd = newFiles.slice(0, remaining);
      if (newFiles.length > remaining) {
        setValidationError(`Max ${MAX_FILES} filer tillåts. ${newFiles.length - remaining} fil(er) hoppades över.`);
      }

      // Create entries with parsing status
      const entries: FileEntry[] = toAdd.map((file) => {
        const error = validateFile(file);
        return {
          id: crypto.randomUUID(),
          file,
          status: error ? ("error" as const) : ("parsing" as const),
          text: "",
          pageCount: 0,
          errorMessage: error ?? undefined,
        };
      });

      setFiles((prev) => [...prev, ...entries]);

      // Parse each valid file independently
      const { parsePdf } = await import("@/lib/pdf-parser");

      for (const entry of entries) {
        if (entry.status === "error") continue;

        try {
          const result = await parsePdf(entry.file);
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "ready" as const, text: result.text, pageCount: result.pageCount }
                : f,
            ),
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Kunde inte läsa filen.";
          setFiles((prev) =>
            prev.map((f) =>
              f.id === entry.id
                ? { ...f, status: "error" as const, errorMessage: message }
                : f,
            ),
          );
        }
      }
    },
    [files.length],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setValidationError(null);
  }, []);

  const handleAnalyzeClick = useCallback(() => {
    const readyFiles = files.filter((f) => f.status === "ready");
    if (readyFiles.length === 0) return;

    const combined = combineFileTexts(readyFiles);
    if (combined.text.length > MAX_COMBINED_CHARS) {
      setValidationError("Den sammanlagda texten är för lång. Ta bort ett dokument och försök igen.");
      return;
    }

    onAnalyze({
      text: combined.text,
      pageCount: combined.pageCount,
      fileNames: readyFiles.map((f) => f.file.name),
    });
  }, [files, onAnalyze]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) void addFiles(droppedFiles);
    },
    [addFiles],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) void addFiles(selected);
    e.target.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const hasError = !!validationError;
  const readyCount = files.filter((f) => f.status === "ready").length;
  const parsingCount = files.filter((f) => f.status === "parsing").length;
  const canAnalyze = readyCount > 0 && parsingCount === 0 && !isProcessing;
  const atLimit = files.length >= MAX_FILES;

  return (
    <div style={{ maxWidth: "680px", position: "relative" }}>
      {/* Drop zone — hidden when at file limit */}
      {!atLimit && (
        <div
          role="button"
          tabIndex={0}
          aria-label={files.length === 0 ? "Välj eller dra hit dina PDF-filer" : "Lägg till fler filer"}
          aria-describedby={hasError ? errorId : undefined}
          aria-disabled={isProcessing}
          onDrop={isProcessing ? undefined : handleDrop}
          onDragOver={isProcessing ? undefined : handleDragOver}
          onDragLeave={isProcessing ? undefined : handleDragLeave}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          onKeyDown={isProcessing ? undefined : handleKeyDown}
          style={{
            border: `2px dashed ${
              hasError
                ? "var(--color-severity-high-icon)"
                : isDragging
                ? "var(--color-accent-500)"
                : "var(--color-surface-300)"
            }`,
            borderRadius: "var(--radius-md)",
            backgroundColor: isDragging ? "var(--color-accent-glow-sm)" : "var(--color-surface-0)",
            padding: files.length > 0 ? "1.25rem 1.25rem" : "2rem 1.25rem",
            cursor: isProcessing ? "not-allowed" : "pointer",
            transition: "border-color var(--duration-normal) var(--ease-in-out), background-color var(--duration-normal) var(--ease-in-out)",
            opacity: isProcessing ? 0.6 : 1,
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: files.length > 0 ? "0.5rem" : "1rem",
            userSelect: "none",
          }}
        >
          <Upload
            size={files.length > 0 ? 20 : 32}
            strokeWidth={1.5}
            aria-hidden="true"
            style={{
              color: isDragging ? "var(--color-accent-500)" : "var(--color-surface-400)",
            }}
          />
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: files.length > 0 ? "var(--text-sm)" : "var(--text-base)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {isDragging
                ? "Släpp filerna här"
                : files.length > 0
                ? "Lägg till fler filer"
                : "Välj PDF eller dra hit den"}
            </p>
            {files.length === 0 && (
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase" as const,
                  marginTop: "0.25rem",
                }}
              >
                PDF · Max {MAX_FILE_SIZE_MB} MB · Upp till {MAX_FILES} filer
              </p>
            )}
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        onChange={handleInputChange}
        disabled={isProcessing}
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", whiteSpace: "nowrap" }}
      />

      {/* File list */}
      {files.length > 0 && (
        <div role="list" aria-label="Uppladdade filer" aria-live="polite" style={{ marginTop: "0.75rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {files.map((entry) => (
            <div
              key={entry.id}
              role="listitem"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-md)",
                backgroundColor: entry.status === "error" ? "var(--color-severity-high-bg)" : "var(--color-surface-50)",
                border: `1px solid ${entry.status === "error" ? "var(--color-severity-high-border)" : "var(--color-surface-200)"}`,
              }}
            >
              {/* Icon */}
              {entry.status === "parsing" && (
                <Loader2 className="animate-spin" size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-accent-500)", flexShrink: 0 }} />
              )}
              {entry.status === "ready" && (
                <FileText size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-text-muted)", flexShrink: 0 }} />
              )}
              {entry.status === "error" && (
                <AlertCircle size={16} strokeWidth={1.5} aria-hidden="true" style={{ color: "var(--color-severity-high-icon)", flexShrink: 0 }} />
              )}

              {/* Filename */}
              <span
                style={{
                  flex: 1,
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: entry.status === "error" ? "var(--color-severity-high-text)" : "var(--color-text-primary)",
                  letterSpacing: "0.02em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {entry.file.name}
              </span>

              {/* Status text */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  color: entry.status === "error" ? "var(--color-severity-high-text)" : "var(--color-text-muted)",
                  letterSpacing: "0.02em",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                }}
              >
                {entry.status === "parsing" && "Läser..."}
                {entry.status === "ready" && `${entry.pageCount} ${entry.pageCount === 1 ? "sida" : "sidor"}`}
                {entry.status === "error" && (entry.errorMessage ?? "Fel")}
              </span>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFile(entry.id)}
                aria-label={`Ta bort ${entry.file.name}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "28px",
                  height: "28px",
                  minWidth: "44px",
                  minHeight: "44px",
                  padding: 0,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Analysera button */}
      {files.length > 0 && (
        <button
          type="button"
          onClick={handleAnalyzeClick}
          disabled={!canAnalyze}
          style={{
            marginTop: "1rem",
            width: "100%",
            padding: "0.75rem 1.5rem",
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: canAnalyze ? "var(--color-surface-0)" : "var(--color-text-muted)",
            backgroundColor: canAnalyze ? "var(--color-accent-500)" : "var(--color-surface-200)",
            border: "none",
            borderRadius: "var(--radius-md)",
            cursor: canAnalyze ? "pointer" : "not-allowed",
            transition: "background-color var(--duration-normal) var(--ease-in-out)",
            minHeight: "44px",
          }}
        >
          {parsingCount > 0
            ? "Läser filer..."
            : readyCount === 1
            ? "Analysera"
            : `Analysera ${readyCount} filer`}
        </button>
      )}

      {/* Inline error */}
      {hasError && (
        <p
          id={errorId}
          role="alert"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            marginTop: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-severity-high-icon)",
            letterSpacing: "0.02em",
          }}
        >
          <AlertCircle size={14} strokeWidth={2} aria-hidden="true" />
          {validationError}
        </p>
      )}

      {/* Privacy note */}
      {!isProcessing && !hasError && files.length === 0 && (
        <p
          style={{
            marginTop: "0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          Ditt avtal stannar på din enhet. Namn, personnummer och andra personuppgifter rensas automatiskt innan analysen körs.{" "}
          <a href="/faq#privacy-och-säkerhet" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: "2px" }}>Läs mer</a>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Run tests to verify they pass**

```bash
npm test -- tests/components/upload-step.test.tsx
```

Expected: All 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add src/components/upload-step.tsx tests/components/upload-step.test.tsx
git commit -m "feat: rewrite UploadStep for multi-file support (up to 5 PDFs)"
```

---

### Task 3: Update AnalysisFlow to use new onAnalyze callback

**Files:**
- Modify: `src/components/analysis-flow.tsx` (lines 1-120)

- [ ] **Step 1: Update ParsedData interface and handleParsed → handleAnalyze**

In `src/components/analysis-flow.tsx`, make these changes:

1. Change the `ParsedData` interface (lines 11-16):

```ts
// Before
interface ParsedData {
  text: string;
  pageCount: number;
  fileName: string;
  usedOcr?: boolean;
}

// After
interface ParsedData {
  text: string;
  pageCount: number;
  fileNames: string[];
}
```

2. Rename `handleParsed` to `handleAnalyze` and update its signature (lines 32-72):

```ts
  const handleAnalyze = useCallback((result: ParsedData) => {
    setParsedData(result);
    setErrorMessage(null);
    try {
      const strip = stripPii(result.text);
      setStrippedText(strip.strippedText);
      setPiiCount(strip.piiCount);

      setState("analyzing");

      const controller = new AbortController();
      setPendingAnalysis(controller);
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: strip.strippedText }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrorMessage(data.error);
            setState("upload");
            setPendingAnalysis(null);
            return;
          }
          setAnalysisResult(data.result);
          setPendingAnalysis(null);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setErrorMessage("Kunde inte nå servern. Försök igen.");
          setState("upload");
          setPendingAnalysis(null);
        });
    } catch {
      setErrorMessage("Kunde inte bearbeta dokumentet. Prova en annan PDF.");
      setState("upload");
    }
  }, []);
```

3. Update the `<UploadStep>` usage in the return JSX (around line 162):

```tsx
// Before
<UploadStep onParsed={handleParsed} onError={(msg) => { setErrorMessage(msg); setState("upload"); }} isProcessing={state === "processing"} />

// After
<UploadStep onAnalyze={handleAnalyze} onError={(msg) => { setErrorMessage(msg); setState("upload"); }} isProcessing={state === "analyzing"} />
```

Note: `isProcessing` now reflects `state === "analyzing"` (the API call phase), since file parsing is managed internally by UploadStep.

- [ ] **Step 2: Verify build passes**

```bash
npm run build 2>&1 | tail -5
```

Expected: Build succeeds with no type errors.

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass (the existing PII/validation tests are unaffected).

- [ ] **Step 4: Commit**

```bash
git add src/components/analysis-flow.tsx
git commit -m "feat: update AnalysisFlow to use multi-file onAnalyze callback"
```

---

### Task 4: Manual verification and E2E

**Files:**
- Modify: `e2e/smoke.spec.ts` (add upload section test)

- [ ] **Step 1: Manual browser test**

Open http://localhost:3000 and verify:

1. Drop zone says "Välj PDF eller dra hit den" with "PDF · Max 25 MB · Upp till 5 filer"
2. Select a single PDF → file appears in list with "Läser..." → then page count
3. "Analysera" button appears when file is ready
4. Click drop zone again → add a second file
5. Both files listed, button says "Analysera 2 filer"
6. Click X on a file → it's removed
7. Click "Analysera" → analysis overlay appears → result shows

- [ ] **Step 2: Add E2E test for upload section visibility**

In `e2e/smoke.spec.ts`, the existing landing page test already checks `#upload` is visible. Add a test that verifies the multi-file hint text:

```ts
test("shows multi-file upload hint", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Upp till 5 filer")).toBeVisible();
});
```

Add this inside the existing `test.describe("Landing page", ...)` block.

- [ ] **Step 3: Run E2E tests**

```bash
npm run test:e2e
```

Expected: All tests pass including the new one.

- [ ] **Step 4: Commit**

```bash
git add e2e/smoke.spec.ts
git commit -m "test: add E2E test for multi-file upload hint"
```

---

### Task 5: Update project docs

**Files:**
- Modify: `STATUS.md`
- Modify: `BESLUT.md`

- [ ] **Step 1: Add decision to BESLUT.md**

Add a new entry at the top of the decisions section:

```markdown
### 2026-03-31 — Multi-fil-uppladdning (UX)

**Kontext:** Anställningsavtal kommer ofta som 2-4 separata PDF:er (rollbrev + policy + förmåner). Enfilsuppladdning tvingade användare att välja en och missa viktiga klausuler.

**Beslut:**
- Upload-steget accepterar 1-5 PDF-filer (drag-and-drop eller filväljare, en eller flera åt gången)
- Varje fil parsas oberoende vid tillägg och visas i en fillista med status
- Användaren klickar explicit "Analysera" — ingen automatisk analys
- Texter konkateneras i uppladdningsordning, separerade med `---`
- Befintlig 50k-teckengräns gäller för kombinerad text

**Motivering:** Enklaste UX:en som löser flerfilsbehovet. Explicit "Analysera"-knapp ger kontroll. Ingen ändring av API eller backend — allt hanteras i klienten.

**Påverkar:** `src/components/upload-step.tsx`, `src/components/analysis-flow.tsx`
```

- [ ] **Step 2: Add session note to STATUS.md**

Add to the top of `## Senaste session`:

```markdown
**2026-03-31 — Multi-fil-uppladdning**

Upload-steget omskrivet för att stödja 1-5 PDF-filer. Fillista med parse-status, explicit "Analysera"-knapp, max 5 filer, 50k-teckengräns. Inga API-ändringar.

**Ändrade filer:**
- `src/components/upload-step.tsx` — Ny multi-fil-logik, fillista, analysera-knapp
- `src/components/analysis-flow.tsx` — `handleParsed` → `handleAnalyze`, uppdaterad ParsedData
- `tests/components/upload-step.test.tsx` (ny) — 6 tester
- `e2e/smoke.spec.ts` — Nytt test för flerfilstext
- `BESLUT.md` — Beslut dokumenterat
```

- [ ] **Step 3: Commit**

```bash
git add STATUS.md BESLUT.md
git commit -m "docs: document multi-file upload decision and session"
```
