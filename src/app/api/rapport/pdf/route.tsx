import { NextRequest, NextResponse } from "next/server";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
  Font,
} from "@react-pdf/renderer";
import type { AnalysisResult } from "@/lib/analysis-types";

// Registrera Inter som fallback (finns på Google Fonts CDN)
Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjQ.ttf", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjQ.ttf", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjQ.ttf", fontWeight: 700 },
  ],
});

const s = StyleSheet.create({
  page: { padding: 48, fontFamily: "Inter", fontSize: 10, color: "#2C2C34", lineHeight: 1.6 },
  header: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 2, borderBottomColor: "#0A0A0C", paddingBottom: 12, marginBottom: 24 },
  logo: { fontSize: 11, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: "#0A0A0C" },
  logoAccent: { color: "#DC1E38" },
  dateText: { fontSize: 9, color: "#47474F" },

  assessmentBox: { padding: 16, borderRadius: 4, marginBottom: 20, borderWidth: 1 },
  assessmentLabel: { fontSize: 9, fontWeight: 600, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 4 },
  assessmentTitle: { fontSize: 16, fontWeight: 700, color: "#0A0A0C", marginBottom: 6 },
  assessmentDesc: { fontSize: 10, color: "#47474F" },

  sectionHeading: { fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", color: "#47474F", marginBottom: 10, marginTop: 20 },

  flagCard: { padding: 12, borderLeftWidth: 3, borderRadius: 4, marginBottom: 8, backgroundColor: "#FAFAFA" },
  flagMeta: { flexDirection: "row", gap: 6, marginBottom: 4 },
  flagSeverity: { fontSize: 9, fontWeight: 600, letterSpacing: 0.6, textTransform: "uppercase" },
  flagCategory: { fontSize: 9, color: "#47474F" },
  flagTitle: { fontSize: 11, fontWeight: 600, color: "#0A0A0C", marginBottom: 4 },
  flagKlartext: { fontSize: 10, color: "#2C2C34", marginBottom: 6 },
  flagLagrum: { fontSize: 9, color: "#47474F" },

  comparisonRow: { flexDirection: "row", gap: 12, marginBottom: 4 },
  comparisonBox: { flex: 1, padding: 8, backgroundColor: "#F5F5F7", borderRadius: 3 },
  comparisonLabel: { fontSize: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#47474F", marginBottom: 3 },
  comparisonValue: { fontSize: 10, color: "#0A0A0C" },

  questionBox: { padding: 8, backgroundColor: "#F5F5F7", borderRadius: 3, marginBottom: 6 },
  questionLabel: { fontSize: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#DC1E38", marginBottom: 4 },
  questionItem: { fontSize: 10, color: "#2C2C34", marginBottom: 2 },

  strengthCard: { padding: 10, borderLeftWidth: 3, borderLeftColor: "#0A5020", borderRadius: 4, marginBottom: 6, backgroundColor: "#EEFAF0" },
  strengthTitle: { fontSize: 10, fontWeight: 600, color: "#0A0A0C", marginBottom: 2 },
  strengthDesc: { fontSize: 10, color: "#2C2C34" },

  marketTable: { marginBottom: 16 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#EBEBEF" },
  tableHeader: { fontSize: 8, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#47474F", padding: 6 },
  tableCell: { fontSize: 10, color: "#0A0A0C", padding: 6 },
  tableCellMuted: { fontSize: 9, color: "#47474F", padding: 6 },

  disclaimer: { marginTop: 24, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#DDDDE3" },
  disclaimerText: { fontSize: 8, color: "#47474F", lineHeight: 1.5 },
});

const sevColors: Record<string, { border: string; text: string }> = {
  hög: { border: "#8B1A0A", text: "#8B1A0A" },
  medel: { border: "#6B4000", text: "#6B4000" },
  info: { border: "#1A2C5C", text: "#1A2C5C" },
};

function ReportPDF({ result }: { result: AnalysisResult }) {
  const date = new Date().toLocaleDateString("sv-SE");
  const assessment = result.helhetsbedömning;
  const assessmentColor =
    assessment?.nivå === "bra" ? { bg: "#EEFAF0", border: "#80C890", label: "#0A5020" }
    : assessment?.nivå === "risk" ? { bg: "#FFF0EE", border: "#F0A8A0", label: "#8B1A0A" }
    : { bg: "#F5F5F7", border: "#C8C8D0", label: "#47474F" };

  const highFlags = result.flaggor.filter(f => f.allvarlighet === "hög");
  const mediumFlags = result.flaggor.filter(f => f.allvarlighet === "medel");
  const infoFlags = result.flaggor.filter(f => f.allvarlighet === "info");

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          <Text style={s.logo}>
            <Text style={s.logoAccent}>INK</Text>LING
          </Text>
          <Text style={s.dateText}>Avtalsrapport · {date}</Text>
        </View>

        {/* Helhetsbedömning */}
        {assessment && (
          <View style={[s.assessmentBox, { backgroundColor: assessmentColor.bg, borderColor: assessmentColor.border }]}>
            <Text style={[s.assessmentLabel, { color: assessmentColor.label }]}>
              {assessment.nivå === "bra" ? "Ser bra ut" : assessment.nivå === "risk" ? "Värt att granska noga" : "Några saker att notera"}
            </Text>
            <Text style={s.assessmentTitle}>{assessment.rubrik}</Text>
            <Text style={s.assessmentDesc}>{assessment.beskrivning}</Text>
          </View>
        )}

        {/* Sammanfattning */}
        <Text style={{ fontSize: 10, color: "#2C2C34", marginBottom: 16 }}>{result.sammanfattning}</Text>

        {/* Styrkor */}
        {result.styrkor && result.styrkor.length > 0 && (
          <View>
            <Text style={s.sectionHeading}>Det här ser bra ut</Text>
            {result.styrkor.map((st, i) => (
              <View key={i} style={s.strengthCard}>
                <Text style={s.strengthTitle}>{st.titel}</Text>
                <Text style={s.strengthDesc}>{st.beskrivning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Flaggor */}
        {[
          { flags: highFlags, label: "Bryter mot lag" },
          { flags: mediumFlags, label: "Avviker från praxis" },
          { flags: infoFlags, label: "Att känna till" },
        ].filter(g => g.flags.length > 0).map((group) => (
          <View key={group.label}>
            <Text style={s.sectionHeading}>{group.label} ({group.flags.length})</Text>
            {group.flags.map((flag, i) => {
              const c = sevColors[flag.allvarlighet] ?? sevColors.info;
              return (
                <View key={i} style={[s.flagCard, { borderLeftColor: c.border }]} wrap={false}>
                  <View style={s.flagMeta}>
                    <Text style={[s.flagSeverity, { color: c.text }]}>{flag.allvarlighet}</Text>
                    <Text style={s.flagCategory}>· {flag.kategori}</Text>
                  </View>
                  <Text style={s.flagTitle}>{flag.titel}</Text>
                  <Text style={s.flagKlartext}>{flag.klartext}</Text>

                  {(flag.avtalets_text || flag.lagens_krav) && (
                    <View style={s.comparisonRow}>
                      {flag.avtalets_text && (
                        <View style={s.comparisonBox}>
                          <Text style={s.comparisonLabel}>Avtalet säger</Text>
                          <Text style={s.comparisonValue}>{flag.avtalets_text}</Text>
                        </View>
                      )}
                      {flag.lagens_krav && (
                        <View style={s.comparisonBox}>
                          <Text style={s.comparisonLabel}>Lagen anger</Text>
                          <Text style={s.comparisonValue}>{flag.lagens_krav}</Text>
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

                  <Text style={s.flagLagrum}>{flag.lagrum}</Text>
                </View>
              );
            })}
          </View>
        ))}

        {/* Marknadsjämförelse */}
        {result.marknadsjämförelse && result.marknadsjämförelse.length > 0 && (
          <View style={s.marketTable}>
            <Text style={s.sectionHeading}>Ditt avtal vs marknaden</Text>
            <View style={[s.tableRow, { borderBottomColor: "#C8C8D0" }]}>
              <Text style={[s.tableHeader, { flex: 2 }]}>Villkor</Text>
              <Text style={[s.tableHeader, { flex: 2 }]}>Ditt avtal</Text>
              <Text style={[s.tableHeader, { flex: 2 }]}>Marknad</Text>
              <Text style={[s.tableHeader, { flex: 2 }]}>Källa</Text>
            </View>
            {result.marknadsjämförelse.map((mj, i) => (
              <View key={i} style={s.tableRow}>
                <Text style={[s.tableCell, { flex: 2, fontWeight: 600 }]}>{mj.villkor}</Text>
                <Text style={[s.tableCell, { flex: 2 }]}>{mj.avtalets_värde}</Text>
                <Text style={[s.tableCellMuted, { flex: 2 }]}>{mj.benchmark_värde}</Text>
                <Text style={[s.tableCellMuted, { flex: 2 }]}>{mj.benchmark_källa}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Nästa steg */}
        {result.nästa_steg && result.nästa_steg.length > 0 && (
          <View>
            <Text style={s.sectionHeading}>Nästa steg</Text>
            {result.nästa_steg.map((steg, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 600, color: "#0A0A0C" }}>{steg.titel}</Text>
                <Text style={{ fontSize: 10, color: "#2C2C34" }}>{steg.beskrivning}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            Det här är information, inte juridisk rådgivning. Analysen jämför mot LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen. Kollektivavtal ingår inte. Vid osäkerhet, kontakta ett fackförbund eller en arbetsrättsjurist.
          </Text>
        </View>
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { result } = (await req.json()) as { result?: AnalysisResult };
    if (!result || !Array.isArray(result.flaggor)) {
      return NextResponse.json({ error: "Ogiltig data." }, { status: 400 });
    }

    const buffer = await renderToBuffer(<ReportPDF result={result} />);
    const uint8 = new Uint8Array(buffer);

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="inkling-rapport.pdf"',
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[pdf] Error:", err);
    return NextResponse.json({ error: "Kunde inte generera PDF." }, { status: 500 });
  }
}
