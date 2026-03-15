"use client";

/**
 * pdf-parser.ts
 * Extraherar text från PDF-filer client-side med pdfjs-dist.
 * Original-PDF:en lämnar ALDRIG användarens enhet — inga nätverksanrop härifrån.
 *
 * OBS: pdfjs-dist importeras dynamiskt för att undvika SSR-problem och
 * för att inte blockera initial bundle. Körs enbart i browser.
 */

export interface ParseResult {
  text: string;
  pageCount: number;
}

/**
 * Extraherar all text ur en PDF-fil.
 * @throws Error med användarvänligt meddelande om PDF inte kan läsas.
 */
export async function parsePdf(file: File): Promise<ParseResult> {
  if (typeof window === "undefined") {
    throw new Error("parsePdf kan endast köras i webbläsaren.");
  }

  // Dynamisk import — pdfjs-dist laddas enbart när det faktiskt behövs.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamisk import av ESM-modul utan förutsebar typinferens vid build
  const pdfjsLib = (await import("pdfjs-dist")) as any;

  // Konfigurera worker — peka på filen i public/ som kopierats av postinstall-scriptet.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  }

  let arrayBuffer: ArrayBuffer;
  try {
    arrayBuffer = await file.arrayBuffer();
  } catch {
    throw new Error(
      "Vi kunde inte läsa filen. Kontrollera att filen inte är skadad."
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pdfjs returnerar untyped promise vid dynamisk import
  let pdf: any;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      // Stäng av externa resurser — allt sker lokalt.
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

  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= (pdf.numPages as number); pageNum++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pdfjs page-objekt
      const page: any = await pdf.getPage(pageNum);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- pdfjs textContent
      const textContent: any = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- item kan vara TextItem eller TextMarkedContent
      const pageText: string = textContent.items
        .map((item: any) => {
          return typeof item.str === "string" ? item.str : "";
        })
        .join(" ");
      pageTexts.push(pageText);
    } catch {
      // Hoppa över sidor som inte kan läsas — fortsätt med resten.
      pageTexts.push("");
    }
  }

  const numPages: number = pdf.numPages as number;
  await pdf.destroy();

  const text = pageTexts.join("\n\n").trim();

  if (!text) {
    throw new Error(
      "Vi kunde inte läsa dokumentet — det verkar inte innehålla sökbar text. PDF:en kan vara skannad som bild."
    );
  }

  return { text, pageCount: numPages };
}
