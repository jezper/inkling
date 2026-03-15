/**
 * SCB Lönestrukturstatistik API.
 * Hämtar medianlön och percentiler per yrke (SSYK-kod).
 * Källa: SCB, CC BY 4.0. Kräver attribution: "Källa: SCB"
 *
 * API-dokumentation: https://www.scb.se/vara-tjanster/oppna-data/api-for-statistikdatabasen/
 */

const SCB_BASE = "https://api.scb.se/OV0104/v1/doris/sv/ssd/START/AM/AM0110/AM0110A";
const TABLE = "LonesacYrkGr4";

export interface SalaryData {
  ssyk: string;
  yrkesnamn: string;
  median: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
  antal: number;
  år: string;
  källa: string;
}

// In-memory cache — lönedata uppdateras årligen
const cache = new Map<string, { data: SalaryData | null; ts: number }>();
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 dagar

/**
 * Hämta lönedata för en SSYK-kod (4-siffrig).
 * Returnerar null om koden inte finns eller om API:et inte svarar.
 */
export async function getSalaryBySSYK(ssykCode: string): Promise<SalaryData | null> {
  const cacheKey = ssykCode;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Hämta tillgängliga år först (vi vill det senaste)
    const metaRes = await fetch(`${SCB_BASE}/${TABLE}`, { next: { revalidate: 86400 } });
    if (!metaRes.ok) return null;
    const meta = await metaRes.json();

    // Hitta tidsvariabel och senaste år
    const timeVar = meta.variables?.find(
      (v: { code: string }) => v.code === "Tid" || v.code === "År",
    );
    const latestYear = timeVar?.values?.[timeVar.values.length - 1] ?? "2023";

    // Query: specifik SSYK-kod, senaste år, alla lönemått
    const query = {
      query: [
        {
          code: "SSYK2012v2",
          selection: { filter: "item", values: [ssykCode] },
        },
        {
          code: "Tid",
          selection: { filter: "item", values: [latestYear] },
        },
      ],
      response: { format: "json" },
    };

    const dataRes = await fetch(`${SCB_BASE}/${TABLE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query),
    });

    if (!dataRes.ok) {
      cache.set(cacheKey, { data: null, ts: Date.now() });
      return null;
    }

    const result = await dataRes.json();

    if (!result.data || result.data.length === 0) {
      cache.set(cacheKey, { data: null, ts: Date.now() });
      return null;
    }

    // Parsa SCB:s responsformat
    // data[].key = [ssyk, kön, sektor, år], data[].values = [antal, medel, p10, p25, median, p75, p90]
    // Vi tar "samtliga" kön och sektor om tillgängligt
    const row = result.data[0];
    const vals = row.values.map((v: string) =>
      v === ".." ? 0 : parseInt(v, 10),
    );

    // Hämta yrkesnamn från metadata
    const ssykVar = meta.variables?.find(
      (v: { code: string }) => v.code === "SSYK2012v2",
    );
    const ssykIdx = ssykVar?.values?.indexOf(ssykCode) ?? -1;
    const yrkesnamn =
      ssykIdx >= 0
        ? ssykVar?.valueTexts?.[ssykIdx] ?? ssykCode
        : ssykCode;

    const salary: SalaryData = {
      ssyk: ssykCode,
      yrkesnamn,
      antal: vals[0] || 0,
      median: vals[4] || vals[1] || 0, // median om tillgänglig, annars medelvärde
      p10: vals[2] || 0,
      p25: vals[3] || 0,
      p75: vals[5] || 0,
      p90: vals[6] || 0,
      år: latestYear,
      källa: "SCB Lönestrukturstatistik",
    };

    cache.set(cacheKey, { data: salary, ts: Date.now() });
    return salary;
  } catch {
    cache.set(cacheKey, { data: null, ts: Date.now() });
    return null;
  }
}

/**
 * Formatera lönedata för systemprompt.
 */
export function formatSalaryForPrompt(salary: SalaryData): string {
  return [
    `Lönestatistik för ${salary.yrkesnamn} (SSYK ${salary.ssyk}), ${salary.år}:`,
    `  Median: ${salary.median.toLocaleString("sv-SE")} kr/mån`,
    `  10:e percentil: ${salary.p10.toLocaleString("sv-SE")} kr/mån`,
    `  25:e percentil: ${salary.p25.toLocaleString("sv-SE")} kr/mån`,
    `  75:e percentil: ${salary.p75.toLocaleString("sv-SE")} kr/mån`,
    `  90:e percentil: ${salary.p90.toLocaleString("sv-SE")} kr/mån`,
    `  Antal i yrkesgruppen: ${salary.antal.toLocaleString("sv-SE")}`,
    `  Källa: ${salary.källa}`,
  ].join("\n");
}
