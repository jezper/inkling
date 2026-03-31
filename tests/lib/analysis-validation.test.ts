import { describe, it, expect } from "vitest";
import { validateAnalysisResult } from "@/lib/analysis-validation";

const validResult = {
  anstallningsform: "fast",
  anstallningskategori: "tjänsteman",
  tillämplig_lag: "LAS",
  sammanfattning: "Avtalet ser standard ut.",
  helhetsbedömning: { nivå: "bra", rubrik: "Bra avtal", beskrivning: "Allt ok." },
  löneanalys: { angiven_lön: "35000", valuta: "SEK", period: "månad", kommentar: "Standard" },
  flaggor: [
    {
      allvarlighet: "hög",
      kategori: "uppsägningstid",
      titel: "Kort uppsägningstid",
      beskrivning: "Uppsägningstid 1 mån.",
      klartext: "I praktiken innebär detta att du har kort uppsägningstid.",
      lagrum: "LAS §11",
      avtalets_text: "1 månad",
      lagens_krav: "1-6 månader beroende på anställningstid",
      benchmark_avvikelse: false,
    },
  ],
  styrkor: [{ titel: "Tydlig lön", beskrivning: "Lönen anges tydligt." }],
  nästa_steg: [{ titel: "Fråga om övertid", beskrivning: "Be om klargörande.", typ: "fråga" }],
  saknade_villkor: [
    { villkor: "Övertidsersättning", allvarlighet: "medel", relevans: "Standardvillkor.", referens: "Arbetstidslagen" },
  ],
  marknadsjämförelse: [],
};

describe("validateAnalysisResult", () => {
  it("accepts a valid result", () => {
    expect(validateAnalysisResult(validResult)).toEqual({ valid: true, errors: [] });
  });

  it("rejects null input", () => {
    const { valid } = validateAnalysisResult(null);
    expect(valid).toBe(false);
  });

  it("rejects missing flaggor", () => {
    const { valid, errors } = validateAnalysisResult({ ...validResult, flaggor: undefined });
    expect(valid).toBe(false);
    expect(errors).toContain("flaggor is required and must be an array");
  });

  it("rejects flagga with empty klartext", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], klartext: "" }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("klartext");
  });

  it("rejects flagga with empty lagrum", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], lagrum: "" }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("lagrum");
  });

  it("rejects klartext identical to beskrivning", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], klartext: validResult.flaggor[0].beskrivning }],
    };
    const { valid, errors } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
    expect(errors[0]).toContain("identical");
  });

  it("rejects invalid allvarlighet value in flaggor", () => {
    const bad = {
      ...validResult,
      flaggor: [{ ...validResult.flaggor[0], allvarlighet: "kritisk" }],
    };
    const { valid } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
  });

  it("rejects invalid allvarlighet in saknade_villkor", () => {
    const bad = {
      ...validResult,
      saknade_villkor: [{ ...validResult.saknade_villkor[0], allvarlighet: "låg" }],
    };
    const { valid } = validateAnalysisResult(bad);
    expect(valid).toBe(false);
  });

  it("accepts result with empty flaggor array", () => {
    const { valid } = validateAnalysisResult({ ...validResult, flaggor: [] });
    expect(valid).toBe(true);
  });

  it("accepts result without saknade_villkor", () => {
    const { valid } = validateAnalysisResult({ ...validResult, saknade_villkor: undefined });
    expect(valid).toBe(true);
  });
});
