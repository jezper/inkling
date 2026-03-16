import type { AnalysisResult } from "./analysis-types";

const sevColors: Record<string, { border: string; text: string; bg: string }> = {
  hög: { border: "#F0A8A0", text: "#8B1A0A", bg: "#FFF0EE" },
  medel: { border: "#E8C070", text: "#6B4000", bg: "#FFF8EE" },
  info: { border: "#90A8E0", text: "#1A2C5C", bg: "#EEF2FF" },
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Genererar komplett HTML-email med hela rapporten.
 * Inline styles — email-klienter stödjer inte externa CSS.
 */
export function buildReportEmail(result: AnalysisResult, reportUrl: string): string {
  const nivåLabel =
    result.helhetsbedömning?.nivå === "bra" ? "Ser bra ut"
    : result.helhetsbedömning?.nivå === "risk" ? "Värt att granska noga"
    : "Några saker att notera";

  const nivåColor =
    result.helhetsbedömning?.nivå === "bra" ? "#0A5020"
    : result.helhetsbedömning?.nivå === "risk" ? "#8B1A0A"
    : "#47474F";

  const nivåBg =
    result.helhetsbedömning?.nivå === "bra" ? "#EEFAF0"
    : result.helhetsbedömning?.nivå === "risk" ? "#FFF0EE"
    : "#F5F5F7";

  // Flaggor HTML
  const flagsHtml = result.flaggor.map((flag) => {
    const c = sevColors[flag.allvarlighet] ?? sevColors.info;
    const questionsHtml = flag.frågor_att_ställa?.length
      ? `<div style="margin-top:8px;padding:8px 12px;background:#F5F5F7;border-radius:3px;">
           <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#DC1E38;">Frågor att ställa</p>
           ${flag.frågor_att_ställa.map(q => `<p style="margin:2px 0;font-size:13px;color:#2C2C34;">• ${escapeHtml(q)}</p>`).join("")}
         </div>`
      : "";

    const comparisonHtml = (flag.avtalets_text || flag.lagens_krav)
      ? `<table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
           <tr>
             ${flag.avtalets_text ? `<td width="50%" valign="top" style="padding:8px;background:#F5F5F7;border-radius:3px;">
               <p style="margin:0 0 3px;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#47474F;">Avtalet säger</p>
               <p style="margin:0;font-size:13px;color:#0A0A0C;">${escapeHtml(flag.avtalets_text)}</p>
             </td>` : ""}
             ${flag.avtalets_text && flag.lagens_krav ? '<td width="8"></td>' : ""}
             ${flag.lagens_krav ? `<td width="50%" valign="top" style="padding:8px;background:#F5F5F7;border-radius:3px;">
               <p style="margin:0 0 3px;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#47474F;">Lagen anger</p>
               <p style="margin:0;font-size:13px;color:#0A0A0C;">${escapeHtml(flag.lagens_krav)}</p>
             </td>` : ""}
           </tr>
         </table>`
      : "";

    return `<tr><td style="padding:0 32px 12px;">
      <div style="padding:14px 16px;border-left:3px solid ${c.border};border-radius:4px;background:${c.bg};">
        <p style="margin:0 0 4px;font-size:11px;"><span style="font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:${c.text};">${escapeHtml(flag.allvarlighet)}</span> <span style="color:#47474F;">· ${escapeHtml(flag.kategori)}</span></p>
        <p style="margin:0 0 4px;font-size:15px;font-weight:600;color:#0A0A0C;">${escapeHtml(flag.titel)}</p>
        <p style="margin:0 0 6px;font-size:14px;color:#2C2C34;">${escapeHtml(flag.klartext)}</p>
        ${comparisonHtml}
        ${questionsHtml}
        <p style="margin:8px 0 0;font-size:11px;color:${c.text};">${escapeHtml(flag.lagrum)}</p>
      </div>
    </td></tr>`;
  }).join("");

  // Styrkor HTML
  const styrkorHtml = result.styrkor?.length
    ? `<tr><td style="padding:0 32px 8px;">
         <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#47474F;">Det här ser bra ut</p>
       </td></tr>
       ${result.styrkor.map(s => `<tr><td style="padding:0 32px 8px;">
         <div style="padding:10px 14px;border-left:3px solid #0A5020;border-radius:4px;background:#EEFAF0;">
           <p style="margin:0;font-size:14px;font-weight:600;color:#0A0A0C;">${escapeHtml(s.titel)}</p>
           <p style="margin:3px 0 0;font-size:13px;color:#2C2C34;">${escapeHtml(s.beskrivning)}</p>
         </div>
       </td></tr>`).join("")}
       <tr><td style="padding:0 0 16px;"></td></tr>`
    : "";

  // Marknadsjämförelse HTML
  const marketHtml = result.marknadsjämförelse?.length
    ? `<tr><td style="padding:0 32px 16px;">
         <p style="margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#47474F;">Ditt avtal vs marknaden</p>
         <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
           <tr style="border-bottom:1px solid #C8C8D0;">
             <th style="text-align:left;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#47474F;">Villkor</th>
             <th style="text-align:left;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#47474F;">Ditt avtal</th>
             <th style="text-align:left;font-size:10px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase;color:#47474F;">Marknad</th>
           </tr>
           ${result.marknadsjämförelse.map(mj => `<tr style="border-bottom:1px solid #EBEBEF;">
             <td style="font-size:13px;font-weight:600;color:#0A0A0C;">${escapeHtml(mj.villkor)}</td>
             <td style="font-size:13px;color:#0A0A0C;">${escapeHtml(mj.avtalets_värde)}</td>
             <td style="font-size:13px;color:#47474F;">${escapeHtml(mj.benchmark_värde)}</td>
           </tr>`).join("")}
         </table>
       </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#F5F5F7;font-family:'Inter',Helvetica,Arial,sans-serif;color:#2C2C34;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F7;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:6px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:24px 32px;border-bottom:2px solid #0A0A0C;">
          <span style="font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-0.3px;color:#0A0A0C;">
            <span style="font-weight:400;color:#47474F;">kolla</span><span style="font-weight:700;color:#DC1E38;">/</span><span style="font-weight:700;">avtalet</span>
          </span>
          <span style="float:right;font-size:12px;color:#47474F;">Avtalsrapport · ${new Date().toLocaleDateString("sv-SE")}</span>
        </td></tr>

        <!-- Helhetsbedömning -->
        <tr><td style="padding:32px 32px 16px;">
          <div style="padding:16px;border-radius:4px;background:${nivåBg};border:1px solid ${result.helhetsbedömning?.nivå === "bra" ? "#80C890" : result.helhetsbedömning?.nivå === "risk" ? "#F0A8A0" : "#C8C8D0"};">
            <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:${nivåColor};">${nivåLabel}</p>
            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#0A0A0C;">${escapeHtml(result.helhetsbedömning?.rubrik ?? "Analys klar")}</p>
            <p style="margin:0;font-size:14px;color:#47474F;">${escapeHtml(result.helhetsbedömning?.beskrivning ?? "")}</p>
          </div>
        </td></tr>

        <!-- Sammanfattning -->
        <tr><td style="padding:0 32px 24px;">
          <p style="margin:0;font-size:14px;color:#2C2C34;">${escapeHtml(result.sammanfattning)}</p>
        </td></tr>

        <!-- Styrkor -->
        ${styrkorHtml}

        <!-- Flaggor -->
        ${flagsHtml}

        <!-- Marknadsjämförelse -->
        ${marketHtml}

        <!-- Interaktiv rapport-länk -->
        <tr><td style="padding:16px 32px 32px;" align="center">
          <a href="${reportUrl}" style="display:inline-block;padding:14px 32px;background-color:#DC1E38;color:#FFFFFF;font-family:'Space Grotesk',Helvetica,sans-serif;font-size:16px;font-weight:600;text-decoration:none;border-radius:4px;">
            Interaktiv rapport
          </a>
          <p style="margin:8px 0 0;font-size:12px;color:#47474F;">Länken är giltig i 30 dagar.</p>
        </td></tr>

        <!-- Disclaimer -->
        <tr><td style="padding:24px 32px;border-top:1px solid #DDDDE3;">
          <p style="margin:0;font-size:11px;color:#47474F;line-height:1.6;">
            Det här är information, inte juridisk rådgivning. Analysen jämför mot LAS, Semesterlagen,
            Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen. Kollektivavtal ingår inte.
            Vid osäkerhet, kontakta ett fackförbund eller en arbetsrättsjurist.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
