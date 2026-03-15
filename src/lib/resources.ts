import type { AnalysisResult } from "./analysis-types";

export interface Resource {
  titel: string;
  beskrivning: string;
  url: string;
  källa: string;
  kategori: "lön" | "rättigheter" | "fackförbund" | "myndighet" | "guide";
}

const SALARY_RESOURCES: Resource[] = [
  {
    titel: "Lönestatistik per yrke",
    beskrivning:
      "Sök på din yrkestitel och se medianlön, percentiler och lönespridning.",
    url: "https://www.scb.se/hitta-statistik/sverige-i-siffror/lonesok/",
    källa: "SCB",
    kategori: "lön",
  },
  {
    titel: "Lönestatistik per avtal",
    beskrivning:
      "Detaljerad statistik uppdelad på avtalsområde, sektor och kön.",
    url: "https://www.mi.se/lonestatistik/",
    källa: "Medlingsinstitutet",
    kategori: "lön",
  },
];

const UNION_MAP: Record<string, Resource> = {
  tjänsteman: {
    titel: "Unionen — lönerådgivning",
    beskrivning:
      "Störst för tjänstemän i privat sektor. Erbjuder individuell lönerådgivning för medlemmar.",
    url: "https://www.unionen.se/lon-och-villkor",
    källa: "Unionen",
    kategori: "fackförbund",
  },
  tekniker: {
    titel: "Sveriges Ingenjörer — lönestatistik",
    beskrivning:
      "Lönestatistik och rådgivning specifikt för ingenjörer och tekniker.",
    url: "https://www.sverigesingenjorer.se/lon/",
    källa: "Sveriges Ingenjörer",
    kategori: "fackförbund",
  },
  ledare: {
    titel: "Ledarna — chefsavtal",
    beskrivning:
      "Rådgivning kring chefsavtal, bonus och förmåner för ledare.",
    url: "https://www.ledarna.se/stod-i-chefsrollen/lon/",
    källa: "Ledarna",
    kategori: "fackförbund",
  },
};

const RIGHTS_RESOURCES: Resource[] = [
  {
    titel: "Arbetsvillkor och rättigheter",
    beskrivning:
      "Översikt av regler kring arbetstid, semester, uppsägning och diskriminering.",
    url: "https://www.av.se/arbetsmiljoarbete-och-inspektioner/",
    källa: "Arbetsmiljöverket",
    kategori: "myndighet",
  },
  {
    titel: "Diskrimineringsombudsmannen",
    beskrivning:
      "Om du misstänker att villkor i avtalet kan vara diskriminerande.",
    url: "https://www.do.se/",
    källa: "DO",
    kategori: "myndighet",
  },
];

const COMPETITION_RESOURCE: Resource = {
  titel: "Konkurrensklausuler — vad gäller?",
  beskrivning:
    "Vägledning om hur konkurrensklausuler bedöms i svensk rätt.",
  url: "https://www.unionen.se/rad-och-stod/konkurrensklausul",
  källa: "Unionen",
  kategori: "guide",
};

const PROBATION_RESOURCE: Resource = {
  titel: "Provanställning — dina rättigheter",
  beskrivning:
    "Vad som gäller under provanställning, uppsägning och övergång till fast tjänst.",
  url: "https://www.unionen.se/rad-och-stod/provanstallning",
  källa: "Unionen",
  kategori: "guide",
};

/**
 * Väljer relevanta resurser baserat på analysresultatet.
 * Helt hårdkodat — inga LLM-genererade URLs.
 */
export function getRelevantResources(result: AnalysisResult): Resource[] {
  const resources: Resource[] = [];

  // Alltid: lönestatistik
  resources.push(...SALARY_RESOURCES);

  // Fackförbund baserat på kategori
  const kategori = result.anstallningskategori?.toLowerCase();
  if (kategori && UNION_MAP[kategori]) {
    resources.push(UNION_MAP[kategori]);
  } else {
    // Default till Unionen om kategorin är oklar
    resources.push(UNION_MAP.tjänsteman);
  }

  // Kontextuella resurser baserat på flaggor
  const hasCompetition = result.flaggor.some(
    (f) => f.kategori === "konkurrensklausul",
  );
  if (hasCompetition) {
    resources.push(COMPETITION_RESOURCE);
  }

  const hasProbation =
    result.anstallningsform === "provanstallning" ||
    result.flaggor.some((f) => f.kategori === "provanställning");
  if (hasProbation) {
    resources.push(PROBATION_RESOURCE);
  }

  // Myndigheter — alltid relevanta
  resources.push(...RIGHTS_RESOURCES);

  return resources;
}
