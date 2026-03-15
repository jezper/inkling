/**
 * JobTech Taxonomy API (Arbetsförmedlingen).
 * Mappar yrkesnamn till SSYK-koder för att koppla mot SCB lönedata.
 * Källa: JobTech Dev, CC0. Ingen attribution krävs.
 *
 * API-dokumentation: https://jobtechdev.se/
 */

const TAXONOMY_BASE = "https://taxonomy.api.jobtechdev.se/v1";

export interface OccupationMatch {
  ssyk: string;
  namn: string;
  confidence: number;
}

// Cache — yrkestaxonomin ändras sällan
const cache = new Map<string, { data: OccupationMatch | null; ts: number }>();
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 dagar

/**
 * Sök efter en yrkestitel och returnera bästa SSYK-matchning.
 * Returnerar null om ingen match hittas.
 */
export async function findSSYKCode(
  jobTitle: string,
): Promise<OccupationMatch | null> {
  const normalized = jobTitle.trim().toLowerCase();
  if (!normalized) return null;

  const cached = cache.get(normalized);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data;
  }

  try {
    // Taxonomy API: sök efter yrke
    const res = await fetch(
      `${TAXONOMY_BASE}/taxonomy/search?offset=0&limit=5&q=${encodeURIComponent(normalized)}&type=ssyk-level-4&show-count=false`,
      {
        headers: { Accept: "application/json" },
      },
    );

    if (!res.ok) {
      cache.set(normalized, { data: null, ts: Date.now() });
      return null;
    }

    const data = await res.json();

    // Taxonomy API returnerar en lista med träffar
    const results = data.result ?? data ?? [];
    if (!Array.isArray(results) || results.length === 0) {
      // Fallback: prova concept-sök
      return await fallbackSearch(normalized);
    }

    const best = results[0];
    const match: OccupationMatch = {
      ssyk: best["ssyk-code-2012"] ?? best.id ?? "",
      namn: best["preferred-label"] ?? best.label ?? best.name ?? normalized,
      confidence: 1 / (results.length || 1), // grov heuristik
    };

    cache.set(normalized, { data: match, ts: Date.now() });
    return match;
  } catch {
    // Fallback-sök vid nätverksfel
    return await fallbackSearch(normalized);
  }
}

/**
 * Fallback: prova enklare sök via concept-endpoint.
 */
async function fallbackSearch(
  query: string,
): Promise<OccupationMatch | null> {
  try {
    const res = await fetch(
      `${TAXONOMY_BASE}/concepts?type=ssyk-level-4&q=${encodeURIComponent(query)}&limit=3`,
      { headers: { Accept: "application/json" } },
    );

    if (!res.ok) {
      cache.set(query, { data: null, ts: Date.now() });
      return null;
    }

    const results = await res.json();
    if (!Array.isArray(results) || results.length === 0) {
      cache.set(query, { data: null, ts: Date.now() });
      return null;
    }

    const best = results[0];
    const match: OccupationMatch = {
      ssyk: best["ssyk-code-2012"] ?? best.id ?? "",
      namn: best["preferred-label"] ?? best.label ?? query,
      confidence: 0.5,
    };

    cache.set(query, { data: match, ts: Date.now() });
    return match;
  } catch {
    cache.set(query, { data: null, ts: Date.now() });
    return null;
  }
}

/**
 * Vanliga SSYK-koder som fallback om API:et inte svarar.
 * Täcker de vanligaste yrkena bland målgruppen.
 */
export const COMMON_SSYK: Record<string, string> = {
  systemutvecklare: "2512",
  mjukvaruutvecklare: "2512",
  webbutvecklare: "2512",
  programmerare: "2512",
  systemadministratör: "3511",
  "it-konsult": "2511",
  projektledare: "2421",
  produktchef: "2421",
  marknadsförare: "2431",
  ekonom: "2411",
  redovisningsekonom: "2411",
  controller: "2411",
  revisor: "2411",
  civilingenjör: "2141",
  maskiningenjör: "2144",
  byggnadsingenjör: "2142",
  säljare: "3322",
  "key account manager": "3322",
  kundansvarig: "3322",
  hr: "2423",
  personalvetare: "2423",
  jurist: "2611",
  advokat: "2611",
  designer: "2166",
  ux: "2166",
  "grafisk formgivare": "2166",
};

/**
 * Försök hitta SSYK-kod — API först, fallback till vanliga yrken.
 */
export async function resolveSSYK(
  jobTitle: string,
): Promise<OccupationMatch | null> {
  // Prova API först
  const apiResult = await findSSYKCode(jobTitle);
  if (apiResult && apiResult.ssyk) return apiResult;

  // Fallback: matcha mot vanliga yrken
  const normalized = jobTitle.trim().toLowerCase();
  for (const [key, ssyk] of Object.entries(COMMON_SSYK)) {
    if (normalized.includes(key)) {
      return { ssyk, namn: jobTitle, confidence: 0.3 };
    }
  }

  return null;
}
