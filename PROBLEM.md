# PROBLEM.md — Kända problem & Tech debt

> Uppdateras löpande av Claude Code.

---

### 2026-03-15 — WCAG AAA: --color-text-subtle är AA men ej AAA

**Allvarlighet:** Låg
**Beskrivning:** `--color-text-subtle` (#5C5C6A, f.d. #8888A0) är nu 6.0:1 mot vit — uppfyller AA men inte AAA (kräver 7:1). Token är reserverat för strikt dekorativ text som datum-stämplar, separatortecken ("·") och timestamps. Inget bärande informationsinnehåll ska använda denna färg.
**Workaround:** Säkerställ att `--color-text-subtle` enbart används för visuella detaljer, aldrig för text som bär unik information.
**Fix:** Höj till #47474F för full AAA, eller acceptera AA för dessa dekorativa sammanhang. Kräver designbeslut.

### 2026-03-15 — WCAG AAA: Focus ring kontrast mot accent-bakgrund (LÖST 2026-03-31)

**Allvarlighet:** Medel → Löst
**Beskrivning:** Focus ring använde `--color-accent-500`. Underkänt AAA.
**Fix:** Klart. Ändrat till `--color-accent-700` (#941228, 8.5:1 på vit) — AAA-compliant. Rör globals.css.

### 2026-03-15 — Ingen fokustrapfångst i AnalyzingOverlay (LÖST 2026-03-31)

**Allvarlighet:** Hög → Löst
**Beskrivning:** `AnalyzingOverlay` använde `<div role="dialog">` utan fokus-trap.
**Fix:** Klart. Ersatt med nativt `<dialog>`-element + `showModal()`. Fokus fångas automatiskt av webbläsaren. Escape blockerad via `onCancel`. Rör `analysis-flow.tsx`.

### 2026-03-15 — Reflow vid 200% zoom: 2-kolumns grid i FlagCard (LÖST 2026-03-15)

**Allvarlighet:** Medel → Löst
**Beskrivning:** "Avtal vs lag"-grid och "Ditt avtal / Marknad"-grid i `analysis-flow.tsx` och `full-report.tsx` använde `gridTemplateColumns: "1fr 1fr"` utan responsive breakpoint.
**Fix:** Klart. Ersatt med CSS-klass `.comparison-grid-2col` i globals.css med `@media (max-width: 479px) { grid-template-columns: 1fr }`. Påverkar `analysis-flow.tsx` (tvåställen) och `full-report.tsx` (ett ställe).

---

## Format
```
### [Datum] — [Kort titel]
**Allvarlighet:** Kritisk / Hög / Medel / Låg
**Beskrivning:** Vad problemet är
**Workaround:** Eventuell tillfällig lösning
**Fix:** Vad som behöver göras
```

---

### 2026-03-15 — pdfjs-dist worker måste kopieras manuellt vid saknad postinstall

**Allvarlighet:** Hög
**Beskrivning:** `public/pdf.worker.min.mjs` kopieras av `scripts/copy-pdf-worker.mjs` som körs som npm postinstall. Om projektet klonas och `npm install` inte körs — eller om postinstall-scriptet hoppas över med `--ignore-scripts` — saknas worker-filen och PDF-parsing misslyckas i runtime (tystat fel i browser-konsolen).
**Workaround:** Kör `node scripts/copy-pdf-worker.mjs` manuellt.
**Fix:** Lägg till kontroll i CI-pipeline att `public/pdf.worker.min.mjs` finns. Alternativt: checka in filen i git (ökar repo-storlek med ~800 KB).

---

### 2026-03-15 — PII-stripping: regex lookbehind (LÖST i samma session)

**Allvarlighet:** Medel → Löst
**Beskrivning:** Ursprunglig implementation använde lookbehind-assertions (`(?<=...)`) för namn-heuristiken. Åtgärdat i samma session: ersatt med capture groups + replaceFn-callback. Kompatibel med Safari < 16.4.
**Fix:** Klart. Capture groups används — `pii-stripper.ts` rad ~65.

---

### 2026-03-15 — Skannade PDF:er (bild-PDF) OCR-stöd tillagt (LÖST 2026-03-15)

**Allvarlighet:** Låg → Löst
**Beskrivning:** Tesseract.js OCR-stöd implementerat i pdf-parser.ts. Skannade PDF:er renderas page-by-page till canvas (scale 2.0) och processas av Tesseract worker med swe+eng (fallback: eng). Max 20 sidor. Tre buggfixar gjorda under QA: double-destroy av pdfjs-objekt vid tom OCR-output, saknad page.cleanup() per sida, och debug console.log i produktion.
