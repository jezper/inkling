/**
 * Hårdkodade benchmarks för svenska anställningsavtal.
 * V1: Baserade på publika källor (Medlingsinstitutet, SCB, Unionen).
 * Ska ersättas med dynamiska data i V2.
 */

export interface Benchmark {
  villkor: string;
  kategori: string;
  värde: string;
  källa: string;
}

export const benchmarks: Record<string, Benchmark[]> = {
  tjänsteman: [
    {
      villkor: "Uppsägningstid (arbetsgivare, <2 år)",
      kategori: "tjänsteman",
      värde: "1–3 månader",
      källa: "Medlingsinstitutets avtalsstatistik 2024",
    },
    {
      villkor: "Uppsägningstid (arbetsgivare, 2–5 år)",
      kategori: "tjänsteman",
      värde: "3 månader",
      källa: "Medlingsinstitutets avtalsstatistik 2024",
    },
    {
      villkor: "Semester",
      kategori: "tjänsteman",
      värde: "25–30 dagar",
      källa: "Unionens lönestatistik 2024",
    },
    {
      villkor: "Provanställning",
      kategori: "tjänsteman",
      värde: "6 månader",
      källa: "Medlingsinstitutets avtalsstatistik 2024",
    },
    {
      villkor: "Konkurrensklausul",
      kategori: "tjänsteman",
      värde: "9–12 månader med kompensation om 60 %",
      källa: "Svenskt Näringslivs och PTK:s avtal om konkurrensklausuler 2015",
    },
    {
      villkor: "Övertidsersättning",
      kategori: "tjänsteman",
      värde: "Kvalificerad övertid +50–100 %",
      källa: "Unionens kollektivavtalsguide 2024",
    },
  ],
  tekniker: [
    {
      villkor: "Uppsägningstid (arbetsgivare, <2 år)",
      kategori: "tekniker",
      värde: "1–2 månader",
      källa: "Sveriges Ingenjörers avtalsstatistik 2024",
    },
    {
      villkor: "Semester",
      kategori: "tekniker",
      värde: "25–28 dagar",
      källa: "Sveriges Ingenjörers avtalsstatistik 2024",
    },
    {
      villkor: "Konkurrensklausul",
      kategori: "tekniker",
      värde: "9–18 månader med kompensation",
      källa: "Svenskt Näringslivs och PTK:s avtal om konkurrensklausuler 2015",
    },
  ],
  ledare: [
    {
      villkor: "Uppsägningstid (arbetsgivare)",
      kategori: "ledare",
      värde: "3–6 månader",
      källa: "Ledarnas avtalsstatistik 2024",
    },
    {
      villkor: "Semester",
      kategori: "ledare",
      värde: "28–32 dagar",
      källa: "Ledarnas avtalsstatistik 2024",
    },
    {
      villkor: "Konkurrensklausul",
      kategori: "ledare",
      värde: "12–18 månader med kompensation om 60 %",
      källa: "Svenskt Näringslivs och PTK:s avtal om konkurrensklausuler 2015",
    },
  ],
};

export function getBenchmarksForCategory(kategori: string): Benchmark[] {
  return benchmarks[kategori] ?? [];
}

export function formatBenchmarksForPrompt(kategori: string): string {
  const items = getBenchmarksForCategory(kategori);
  if (items.length === 0) return "";

  return items
    .map(
      (b) =>
        `- ${b.villkor}: ${b.värde} (källa: ${b.källa})`
    )
    .join("\n");
}
