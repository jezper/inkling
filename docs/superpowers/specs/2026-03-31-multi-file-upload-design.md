# Multi-file Upload — Design Spec

## Goal
Allow users to upload multiple PDF files (up to 5) that together form their employment contract, then explicitly trigger analysis on the combined text.

## Motivation
Employment contracts commonly arrive as 2-4 separate PDFs: a role-specific letter, company policies, benefits/perks documents. Currently users can only upload one file and miss important clauses in the other documents.

## Flow

```
1. User drops/selects one or more PDFs into the drop zone
2. Each file is validated (PDF, ≤25 MB) and parsed immediately (text extraction in background)
3. A file list renders below the drop zone showing each file with status
4. User can remove individual files (X) or add more (click/drop again)
5. When ≥1 file is ready, "Analysera" button appears
6. User clicks "Analysera" → texts concatenated in upload order → PII stripped → API call
```

## Limits

| Constraint | Value | Reason |
|-----------|-------|--------|
| Max files | 5 | Covers all realistic contract splits |
| Max per file | 25 MB | Existing limit, unchanged |
| Max combined text | 50,000 chars | Existing API limit, unchanged |

If combined text exceeds 50k chars, show inline error before sending: "Den sammanlagda texten är för lång. Ta bort ett dokument och försök igen."

## Component: UploadStep

### Props change

```ts
// Before
interface UploadStepProps {
  onParsed: (result: { text: string; pageCount: number; fileName: string }) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
}

// After
interface UploadStepProps {
  onAnalyze: (result: { text: string; pageCount: number; fileNames: string[] }) => void;
  onError: (message: string) => void;
  isProcessing: boolean;
}
```

### Internal state

```ts
interface FileEntry {
  id: string;          // crypto.randomUUID()
  file: File;
  status: "parsing" | "ready" | "error";
  text: string;        // extracted text (empty until ready)
  pageCount: number;
  errorMessage?: string;
}

const [files, setFiles] = useState<FileEntry[]>([]);
```

### Behavior

- **Drop zone**: Always visible. `<input multiple>` allows selecting several files at once. Drop accepts multiple files. If adding would exceed 5, show validation error "Max 5 filer tillåts."
- **File parsing**: Each file parsed immediately on add via dynamic `import("@/lib/pdf-parser")`. Parsing is independent per file (one failing doesn't block others).
- **File list**: Renders below drop zone when `files.length > 0`. Each entry shows:
  - Parsing: `Loader2` spinner + filename + "Läser..."
  - Ready: `FileText` icon + filename + page count + file size
  - Error: `AlertCircle` icon + filename + error message (red)
  - All entries have a remove button (X) on the right
- **Drop zone text changes**:
  - No files: "Välj PDF eller dra hit den" (existing)
  - Has files, under limit: "Lägg till fler filer" + smaller upload icon
  - At 5 files: drop zone hidden or disabled
- **"Analysera" button**: Appears below file list when at least one file has status "ready". Disabled while any file is still "parsing". Button text: "Analysera" (or "Analysera N filer" if multiple).
- **On analyze click**: Concatenate `.text` from all ready files in order, separated by `\n\n---\n\n`. Call `onAnalyze` with combined text, total page count, and array of filenames.

### File list item layout

```
┌──────────────────────────────────────────────────┐
│  📄 anstallningsavtal-jezper.pdf    3 sidor  ✕   │
│  📄 foretaget-policy.pdf           12 sidor  ✕   │
│  ⏳ formaner.pdf                   Läser...   ✕   │
└──────────────────────────────────────────────────┘
         [ Analysera 3 filer ]
```

Uses same design tokens as existing UI. No new colors or typography. File list items use `--font-mono` for filenames, `--text-xs` for metadata.

## Component: AnalysisFlow

### Changes

- `handleParsed` renamed to `handleAnalyze`
- Receives `{ text: string; pageCount: number; fileNames: string[] }` instead of single file data
- `ParsedData` interface updated to hold `fileNames: string[]` instead of `fileName: string`
- Everything downstream (PII strip → API call → result) unchanged

## What does NOT change

- `pdf-parser.ts` — no changes, called per-file as today
- `pii-stripper.ts` — no changes, runs on concatenated text
- `/api/analyze` route — no changes, receives text string as before
- `full-report.tsx` — no changes
- Privacy note text — unchanged, still accurate
- 50k char API limit — unchanged

## Edge cases

| Scenario | Behavior |
|----------|----------|
| User drops 7 files | First 5 accepted, error shown for remainder |
| One file fails parsing, others succeed | Failed file shown with error, user can remove it, analyze with the rest |
| All files fail | No "Analysera" button, only error states |
| User removes all files | Back to initial empty state |
| Combined text > 50k chars | Error shown on analyze click, before API call |
| Same file added twice | Allowed (user's responsibility, filenames may differ for same content) |

## Accessibility

- File list uses `role="list"` with `role="listitem"` per entry
- Remove button: `aria-label="Ta bort [filename]"`
- Analyze button: standard `<button>` with clear label
- File status changes announced via `aria-live="polite"` region
- All interactive elements ≥44px touch target
