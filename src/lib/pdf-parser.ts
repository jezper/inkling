"use client";

/**
 * pdf-parser.ts
 * Extraherar text från PDF-filer client-side med pdfjs-dist.
 * Om PDF:en är skannad (bild-PDF) används Tesseract.js för OCR.
 * Original-PDF:en lämnar ALDRIG användarens enhet.
 */

export interface ParseResult {
  text: string;
  pageCount: number;
  usedOcr: boolean;
}

// Minimum antal tecken per sida för att anses ha sökbar text
const MIN_CHARS_PER_PAGE = 20;

/**
 * Extraherar all text ur en PDF-fil.
 * Försöker först med pdfjs (sökbar text), faller tillbaka till OCR vid bild-PDF.
 */
export async function parsePdf(
  file: File,
  onProgress?: (message: string) => void,
): Promise<ParseResult> {
  if (typeof window === "undefined") {
    throw new Error("parsePdf kan endast köras i webbläsaren.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib = (await import("pdfjs-dist")) as any;

  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  let arrayBuffer: ArrayBuffer;
  let ocrBuffer: ArrayBuffer;
  try {
    const rawBuffer = await file.arrayBuffer();
    arrayBuffer = rawBuffer.slice(0);
    ocrBuffer = rawBuffer.slice(0);
  } catch {
    throw new Error(
      "Vi kunde inte läsa filen. Kontrollera att filen inte är skadad.",
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pdf: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      isEvalSupported: false,
      useWorkerFetch: false,
      disableAutoFetch: true,
      disableStream: true,
    });
    pdf = await loadingTask.promise;
  } catch (err) {
    const message =
      err instanceof Error && err.name === "PasswordException"
        ? "Vi kunde inte läsa dokumentet — filen verkar vara lösenordsskyddad."
        : "Vi kunde inte läsa dokumentet. Prova en annan PDF.";
    throw new Error(message);
  }

  const numPages: number = pdf.numPages as number;

  // Steg 1: Försök extrahera sökbar text
  onProgress?.("Läser PDF...");
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page: any = await pdf.getPage(pageNum);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const textContent: any = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText: string = textContent.items
        .map((item: any) => (typeof item.str === "string" ? item.str : ""))
        .join(" ");
      pageTexts.push(pageText);
    } catch {
      pageTexts.push("");
    }
  }

  const textFromPdf = pageTexts.join("\n\n").trim();

  // Kolla om vi fick tillräckligt med text
  const avgCharsPerPage =
    numPages > 0 ? textFromPdf.length / numPages : 0;

  if (avgCharsPerPage >= MIN_CHARS_PER_PAGE) {
    await pdf.destroy();
    return { text: textFromPdf, pageCount: numPages, usedOcr: false };
  }

  // Steg 2: Bild-PDF — kör OCR med Tesseract.js
  onProgress?.("Skannad PDF — kör textavläsning (OCR)...");

  let ocrText: string;
  try {
    ocrText = await runOcrOnPdf(ocrBuffer, numPages, onProgress);
  } catch (err) {
    await pdf.destroy();
    // eslint-disable-next-line no-console
    console.error("[pdf-parser] OCR error:", err);
    throw new Error(
      `Textavläsning (OCR) misslyckades: ${err instanceof Error ? err.message : "okänt fel"}. Prova att konvertera PDF:en till sökbar text först.`,
    );
  }

  await pdf.destroy();

  if (!ocrText.trim()) {
    throw new Error(
      "OCR kunde inte extrahera text. PDF:en kan vara tom, ha för låg upplösning, eller innehålla handskriven text som inte går att tolka automatiskt.",
    );
  }

  return { text: ocrText, pageCount: numPages, usedOcr: true };
}

/**
 * Renderar varje PDF-sida till canvas och kör Tesseract OCR.
 */
async function runOcrOnPdf(
  arrayBuffer: ArrayBuffer,
  numPages: number,
  onProgress?: (message: string) => void,
): Promise<string> {
  // Skapa en ny pdfjs-instans UTAN restriktiva options för bättre bildrendering
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfjsLib = (await import("pdfjs-dist")) as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ocrPdf: any = await pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    isEvalSupported: false,
  }).promise;

  const Tesseract = await import("tesseract.js");

  onProgress?.("Laddar OCR-motor...");

  // Skapa worker — prova svenska+engelska, fallback till bara engelska
  let worker: Tesseract.Worker;
  try {
    worker = await Tesseract.createWorker("swe+eng");
  } catch {
    try {
      worker = await Tesseract.createWorker("eng");
    } catch (e) {
      throw new Error(`OCR-motorn kunde inte startas: ${e instanceof Error ? e.message : "okänt fel"}`);
    }
  }

  const ocrTexts: string[] = [];
  // Begränsa till max 20 sidor för att inte frysa webbläsaren
  const maxPages = Math.min(numPages, 20);

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    onProgress?.(`Läser sida ${pageNum} av ${maxPages}...`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page: any = await ocrPdf.getPage(pageNum);

      try {
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // eslint-disable-next-line no-console
          console.warn(`[ocr] No canvas context for page ${pageNum}`);
          ocrTexts.push("");
          continue;
        }

        await page.render({ canvasContext: ctx, viewport }).promise;

        const dataUrl = canvas.toDataURL("image/png");
        // Release canvas memory immediately after converting to data URL
        canvas.width = 0;
        canvas.height = 0;

        const { data: { text } } = await worker.recognize(dataUrl);
        ocrTexts.push(text);
      } finally {
        // Release pdfjs page resources regardless of success or failure
        page.cleanup();
      }
    } catch (pageErr) {
      // eslint-disable-next-line no-console
      console.error(`[ocr] Page ${pageNum} failed:`, pageErr);
      ocrTexts.push("");
    }
  }

  await worker.terminate();
  await ocrPdf.destroy();

  return ocrTexts.join("\n\n").trim();
}
