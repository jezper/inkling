# PROBLEM.md — Kända problem & Tech debt

> Uppdateras löpande av Claude Code.

---

### 2026-03-15 — WCAG AAA: --color-text-subtle är AA men ej AAA

**Allvarlighet:** Låg
**Beskrivning:** `--color-text-subtle` (#5C5C6A, f.d. #8888A0) är nu 6.0:1 mot vit — uppfyller AA men inte AAA (kräver 7:1). Token är reserverat för strikt dekorativ text som datum-stämplar, separatortecken ("·") och timestamps. Inget bärande informationsinnehåll ska använda denna färg.
**Workaround:** Säkerställ att `--color-text-subtle` enbart används för visuella detaljer, aldrig för text som bär unik information.
**Fix:** Höj till #47474F för full AAA, eller acceptera AA för dessa dekorativa sammanhang. Kräver designbeslut.

### 2026-03-15 — WCAG AAA: Focus ring kontrast mot accent-bakgrund

**Allvarlighet:** Medel
**Beskrivning:** Focus ring använder `--color-accent-500` (#E63E1E). På element med vit/ljus bakgrund ger detta 4.22:1 mot bakgrunden — underkänt AA 3:1 för UI-komponenter vid 2px tjocklek. WCAG 2.2 kräver att focus indicator har minst 3:1 kontrast mot angränsande färger och täcker ett tillräckligt perimeter.
**Workaround:** Nuvarande 2px offset-3px gör ringen synlig mot vit bakgrund via offset-mellanrum. Funktionellt godkänt men inte fullt compliant.
**Fix:** Ändra `--focus-outline-color` till `--color-accent-text` (#A82E14, 7.1:1 på vit) för att uppfylla WCAG 2.2 §2.4.11 AAA. Rör globals.css rad 127.

### 2026-03-15 — Ingen fokustrapfångst i AnalyzingOverlay

**Allvarlighet:** Hög
**Beskrivning:** `AnalyzingOverlay` är ett `role="dialog"` men fångar inte tangentbordsfokus. Användare kan tabba förbi overlayen till innehåll under den. Korrekt modal-implementation kräver fokus-trap (fokus sätts på dialogen vid öppning, tabbar cyklar inom den, Escape stänger).
**Workaround:** Ingen. Overlayen har inga interaktiva element så problemet är begränsat till att fokus hamnar fel.
**Fix:** Lägg till fokus-trap-hook eller använd `<dialog>`-elementet nativt med `showModal()`. Kräver React-refaktorering av `AnalyzingOverlay`.

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

### 2026-03-15 — Skannade PDF:er (bild-PDF) ger felmeddelande utan vägledning

**Allvarlighet:** Låg
**Beskrivning:** Skannade avtal i PDF-format (utan sökbar text) hanteras med felmeddelandet "Vi kunde inte läsa dokumentet — det verkar inte innehålla sökbar text. PDF:en kan vara skannad som bild." Det finns ingen OCR-funktion och felmeddelandet ger ingen konkret alternativ väg framåt.
**Workaround:** Användaren uppmanas prova annan PDF.
**Fix:** V2: lägg till OCR-stöd (t.ex. Tesseract.js) eller tydligare vägledning om hur man konverterar bildpdf till text-pdf.
