// src/lib/email-template.ts

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

interface ReceiptEmailOpts {
  reportUrl: string;
  sessionId: string;
  date: string; // YYYY-MM-DD
}

/**
 * Generates a minimal receipt email with brand header.
 * The analysis report is attached as PDF — not included in email body.
 */
export function buildReceiptEmail(opts: ReceiptEmailOpts): string {
  const orgNr = process.env.BUSINESS_ORG_NR ?? "[org.nr saknas]";

  return `<!DOCTYPE html>
<html lang="sv">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#F5F5F7;font-family:Helvetica,Arial,sans-serif;color:#2C2C34;line-height:1.6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F5F7;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:6px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:24px 32px;border-bottom:2px solid #DC1E38;">
          <span style="font-family:'Space Grotesk',Helvetica,Arial,sans-serif;font-size:16px;letter-spacing:-0.3px;color:#0A0A0C;">
            <span style="font-weight:400;color:#47474F;">kolla</span><span style="font-weight:700;color:#DC1E38;">/</span><span style="font-weight:700;">avtalet</span>
          </span>
        </td></tr>

        <!-- Body text -->
        <tr><td style="padding:32px 32px 24px;">
          <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0A0A0C;">Tack för din beställning.</p>
          <p style="margin:0 0 12px;font-size:14px;color:#2C2C34;">Din avtalsrapport finns bifogad som PDF.</p>
          <p style="margin:0 0 4px;font-size:14px;color:#2C2C34;">
            Du kan även se en interaktiv version här:
            <a href="${escapeHtml(opts.reportUrl)}" style="color:#DC1E38;text-decoration:underline;">${escapeHtml(opts.reportUrl)}</a>
          </p>
          <p style="margin:0;font-size:12px;color:#47474F;">Länken är giltig i 30 dagar. Vi lagrar ingen data från din analys efter denna period.</p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Receipt -->
        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#47474F;">Kvitto</p>
          <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#2C2C34;">
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Datum</td><td>${escapeHtml(opts.date)}</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Kvittonummer</td><td style="font-family:monospace;font-size:12px;">${escapeHtml(opts.sessionId)}</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Tjänst</td><td>Avtalsanalys</td></tr>
            <tr><td colspan="2" style="padding:8px 0 0;"></td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Belopp exkl. moms</td><td>39,20 kr</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Moms (25%)</td><td>9,80 kr</td></tr>
            <tr><td style="padding:2px 24px 2px 0;font-weight:600;color:#0A0A0C;">Totalt</td><td style="font-weight:600;color:#0A0A0C;">49,00 kr</td></tr>
          </table>

          <div style="margin-top:16px;padding-top:12px;border-top:1px solid #EBEBEF;font-size:12px;color:#47474F;">
            <p style="margin:0;font-weight:600;color:#2C2C34;">Säljare</p>
            <p style="margin:2px 0 0;">Jezper Lorné</p>
            <p style="margin:2px 0 0;">Gamla Kilandavägen 9, 44930 Nödinge, Sweden</p>
            <p style="margin:2px 0 0;">Org.nr: ${escapeHtml(orgNr)}</p>
            <p style="margin:2px 0 0;">Momsreg.nr: SE800827491501</p>
          </div>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Disclaimer -->
        <tr><td style="padding:20px 32px;">
          <p style="margin:0;font-size:11px;color:#47474F;line-height:1.5;">
            Det här är information, inte juridisk rådgivning. Analysen jämför mot LAS, Semesterlagen,
            Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen. Kollektivavtal ingår inte.
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#A8A8B4;">
            Detta mejl skickades av Kolla Avtalet. Svara inte på detta mejl.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
