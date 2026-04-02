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
 * Mobile-friendly with 16px+ body text and a CTA button.
 * The analysis report is attached as PDF — not included in email body.
 */
export function buildReceiptEmail(opts: ReceiptEmailOpts): string {
  const orgNr = process.env.BUSINESS_ORG_NR ?? "[org.nr saknas]";
  const vatNr = process.env.BUSINESS_VAT_NR ?? "SE800827491501";

  return `<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kvitto — Kolla Avtalet</title>
</head>
<body style="margin:0;padding:0;background-color:#F5F5F7;font-family:Helvetica,Arial,sans-serif;color:#2C2C34;line-height:1.6;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#F5F5F7;padding:24px 12px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:540px;background-color:#FFFFFF;border-radius:8px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="padding:20px 24px;border-bottom:2px solid #DC1E38;">
          <span style="font-family:Helvetica,Arial,sans-serif;font-size:18px;letter-spacing:-0.3px;color:#0A0A0C;">
            <span style="font-weight:400;color:#47474F;">kolla</span><span style="font-weight:700;color:#DC1E38;">/</span><span style="font-weight:700;">avtalet</span>
          </span>
        </td></tr>

        <!-- Body text -->
        <tr><td style="padding:28px 24px 20px;">
          <p style="margin:0 0 16px;font-size:20px;font-weight:600;color:#0A0A0C;line-height:1.3;">Tack f\u00f6r din best\u00e4llning.</p>
          <p style="margin:0 0 20px;font-size:16px;color:#2C2C34;line-height:1.6;">Din avtalsrapport finns bifogad som PDF. Du kan \u00e4ven se en interaktiv version via knappen nedan.</p>
        </td></tr>

        <!-- CTA Button -->
        <tr><td style="padding:0 24px 8px;" align="center">
          <table cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="background-color:#DC1E38;border-radius:6px;">
                <a href="${escapeHtml(opts.reportUrl)}" style="display:inline-block;padding:14px 32px;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:600;color:#FFFFFF;text-decoration:none;border-radius:6px;">
                  \u00d6ppna interaktiv rapport
                </a>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:4px 24px 24px;" align="center">
          <p style="margin:0;font-size:13px;color:#47474F;line-height:1.5;">L\u00e4nken \u00e4r giltig i 30 dagar. Vi lagrar ingen data fr\u00e5n din analys efter denna period.</p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 24px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Receipt -->
        <tr><td style="padding:24px;">
          <p style="margin:0 0 14px;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#47474F;">Kvitto</p>
          <table cellpadding="0" cellspacing="0" role="presentation" style="width:100%;font-size:15px;color:#2C2C34;">
            <tr><td style="padding:3px 0;color:#47474F;">Datum</td><td style="padding:3px 0;text-align:right;">${escapeHtml(opts.date)}</td></tr>
            <tr><td style="padding:3px 0;color:#47474F;">Kvittonummer</td><td style="padding:3px 0;text-align:right;font-family:monospace;font-size:13px;">${escapeHtml(opts.sessionId)}</td></tr>
            <tr><td style="padding:3px 0;color:#47474F;">Tj\u00e4nst</td><td style="padding:3px 0;text-align:right;">Avtalsanalys</td></tr>
            <tr><td colspan="2" style="padding:8px 0 0;"></td></tr>
            <tr><td style="padding:3px 0;color:#47474F;">Belopp exkl. moms</td><td style="padding:3px 0;text-align:right;">39,20 kr</td></tr>
            <tr><td style="padding:3px 0;color:#47474F;">Moms (25%)</td><td style="padding:3px 0;text-align:right;">9,80 kr</td></tr>
            <tr><td style="padding:6px 0 0;font-weight:600;color:#0A0A0C;border-top:1px solid #EBEBEF;">Totalt</td><td style="padding:6px 0 0;text-align:right;font-weight:600;color:#0A0A0C;border-top:1px solid #EBEBEF;">49,00 kr</td></tr>
          </table>

          <div style="margin-top:20px;padding-top:14px;border-top:1px solid #EBEBEF;font-size:14px;color:#47474F;line-height:1.6;">
            <p style="margin:0 0 2px;font-weight:600;color:#2C2C34;">S\u00e4ljare</p>
            <p style="margin:0;">Jezper Lorn\u00e9</p>
            <p style="margin:0;">Gamla Kilandav\u00e4gen 9, 44930 N\u00f6dinge, Sweden</p>
            <p style="margin:0;">Org.nr: ${escapeHtml(orgNr)}</p>
            <p style="margin:0;">Momsreg.nr: ${escapeHtml(vatNr)}</p>
          </div>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 24px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Disclaimer -->
        <tr><td style="padding:20px 24px;">
          <p style="margin:0;font-size:13px;color:#47474F;line-height:1.6;">
            Det h\u00e4r \u00e4r information, inte juridisk r\u00e5dgivning. Analysen \u00e4r automatiserad och kan inneh\u00e5lla fel.
            Den j\u00e4mf\u00f6r mot LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen och F\u00f6r\u00e4ldraledighetslagen.
            Kollektivavtal ing\u00e5r inte.
          </p>
          <p style="margin:10px 0 0;font-size:13px;color:#A8A8B4;">
            Detta mejl skickades av Kolla Avtalet. Svara inte p\u00e5 detta mejl.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
