import { describe, it, expect } from "vitest";
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
