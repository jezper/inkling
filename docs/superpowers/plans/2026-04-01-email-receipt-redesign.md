# Email Receipt + Report PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the email to be a minimal receipt with the full analysis report attached as a PDF.

**Architecture:** The email body becomes a clean receipt (kvitto) with brand header and all legally required fields. The analysis report is generated server-side as a PDF using `@react-pdf/renderer` and attached via Resend's attachments API. The client sends `sessionId` alongside the existing `email` and `result` fields.

**Tech Stack:** `@react-pdf/renderer`, Resend attachments API, existing `AnalysisResult` type

---

### Task 1: Install `@react-pdf/renderer` and register fonts

**Files:**
- Modify: `package.json`
- Create: `src/lib/pdf-fonts.ts`

- [ ] **Step 1: Install the dependency**

Run: `npm install @react-pdf/renderer`

- [ ] **Step 2: Create font registration file**

```typescript
// src/lib/pdf-fonts.ts
import { Font } from "@react-pdf/renderer";

// Register fonts for PDF rendering
// Using Google Fonts CDN URLs for Space Grotesk (display) and Inter (body)
Font.register({
  family: "Space Grotesk",
  fonts: [
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPb94DQ.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mPbF4Cw.ttf", fontWeight: 700 },
  ],
});

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwY.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcvkYgY.ttf", fontWeight: 600 },
  ],
});

// Disable hyphenation (Swedish words break badly)
Font.registerHyphenationCallback((word) => [word]);
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json src/lib/pdf-fonts.ts
git commit -m "chore: install @react-pdf/renderer and register PDF fonts"
```

---

### Task 2: Create report PDF document component

**Files:**
- Create: `src/lib/report-pdf.tsx`

This is the largest task. The PDF mirrors the full-report page layout for A4 print.

- [ ] **Step 1: Create the report PDF component**

```tsx
// src/lib/report-pdf.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { AnalysisResult, Flagga } from "./analysis-types";
import "./pdf-fonts";

const KRIMSON = "#DC1E38";
const SEV_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  hög: { bg: "#FFF0EE", text: "#8B1A0A", border: "#F0A8A0" },
  medel: { bg: "#FFF8EE", text: "#6B4000", border: "#E8C070" },
  info: { bg: "#EEF2FF", text: "#1A2C5C", border: "#90A8E0" },
};
const OK_COLOR = { bg: "#EEFAF0", text: "#0A3A18", border: "#80C890" };

const s = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: "#2C2C34",
    paddingTop: 48,
    paddingBottom: 60,
    paddingHorizontal: 48,
  },
  header: {
    fontFamily: "Space Grotesk",
    fontSize: 9,
    letterSpacing: 1,
    color: "#47474F",
    marginBottom: 24,
    textTransform: "uppercase",
  },
  headerAccent: { color: KRIMSON, fontWeight: 700 },
  // Gauge
  gaugeRow: { flexDirection: "row", gap: 2, marginBottom: 8, maxWidth: 200 },
  gaugeSegment: { flex: 1, height: 8, borderRadius: 2 },
  gaugeLabel: {
    fontFamily: "Space Grotesk",
    fontSize: 7,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 3,
  },
  // Sections
  sectionTitle: {
    fontFamily: "Space Grotesk",
    fontSize: 12,
    fontWeight: 600,
    color: "#0A0A0C",
    marginBottom: 8,
    marginTop: 20,
  },
  bodyText: { fontSize: 10, lineHeight: 1.6, color: "#2C2C34" },
  // Flags
  flagCard: {
    marginBottom: 8,
    padding: 10,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  flagSeverity: {
    fontSize: 8,
    fontWeight: 600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  flagTitle: { fontSize: 11, fontWeight: 600, color: "#0A0A0C", marginBottom: 3 },
  flagBody: { fontSize: 9, color: "#2C2C34", lineHeight: 1.5 },
  flagMeta: { fontSize: 8, color: "#47474F", marginTop: 4 },
  // Comparison columns
  compRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  compCol: { flex: 1, backgroundColor: "#F5F5F7", padding: 6, borderRadius: 3 },
  compLabel: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#47474F", marginBottom: 2 },
  compValue: { fontSize: 9, color: "#0A0A0C" },
  // Questions
  questionBox: { backgroundColor: "#F5F5F7", padding: 6, borderRadius: 3, marginTop: 6 },
  questionLabel: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: KRIMSON, marginBottom: 2 },
  questionItem: { fontSize: 9, color: "#2C2C34", marginBottom: 1 },
  // Strengths
  strengthCard: {
    marginBottom: 6,
    padding: 8,
    borderRadius: 4,
    backgroundColor: OK_COLOR.bg,
    borderLeftWidth: 3,
    borderLeftColor: OK_COLOR.border,
  },
  strengthTitle: { fontSize: 10, fontWeight: 600, color: "#0A0A0C", marginBottom: 2 },
  strengthBody: { fontSize: 9, color: "#2C2C34" },
  // Table
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#EBEBEF" },
  tableHeader: { fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#47474F", padding: 4 },
  tableCell: { fontSize: 9, color: "#0A0A0C", padding: 4 },
  // Missing terms
  missingCard: {
    marginBottom: 6,
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  // Next steps
  stepCard: { marginBottom: 6, padding: 8, borderRadius: 4, backgroundColor: "#F5F5F7" },
  stepType: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: KRIMSON, marginBottom: 2 },
  stepTitle: { fontSize: 10, fontWeight: 600, color: "#0A0A0C", marginBottom: 2 },
  stepBody: { fontSize: 9, color: "#2C2C34" },
  // Footer
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    fontSize: 8,
    color: "#47474F",
    borderTopWidth: 1,
    borderTopColor: "#EBEBEF",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  disclaimer: { fontSize: 8, color: "#47474F", lineHeight: 1.5, marginTop: 20 },
});

const GAUGE_SEGMENTS = [
  { label: "Bra", color: OK_COLOR.border, textColor: OK_COLOR.text },
  { label: "Notera", color: "#E8C070", textColor: "#6B4000" },
  { label: "Risk", color: "#F0A8A0", textColor: "#8B1A0A" },
];

function GaugePdf({ nivå }: { nivå: "bra" | "godkänt" | "risk" }) {
  const activeIndex = nivå === "bra" ? 0 : nivå === "godkänt" ? 1 : 2;
  return (
    <View>
      <View style={s.gaugeRow}>
        {GAUGE_SEGMENTS.map((seg, i) => (
          <View key={i} style={{ flex: 1, alignItems: "center" }}>
            <View
              style={[
                s.gaugeSegment,
                {
                  backgroundColor: i === activeIndex ? seg.color : "#DDDDE3",
                  borderTopLeftRadius: i === 0 ? 4 : 0,
                  borderBottomLeftRadius: i === 0 ? 4 : 0,
                  borderTopRightRadius: i === 2 ? 4 : 0,
                  borderBottomRightRadius: i === 2 ? 4 : 0,
                  width: "100%",
                },
              ]}
            />
            <Text
              style={[
                s.gaugeLabel,
                {
                  color: i === activeIndex ? seg.textColor : "#A8A8B4",
                  fontWeight: i === activeIndex ? 700 : 400,
                },
              ]}
            >
              {seg.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function FlagSection({ flags, label }: { flags: Flagga[]; label: string }) {
  if (flags.length === 0) return null;
  const c = SEV_COLORS[flags[0].allvarlighet] ?? SEV_COLORS.info;
  return (
    <View>
      <Text style={[s.flagSeverity, { color: c.text, marginTop: 12, marginBottom: 4 }]}>
        {label} ({flags.length})
      </Text>
      {flags.map((flag, i) => (
        <View
          key={i}
          style={[s.flagCard, { backgroundColor: c.bg, borderLeftColor: c.border }]}
          wrap={false}
        >
          <Text style={[s.flagSeverity, { color: c.text }]}>
            {flag.allvarlighet} · {flag.kategori}
          </Text>
          <Text style={s.flagTitle}>{flag.titel}</Text>
          <Text style={s.flagBody}>{flag.klartext}</Text>
          {(flag.avtalets_text || flag.lagens_krav) && (
            <View style={s.compRow}>
              {flag.avtalets_text && (
                <View style={s.compCol}>
                  <Text style={s.compLabel}>Avtalet säger</Text>
                  <Text style={s.compValue}>{flag.avtalets_text}</Text>
                </View>
              )}
              {flag.lagens_krav && (
                <View style={s.compCol}>
                  <Text style={s.compLabel}>Lagen anger</Text>
                  <Text style={s.compValue}>{flag.lagens_krav}</Text>
                </View>
              )}
            </View>
          )}
          {flag.frågor_att_ställa && flag.frågor_att_ställa.length > 0 && (
            <View style={s.questionBox}>
              <Text style={s.questionLabel}>Frågor att ställa</Text>
              {flag.frågor_att_ställa.map((q, qi) => (
                <Text key={qi} style={s.questionItem}>• {q}</Text>
              ))}
            </View>
          )}
          <Text style={s.flagMeta}>{flag.lagrum}</Text>
        </View>
      ))}
    </View>
  );
}

function dateStr(): string {
  return new Date().toLocaleDateString("sv-SE");
}

export function ReportPdfDocument({ data }: { data: AnalysisResult }) {
  const highFlags = data.flaggor.filter((f) => f.allvarlighet === "hög");
  const medelFlags = data.flaggor.filter((f) => f.allvarlighet === "medel");
  const infoFlags = data.flaggor.filter((f) => f.allvarlighet === "info");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.header}>
          KOLLA AVTALET · AVTALSRAPPORT · {dateStr()}
        </Text>

        {/* Gauge */}
        {data.helhetsbedömning && (
          <View style={{ marginBottom: 16 }}>
            <GaugePdf nivå={data.helhetsbedömning.nivå} />
            <Text style={[s.sectionTitle, { marginTop: 8, marginBottom: 4 }]}>
              {data.helhetsbedömning.rubrik}
            </Text>
            <Text style={s.bodyText}>{data.helhetsbedömning.beskrivning}</Text>
          </View>
        )}

        {/* Sammanfattning */}
        <Text style={s.bodyText}>{data.sammanfattning}</Text>

        {/* Flaggor */}
        <Text style={s.sectionTitle}>Granskning</Text>
        <FlagSection flags={highFlags} label="Bryter mot lag" />
        <FlagSection flags={medelFlags} label="Avviker från praxis" />
        <FlagSection flags={infoFlags} label="Att känna till" />

        {/* Styrkor */}
        {data.styrkor && data.styrkor.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Styrkor</Text>
            {data.styrkor.map((st, i) => (
              <View key={i} style={s.strengthCard} wrap={false}>
                <Text style={s.strengthTitle}>{st.titel}</Text>
                <Text style={s.strengthBody}>{st.beskrivning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Saknade villkor */}
        {data.saknade_villkor && data.saknade_villkor.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Saknade villkor</Text>
            {data.saknade_villkor.map((sv, i) => {
              const c = SEV_COLORS[sv.allvarlighet] ?? SEV_COLORS.info;
              return (
                <View
                  key={i}
                  style={[s.missingCard, { backgroundColor: c.bg, borderLeftColor: c.border }]}
                  wrap={false}
                >
                  <Text style={[s.flagSeverity, { color: c.text }]}>{sv.allvarlighet}</Text>
                  <Text style={s.flagTitle}>{sv.villkor}</Text>
                  <Text style={s.flagBody}>{sv.relevans}</Text>
                  <Text style={s.flagMeta}>{sv.referens}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Marknadsjämförelse */}
        {data.marknadsjämförelse && data.marknadsjämförelse.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Marknadsjämförelse</Text>
            <View style={[s.tableRow, { borderBottomColor: "#C8C8D0" }]}>
              <Text style={[s.tableHeader, { flex: 2 }]}>Villkor</Text>
              <Text style={[s.tableHeader, { flex: 2 }]}>Ditt avtal</Text>
              <Text style={[s.tableHeader, { flex: 2 }]}>Marknad</Text>
            </View>
            {data.marknadsjämförelse.map((mj, i) => (
              <View key={i} style={s.tableRow} wrap={false}>
                <Text style={[s.tableCell, { flex: 2, fontWeight: 600 }]}>{mj.villkor}</Text>
                <Text style={[s.tableCell, { flex: 2 }]}>{mj.avtalets_värde}</Text>
                <Text style={[s.tableCell, { flex: 2, color: "#47474F" }]}>{mj.benchmark_värde}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nästa steg */}
        {data.nästa_steg && data.nästa_steg.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Värt att tänka på</Text>
            {data.nästa_steg.map((ns, i) => (
              <View key={i} style={s.stepCard} wrap={false}>
                <Text style={s.stepType}>{ns.typ}</Text>
                <Text style={s.stepTitle}>{ns.titel}</Text>
                <Text style={s.stepBody}>{ns.beskrivning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <Text style={s.disclaimer}>
          Det här är information, inte juridisk rådgivning. Analysen jämför mot LAS, Semesterlagen,
          Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen. Kollektivavtal ingår inte.
          Vid osäkerhet, kontakta ett fackförbund eller en arbetsrättsjurist.
        </Text>

        {/* Page footer */}
        <View style={s.pageFooter} fixed>
          <Text>Genererad av Kolla Avtalet · {dateStr()}</Text>
          <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/report-pdf.tsx
git commit -m "feat: add report PDF document component with @react-pdf/renderer"
```

---

### Task 3: Rewrite email template as receipt

**Files:**
- Modify: `src/lib/email-template.ts`

- [ ] **Step 1: Rewrite the email template**

Replace the entire file content:

```typescript
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
          <p style="margin:0 0 16px;font-size:16px;font-weight:600;color:#0A0A0C;">Tack f\u00f6r din best\u00e4llning.</p>
          <p style="margin:0 0 12px;font-size:14px;color:#2C2C34;">Din avtalsrapport finns bifogad som PDF.</p>
          <p style="margin:0 0 4px;font-size:14px;color:#2C2C34;">
            Du kan \u00e4ven se en interaktiv version h\u00e4r:
            <a href="${escapeHtml(opts.reportUrl)}" style="color:#DC1E38;text-decoration:underline;">${escapeHtml(opts.reportUrl)}</a>
          </p>
          <p style="margin:0;font-size:12px;color:#47474F;">L\u00e4nken \u00e4r giltig i 30 dagar. Vi lagrar ingen data fr\u00e5n din analys efter denna period.</p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Receipt -->
        <tr><td style="padding:24px 32px;">
          <p style="margin:0 0 16px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#47474F;">Kvitto</p>
          <table cellpadding="0" cellspacing="0" style="font-size:13px;color:#2C2C34;">
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Datum</td><td>${escapeHtml(opts.date)}</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Kvittonummer</td><td style="font-family:monospace;font-size:12px;">${escapeHtml(opts.sessionId)}</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Tj\u00e4nst</td><td>Avtalsanalys</td></tr>
            <tr><td colspan="2" style="padding:8px 0 0;"></td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Belopp exkl. moms</td><td>39,20 kr</td></tr>
            <tr><td style="padding:2px 24px 2px 0;color:#47474F;">Moms (25%)</td><td>9,80 kr</td></tr>
            <tr><td style="padding:2px 24px 2px 0;font-weight:600;color:#0A0A0C;">Totalt</td><td style="font-weight:600;color:#0A0A0C;">49,00 kr</td></tr>
          </table>

          <div style="margin-top:16px;padding-top:12px;border-top:1px solid #EBEBEF;font-size:12px;color:#47474F;">
            <p style="margin:0;font-weight:600;color:#2C2C34;">S\u00e4ljare</p>
            <p style="margin:2px 0 0;">Jezper Lorn\u00e9</p>
            <p style="margin:2px 0 0;">Gamla Kilandav\u00e4gen 9, 44930 N\u00f6dinge, Sweden</p>
            <p style="margin:2px 0 0;">Org.nr: ${escapeHtml(orgNr)}</p>
            <p style="margin:2px 0 0;">Momsreg.nr: SE800827491501</p>
          </div>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:0 32px;"><div style="border-top:1px solid #DDDDE3;"></div></td></tr>

        <!-- Disclaimer -->
        <tr><td style="padding:20px 32px;">
          <p style="margin:0;font-size:11px;color:#47474F;line-height:1.5;">
            Det h\u00e4r \u00e4r information, inte juridisk r\u00e5dgivning. Analysen j\u00e4mf\u00f6r mot LAS, Semesterlagen,
            Arbetstidslagen, Diskrimineringslagen och F\u00f6r\u00e4ldraledighetslagen. Kollektivavtal ing\u00e5r inte.
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#A8A8B4;">
            Detta mejl skickades av Kolla Avtalet. Svara inte p\u00e5 detta mejl.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
```

Note: the function signature changes from `buildReportEmail(result, reportUrl)` to `buildReceiptEmail(opts)`. The old `buildReportEmail` export is removed — callers will be updated in Task 4.

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: Errors in `email/route.ts` (still referencing old function) — expected, fixed in Task 4.

- [ ] **Step 3: Commit**

```bash
git add src/lib/email-template.ts
git commit -m "feat: rewrite email template as minimal receipt"
```

---

### Task 4: Update email route — generate PDF, attach, use receipt template

**Files:**
- Modify: `src/app/api/email/route.ts`
- Modify: `src/components/full-report.tsx` (send sessionId in email request)

- [ ] **Step 1: Update the client to send sessionId**

In `src/components/full-report.tsx`, around line 102-106, the email fetch currently sends `{ email, result }`. Add `sessionId`:

Find:
```typescript
body: JSON.stringify({ email: result.email, result: JSON.parse(stored) }),
```

Replace with:
```typescript
body: JSON.stringify({ email: result.email, result: JSON.parse(stored), sessionId }),
```

The `sessionId` variable is already in scope at this point (from the component props, line 42).

- [ ] **Step 2: Rewrite the email route**

Replace `src/app/api/email/route.ts` entirely:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { resend } from "@/lib/resend";
import { createReportToken } from "@/lib/report-token";
import { buildReceiptEmail } from "@/lib/email-template";
import { ReportPdfDocument } from "@/lib/report-pdf";
import { checkRateLimit } from "@/lib/rate-limit";
import type { AnalysisResult } from "@/lib/analysis-types";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed } = await checkRateLimit(ip, "general");
  if (!allowed) {
    return NextResponse.json(
      { error: "Du har gjort för många förfrågningar. Försök igen senare." },
      { status: 429, headers: { "Retry-After": "3600" } },
    );
  }

  try {
    const { email, result, sessionId } = (await req.json()) as {
      email?: string;
      result?: AnalysisResult;
      sessionId?: string;
    };

    if (!email || !result || !Array.isArray(result.flaggor)) {
      return NextResponse.json(
        { error: "Email och analysresultat krävs." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Ogiltig emailadress." },
        { status: 400 },
      );
    }

    // Create report link
    const token = createReportToken(result);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const reportUrl = `${siteUrl}/rapport?t=${token}`;

    // Generate report PDF
    const pdfBuffer = await renderToBuffer(
      ReportPdfDocument({ data: result }),
    );

    // Build receipt email
    const date = new Date().toLocaleDateString("sv-SE");
    const html = buildReceiptEmail({
      reportUrl,
      sessionId: sessionId ?? "N/A",
      date,
    });

    // Send email with PDF attachment
    const { error } = await resend.emails.send({
      from: "Kolla Avtalet <onboarding@resend.dev>",
      to: email,
      subject: `Kvitto och avtalsrapport — Kolla Avtalet`,
      html,
      attachments: [
        {
          filename: "Avtalsrapport.pdf",
          content: Buffer.from(pdfBuffer),
        },
      ],
    });

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[email] Resend error:", error);
      return NextResponse.json(
        { error: "Kunde inte skicka email. Försök igen." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[email] Error:", err);
    return NextResponse.json(
      { error: "Något gick fel." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 3: Add `BUSINESS_ORG_NR` to `.env.local`**

Add to `.env.local`:
```
BUSINESS_ORG_NR=your-org-nr-here
```

- [ ] **Step 4: Verify build**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 5: Run all tests**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 6: Commit**

```bash
git add src/app/api/email/route.ts src/components/full-report.tsx
git commit -m "feat: email sends receipt + attached report PDF"
```
