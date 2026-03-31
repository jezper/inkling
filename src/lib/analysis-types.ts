export interface Flagga {
  allvarlighet: "hög" | "medel" | "info";
  kategori: string;
  titel: string;
  beskrivning: string;
  klartext: string;
  lagrum: string;
  avtalets_text: string;
  lagens_krav: string;
  benchmark_avvikelse: boolean | null;
  frågor_att_ställa?: string[];
}

export interface SaknatVillkor {
  villkor: string;
  allvarlighet: "hög" | "medel" | "info";
  relevans: string;
  referens: string;
}

export interface Marknadsjämförelse {
  villkor: string;
  avtalets_värde: string;
  benchmark_värde: string;
  benchmark_källa: string;
  benchmark_kategori: string;
  formulering: string;
}

export interface Helhetsbedömning {
  nivå: "bra" | "godkänt" | "risk";
  rubrik: string;
  beskrivning: string;
}

export interface Styrka {
  titel: string;
  beskrivning: string;
}

export interface NästaSteg {
  titel: string;
  beskrivning: string;
  typ: "fråga" | "kontrollera" | "spara";
}

export interface AnalysisResult {
  anstallningsform: string;
  anstallningskategori: string;
  tillämplig_lag: string;
  sammanfattning: string;
  helhetsbedömning: Helhetsbedömning;
  löneanalys: {
    angiven_lön: string | null;
    valuta: string;
    period: string;
    kommentar: string;
  };
  flaggor: Flagga[];
  styrkor: Styrka[];
  nästa_steg: NästaSteg[];
  saknade_villkor: SaknatVillkor[];
  marknadsjämförelse: Marknadsjämförelse[];
}
