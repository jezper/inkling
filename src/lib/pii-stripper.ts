/**
 * pii-stripper.ts
 * Strippar personuppgifter (PII) från avtalstext client-side.
 * Bearbetning sker INNAN text skickas till server — aldrig efter.
 *
 * Processordning (per pii-patterns.md):
 * 1. E-post
 * 2. Personnummer
 * 3. Kontonummer
 * 4. Telefonnummer
 * 5. Adress (gatuadress)
 * 6. Postnummer
 * 7. Namn-heuristik (arbetsrättskontexter)
 * 8. Långa oisolerade siffersträngar
 */

export interface StripResult {
  strippedText: string;
  piiCount: number;
  piiTypes: string[];
}

// -------------------------------------------------------------------
// Mönsterdefinitioner
// -------------------------------------------------------------------

interface PiiPattern {
  label: string;
  /** Visningsnamn på svenska */
  displayName: string;
  regex: RegExp;
  replacement: string;
  /** Valfri replace-funktion — används när regex ensam inte räcker (t.ex. capture groups) */
  replaceFn?: (match: string, ...groups: string[]) => string;
}

const PATTERNS: PiiPattern[] = [
  // 1. E-postadresser
  {
    label: "email",
    displayName: "e-postadress",
    regex: /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g,
    replacement: "[EMAIL]",
  },

  // 2. Personnummer — format: YYYYMMDD-XXXX eller YYMMDD-XXXX (med/utan bindestreck)
  {
    label: "personnummer",
    displayName: "personnummer",
    regex:
      /\b(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-\s]?\d{4}\b|\b\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[-\+]\d{4}\b/g,
    replacement: "[PERSONNUMMER]",
  },

  // 3. Svenska bankkontonummer (clearingnr + kontonr)
  // Format: NNNN-XXXXXXX eller NNNN XXXXXXX (4 siffror clearing + 7-10 siffror)
  {
    label: "kontonummer",
    displayName: "kontonummer",
    regex: /\b\d{4}[-\s]\d{7,10}\b/g,
    replacement: "[KONTONUMMER]",
  },

  // 4. Telefonnummer — svenska format
  // +46 70-123 45 67, 070-123 45 67, 070 123 45 67, 0701234567
  {
    label: "telefon",
    displayName: "telefonnummer",
    regex:
      /(?:\+46|0046)?[-\s]?(?:7[02369]|10|11|1[3-9]|[2-9]\d)[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}\b/g,
    replacement: "[TELEFON]",
  },

  // 5. Gatuadresser — "Storgatan 12", "Kungsgatan 3A", "Vasavägen 14 B"
  {
    label: "adress",
    displayName: "adress",
    regex:
      /\b[A-ZÅÄÖ][a-zåäö]+(gatan|vägen|gränd|allén|torget|platsen|stigen|leden|backen|brinken|väg|gata|v\.)\s+\d+\s*[A-Za-z]?\b/g,
    replacement: "[ADRESS]",
  },

  // 6. Postnummer — 5 siffror, eventuellt med mellanslag efter 3 (123 45)
  {
    label: "postnummer",
    displayName: "postnummer",
    regex: /\b\d{3}\s?\d{2}\b/g,
    replacement: "[POSTNUMMER]",
  },

  // 7a. Namn-heuristik — Part A (arbetstagare)
  // Använder capture groups i stället för lookbehind (Safari < 16.4-kompatibelt).
  // Matchar: "arbetstagare: Anna Svensson" → "arbetstagare: [PART A]"
  {
    label: "part_a",
    displayName: "namn (part A)",
    regex:
      /((?:arbetstagare|anställd|medarbetare|den anställde)\s*:\s*)([A-ZÅÄÖ][a-zåäö]+(?:\s+[A-ZÅÄÖ][a-zåäö]+){1,3})/gi,
    replacement: "[PART A]",
    replaceFn: (_, prefix: string) => `${prefix}[PART A]`,
  },

  // 7b. Namn-heuristik — Part B (arbetsgivare)
  {
    label: "part_b",
    displayName: "namn (part B)",
    regex:
      /((?:arbetsgivare|företaget|bolaget|arbetsgivaren)\s*:\s*)([A-ZÅÄÖ][A-Za-zåäö\s&.,-]{2,50}(?:AB|HB|KB|Aktiebolag)?)/gi,
    replacement: "[PART B]",
    replaceFn: (_, prefix: string) => `${prefix}[PART B]`,
  },

  // 8. Långa isolerade siffersträngar (>9 siffror) som kan vara personnr/kontonr
  // som inte fångats av tidigare regler
  {
    label: "lang_siffra",
    displayName: "okänt nummer",
    regex: /\b\d{10,}\b/g,
    replacement: "[BORTTAGET]",
  },
];

// -------------------------------------------------------------------
// Huvud-funktion
// -------------------------------------------------------------------

/**
 * Strippar PII från avtalstext.
 * Returnerar anonymiserad text + räkning och typer av borttagna uppgifter.
 */
export function stripPii(text: string): StripResult {
  let result = text;
  let totalCount = 0;
  const foundTypes: string[] = [];

  for (const pattern of PATTERNS) {
    // Räkna träffar med ett nytt regex-objekt (undvik lastIndex-problem med /g)
    const countRegex = new RegExp(pattern.regex.source, pattern.regex.flags);
    const matches = result.match(countRegex);
    if (matches && matches.length > 0) {
      totalCount += matches.length;
      if (!foundTypes.includes(pattern.displayName)) {
        foundTypes.push(pattern.displayName);
      }
    }

    // Återställ regex lastIndex innan replace
    pattern.regex.lastIndex = 0;

    if (pattern.replaceFn) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- replaceFn har variabelt antal capture groups
      result = result.replace(pattern.regex, pattern.replaceFn as any);
    } else {
      result = result.replace(pattern.regex, pattern.replacement);
    }
  }

  return {
    strippedText: result,
    piiCount: totalCount,
    piiTypes: foundTypes,
  };
}
