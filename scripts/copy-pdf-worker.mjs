/**
 * copy-pdf-worker.mjs
 * Körs efter `npm install` (postinstall) och kopierar pdf.js worker till public/.
 * Krävs för att pdfjs-dist ska fungera client-side i Next.js.
 */

import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

const source = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const destDir = join(root, "public");
const dest = join(destDir, "pdf.worker.min.mjs");

if (!existsSync(source)) {
  // pdfjs-dist är inte installerat ännu — hoppa över (t.ex. vid CI-scaffold)
  process.exit(0);
}

if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
}

try {
  copyFileSync(source, dest);
  console.log("[copy-pdf-worker] pdf.worker.min.mjs kopierad till public/");
} catch (err) {
  console.error("[copy-pdf-worker] Kunde inte kopiera worker:", err);
  process.exit(1);
}
