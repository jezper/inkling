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
  sectionTitle: {
    fontFamily: "Space Grotesk",
    fontSize: 12,
    fontWeight: 600,
    color: "#0A0A0C",
    marginBottom: 8,
    marginTop: 20,
  },
  bodyText: { fontSize: 10, lineHeight: 1.6, color: "#2C2C34" },
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
  compRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  compCol: { flex: 1, backgroundColor: "#F5F5F7", padding: 6, borderRadius: 3 },
  compLabel: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: "#47474F", marginBottom: 2 },
  compValue: { fontSize: 9, color: "#0A0A0C" },
  questionBox: { backgroundColor: "#F5F5F7", padding: 6, borderRadius: 3, marginTop: 6 },
  questionLabel: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: KRIMSON, marginBottom: 2 },
  questionItem: { fontSize: 9, color: "#2C2C34", marginBottom: 1 },
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
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#EBEBEF" },
  tableHeader: { fontSize: 8, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, color: "#47474F", padding: 4 },
  tableCell: { fontSize: 9, color: "#0A0A0C", padding: 4 },
  missingCard: {
    marginBottom: 6,
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 3,
  },
  stepCard: { marginBottom: 6, padding: 8, borderRadius: 4, backgroundColor: "#F5F5F7" },
  stepType: { fontSize: 7, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", color: KRIMSON, marginBottom: 2 },
  stepTitle: { fontSize: 10, fontWeight: 600, color: "#0A0A0C", marginBottom: 2 },
  stepBody: { fontSize: 9, color: "#2C2C34" },
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
          Det här är information, inte juridisk rådgivning. Analysen är automatiserad och inte granskad
          av människa. Den jämför mot LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen och
          Föräldraledighetslagen. Kollektivavtal ingår inte. Vid osäkerhet, kontakta ett fackförbund
          eller en arbetsrättsjurist.
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
