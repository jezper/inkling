interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const VALID_ALLVARLIGHET = ["hög", "medel", "info"];

export function validateAnalysisResult(data: unknown): ValidationResult {
  const errors: string[] = [];
  const d = data as Record<string, unknown>;

  if (!d || typeof d !== "object") {
    return { valid: false, errors: ["data must be an object"] };
  }

  if (!Array.isArray(d.flaggor)) {
    errors.push("flaggor is required and must be an array");
  } else {
    for (let i = 0; i < d.flaggor.length; i++) {
      const f = d.flaggor[i] as Record<string, unknown>;
      if (!f.klartext || typeof f.klartext !== "string" || f.klartext.trim() === "") {
        errors.push(`flaggor[${i}]: klartext must be non-empty`);
      }
      if (!f.lagrum || typeof f.lagrum !== "string" || f.lagrum.trim() === "") {
        errors.push(`flaggor[${i}]: lagrum must be non-empty`);
      }
      if (f.klartext && f.beskrivning && f.klartext === f.beskrivning) {
        errors.push(`flaggor[${i}]: klartext must not be identical to beskrivning`);
      }
      if (typeof f.allvarlighet === "string" && !VALID_ALLVARLIGHET.includes(f.allvarlighet)) {
        errors.push(`flaggor[${i}]: invalid allvarlighet "${f.allvarlighet}"`);
      }
    }
  }

  if (Array.isArray(d.saknade_villkor)) {
    for (let i = 0; i < d.saknade_villkor.length; i++) {
      const sv = d.saknade_villkor[i] as Record<string, unknown>;
      if (typeof sv.allvarlighet === "string" && !VALID_ALLVARLIGHET.includes(sv.allvarlighet)) {
        errors.push(`saknade_villkor[${i}]: invalid allvarlighet "${sv.allvarlighet}"`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
