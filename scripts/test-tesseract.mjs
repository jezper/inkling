/**
 * Minimal test script to verify Tesseract.js v7 works.
 * Creates a simple PNG with text and runs OCR on it.
 *
 * Usage: node scripts/test-tesseract.mjs
 *
 * Requires: tesseract.js (already in package.json)
 * Note: Uses a minimal hand-crafted PNG since we don't have the 'canvas' npm module.
 */

import Tesseract from "tesseract.js";
import { writeFileSync, unlinkSync } from "fs";

// Create a minimal 100x30 white PNG with black pixels spelling "Hi"
// This is a valid PNG file created programmatically
function createTestPng() {
  // We'll create a tiny BMP-style image and use Tesseract's image loading.
  // Actually, let's create a proper minimal PNG.

  // For simplicity, create a 1-bit image using raw pixel data.
  // Tesseract can handle raw image formats, but PNG is safest.

  // Minimal approach: write raw RGBA pixels into a PNG structure
  const width = 200;
  const height = 50;

  // Create image data: white background with black text-like pixels
  const pixels = new Uint8Array(width * height * 4);

  // Fill with white
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 255;     // R
    pixels[i + 1] = 255; // G
    pixels[i + 2] = 255; // B
    pixels[i + 3] = 255; // A
  }

  // Draw simple block letters "TEST" using pixel manipulation
  // Each letter is roughly 20px wide, 30px tall, starting at y=10
  const setPixel = (x, y) => {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      const idx = (y * width + x) * 4;
      pixels[idx] = 0;
      pixels[idx + 1] = 0;
      pixels[idx + 2] = 0;
    }
  };

  // Draw thick lines for letter shapes
  const drawRect = (x0, y0, w, h) => {
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        setPixel(x, y);
      }
    }
  };

  // Letter "T" at x=10
  drawRect(10, 10, 20, 4);   // top bar
  drawRect(18, 10, 4, 30);   // vertical

  // Letter "E" at x=40
  drawRect(40, 10, 4, 30);   // vertical
  drawRect(40, 10, 20, 4);   // top
  drawRect(40, 23, 16, 4);   // middle
  drawRect(40, 36, 20, 4);   // bottom

  // Letter "S" at x=70
  drawRect(70, 10, 20, 4);   // top
  drawRect(70, 10, 4, 14);   // top-left vertical
  drawRect(70, 22, 20, 4);   // middle
  drawRect(86, 24, 4, 14);   // bottom-right vertical
  drawRect(70, 36, 20, 4);   // bottom

  // Letter "T" at x=100
  drawRect(100, 10, 20, 4);  // top bar
  drawRect(108, 10, 4, 30);  // vertical

  // Encode as PNG
  return encodePng(width, height, pixels);
}

// Minimal PNG encoder
function encodePng(width, height, rgba) {
  const crc32Table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crc32Table[i] = c;
  }

  function crc32(data) {
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = crc32Table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function adler32(data) {
    let a = 1, b = 0;
    for (let i = 0; i < data.length; i++) {
      a = (a + data[i]) % 65521;
      b = (b + a) % 65521;
    }
    return ((b << 16) | a) >>> 0;
  }

  // Create raw image data with filter bytes
  const rawData = new Uint8Array(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // No filter
    for (let x = 0; x < width * 4; x++) {
      rawData[y * (1 + width * 4) + 1 + x] = rgba[y * width * 4 + x];
    }
  }

  // Deflate with stored blocks (no compression, simpler)
  const blocks = [];
  const BLOCK_SIZE = 65535;
  for (let i = 0; i < rawData.length; i += BLOCK_SIZE) {
    const isLast = i + BLOCK_SIZE >= rawData.length;
    const chunk = rawData.slice(i, i + BLOCK_SIZE);
    const header = new Uint8Array(5);
    header[0] = isLast ? 1 : 0;
    header[1] = chunk.length & 0xFF;
    header[2] = (chunk.length >> 8) & 0xFF;
    header[3] = ~chunk.length & 0xFF;
    header[4] = (~chunk.length >> 8) & 0xFF;
    blocks.push(header, chunk);
  }

  const adlerVal = adler32(rawData);
  const zlibHeader = new Uint8Array([0x78, 0x01]); // zlib header
  const zlibFooter = new Uint8Array([
    (adlerVal >> 24) & 0xFF,
    (adlerVal >> 16) & 0xFF,
    (adlerVal >> 8) & 0xFF,
    adlerVal & 0xFF,
  ]);

  let compressedLen = 2 + 4;
  for (const b of blocks) compressedLen += b.length;
  const compressed = new Uint8Array(compressedLen);
  let off = 0;
  compressed.set(zlibHeader, off); off += 2;
  for (const b of blocks) { compressed.set(b, off); off += b.length; }
  compressed.set(zlibFooter, off);

  function makeChunk(type, data) {
    const typeBytes = new TextEncoder().encode(type);
    const len = data.length;
    const chunk = new Uint8Array(12 + len);
    chunk[0] = (len >> 24) & 0xFF;
    chunk[1] = (len >> 16) & 0xFF;
    chunk[2] = (len >> 8) & 0xFF;
    chunk[3] = len & 0xFF;
    chunk.set(typeBytes, 4);
    chunk.set(data, 8);
    const crcData = new Uint8Array(4 + len);
    crcData.set(typeBytes, 0);
    crcData.set(data, 4);
    const crcVal = crc32(crcData);
    chunk[8 + len] = (crcVal >> 24) & 0xFF;
    chunk[9 + len] = (crcVal >> 16) & 0xFF;
    chunk[10 + len] = (crcVal >> 8) & 0xFF;
    chunk[11 + len] = crcVal & 0xFF;
    return chunk;
  }

  // IHDR
  const ihdr = new Uint8Array(13);
  ihdr[0] = (width >> 24) & 0xFF;
  ihdr[1] = (width >> 16) & 0xFF;
  ihdr[2] = (width >> 8) & 0xFF;
  ihdr[3] = width & 0xFF;
  ihdr[4] = (height >> 24) & 0xFF;
  ihdr[5] = (height >> 16) & 0xFF;
  ihdr[6] = (height >> 8) & 0xFF;
  ihdr[7] = height & 0xFF;
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const signature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrChunk = makeChunk("IHDR", ihdr);
  const idatChunk = makeChunk("IDAT", compressed);
  const iendChunk = makeChunk("IEND", new Uint8Array(0));

  const png = new Uint8Array(signature.length + ihdrChunk.length + idatChunk.length + iendChunk.length);
  let p = 0;
  png.set(signature, p); p += signature.length;
  png.set(ihdrChunk, p); p += ihdrChunk.length;
  png.set(idatChunk, p); p += idatChunk.length;
  png.set(iendChunk, p);

  return png;
}

async function main() {
  console.log("=== Tesseract.js v7 Test ===");
  console.log("Creating test PNG with block letters 'TEST'...");

  const pngData = createTestPng();
  const testFile = "/tmp/tesseract-test.png";
  writeFileSync(testFile, pngData);
  console.log(`Written test image: ${testFile} (${pngData.length} bytes)`);

  console.log("Creating Tesseract worker (eng)...");
  const worker = await Tesseract.createWorker("eng");
  console.log("Worker created successfully.");

  console.log("Running recognize...");
  const result = await worker.recognize(testFile);

  console.log("Result structure:", {
    jobId: result.jobId,
    dataKeys: Object.keys(result.data),
    textLength: result.data.text.length,
    confidence: result.data.confidence,
  });
  console.log("Extracted text:", JSON.stringify(result.data.text.trim()));

  const success = result.data.text.trim().length > 0;
  console.log(success ? "PASS: Text was extracted" : "FAIL: No text extracted");

  await worker.terminate();

  // Cleanup
  try { unlinkSync(testFile); } catch { /* ignore */ }

  console.log("=== Test complete ===");
  process.exit(success ? 0 : 1);
}

main().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
