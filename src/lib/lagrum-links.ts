/**
 * Mappar lagrumsreferenser till URL:er på riksdagen.se och relevanta sidor.
 * Riksdagen publicerar alla svenska lagar på riksdagen.se/sv/dokument-lagar/
 */

const LAW_URLS: Record<string, string> = {
  // LAS — Lagen om anställningsskydd
  "1982:80": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-198280-om-anstallningsskydd_sfs-1982-80/",
  // Semesterlagen
  "1977:480": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/semesterlag-1977480_sfs-1977-480/",
  // Arbetstidslagen
  "1982:673": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/arbetstidslag-1982673_sfs-1982-673/",
  // Diskrimineringslagen
  "2008:567": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/diskrimineringslag-2008567_sfs-2008-567/",
  // Föräldraledighetslagen
  "1995:584": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/foraldraledighetslag-1995584_sfs-1995-584/",
  // Avtalslagen
  "1915:218": "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/",
};

const LAW_ALIASES: Record<string, string> = {
  las: "1982:80",
  "lagen om anställningsskydd": "1982:80",
  semesterlagen: "1977:480",
  arbetstidslagen: "1982:673",
  diskrimineringslagen: "2008:567",
  föräldraledighetslagen: "1995:584",
  avtalslagen: "1915:218",
  avtalsl: "1915:218",
  avtl: "1915:218",
};

export interface LagrumLink {
  text: string;
  url: string | null;
}

/**
 * Parsar en lagrumsreferens och returnerar text + URL.
 * Exempel: "LAS §11" → { text: "LAS §11", url: "https://riksdagen.se/..." }
 */
export function parseLagrum(lagrum: string): LagrumLink[] {
  if (!lagrum) return [];

  // Hitta alla laghänvisningar i strängen
  const results: LagrumLink[] = [];
  const parts = lagrum.split(/[,;]/).map((s) => s.trim()).filter(Boolean);

  for (const part of parts) {
    const url = findLawUrl(part);
    results.push({ text: part, url });
  }

  // Om inga delar hittades, returnera hela strängen
  if (results.length === 0) {
    results.push({ text: lagrum, url: findLawUrl(lagrum) });
  }

  return results;
}

function findLawUrl(text: string): string | null {
  const lower = text.toLowerCase().trim();

  // Direkt SFS-nummer: "SFS 1982:80" eller "1982:80"
  const sfsMatch = lower.match(/(\d{4}:\d+)/);
  if (sfsMatch && LAW_URLS[sfsMatch[1]]) {
    return LAW_URLS[sfsMatch[1]];
  }

  // Lagnamn: "LAS", "Semesterlagen", etc
  for (const [alias, sfs] of Object.entries(LAW_ALIASES)) {
    if (lower.includes(alias)) {
      return LAW_URLS[sfs] ?? null;
    }
  }

  return null;
}
