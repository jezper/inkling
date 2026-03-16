import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Källor och data | Kolla Avtalet",
  description:
    "Alla lagar, datakällor och branschstatistik som Kolla Avtalet använder för att analysera ditt anställningsavtal.",
};

/* ── Source data ────────────────────────────────────────────────────────────── */

interface Source {
  namn: string;
  beskrivning: string;
  url: string;
  licens?: string;
}

const LAGAR: Source[] = [
  {
    namn: "Lagen om anställningsskydd (LAS)",
    beskrivning:
      "Reglerar anställningsformer, uppsägningstider, saklig grund och turordning.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-198280-om-anstallningsskydd_sfs-1982-80/",
  },
  {
    namn: "Semesterlagen",
    beskrivning:
      "Minst 25 semesterdagar per år, semesterlön och semesterersättning.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/semesterlag-1977480_sfs-1977-480/",
  },
  {
    namn: "Arbetstidslagen",
    beskrivning:
      "Max 40 timmar per vecka, övertidstak och krav på dygnsvila.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/arbetstidslag-1982673_sfs-1982-673/",
  },
  {
    namn: "Diskrimineringslagen",
    beskrivning:
      "Skydd mot diskriminering i arbetslivet baserat på sju diskrimineringsgrunder.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/diskrimineringslag-2008567_sfs-2008-567/",
  },
  {
    namn: "Föräldraledighetslagen",
    beskrivning:
      "Rätt till föräldraledighet och skydd mot missgynnande.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/foraldraledighetslag-1995584_sfs-1995-584/",
  },
  {
    namn: "Avtalslagen",
    beskrivning:
      "Grundläggande regler om avtal. 36 och 38 paragraferna används vid bedömning av oskäliga konkurrensklausuler.",
    url: "https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/lag-1915218-om-avtal-och-andra-rattshandlingar_sfs-1915-218/",
  },
];

const SFS: Record<string, string> = {
  "Lagen om anställningsskydd (LAS)": "SFS 1982:80",
  Semesterlagen: "SFS 1977:480",
  Arbetstidslagen: "SFS 1982:673",
  Diskrimineringslagen: "SFS 2008:567",
  Föräldraledighetslagen: "SFS 1995:584",
  Avtalslagen: "SFS 1915:218",
};

const STATISTIK: Source[] = [
  {
    namn: "SCB Lönestrukturstatistik",
    beskrivning:
      "Median, percentiler och lönespridning per yrke (SSYK-kod). Används för lönejämförelse i analysen.",
    url: "https://www.scb.se/hitta-statistik/sverige-i-siffror/lonesok/",
    licens: "CC BY 4.0",
  },
  {
    namn: "Medlingsinstitutet",
    beskrivning:
      "Avtalsstatistik om uppsägningstider, provanställning och löneökningar per avtalsområde.",
    url: "https://www.mi.se/lonestatistik/",
  },
  {
    namn: "JobTech / Arbetsförmedlingen",
    beskrivning:
      "Taxonomi-API som mappar yrkesnamn till SSYK-koder för koppling mot SCB:s lönedata.",
    url: "https://jobtechdev.se/",
    licens: "CC0",
  },
];

const BRANSCH: Source[] = [
  {
    namn: "Unionens avtalsstatistik",
    beskrivning:
      "Lönestatistik, semestervillkor och kollektivavtalsguide för tjänstemän i privat sektor.",
    url: "https://www.unionen.se/lon-och-villkor",
  },
  {
    namn: "Sveriges Ingenjörers statistik",
    beskrivning:
      "Löne- och avtalsstatistik för ingenjörer och tekniker.",
    url: "https://www.sverigesingenjorer.se/lon/",
  },
  {
    namn: "Ledarnas avtalsstatistik",
    beskrivning:
      "Statistik om chefsavtal, uppsägningstider och semester för ledare.",
    url: "https://www.ledarna.se/stod-i-chefsrollen/lon/",
  },
  {
    namn: "Svenskt Näringsliv och PTK:s avtal om konkurrensklausuler",
    beskrivning:
      "Branschstandard för konkurrensklausuler: tid, kompensation och skyddsvärt intresse. Avtal från 2015.",
    url: "https://www.ptk.se/",
  },
];

/* ── Section component ─────────────────────────────────────────────────────── */

function SourceSection({
  title,
  sources,
  showSfs,
}: {
  title: string;
  sources: Source[];
  showSfs?: boolean;
}) {
  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.375rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "var(--color-text-primary)",
          lineHeight: 1.25,
          marginBottom: "1.25rem",
        }}
      >
        {title}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sources.map((s) => (
          <div
            key={s.namn}
            style={{
              padding: "1.125rem 1.25rem",
              background: "var(--color-surface-0)",
              border: "1px solid var(--color-surface-200)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "baseline",
                gap: "0.5rem",
                marginBottom: "0.375rem",
              }}
            >
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-base)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                  textDecorationColor: "var(--color-surface-300)",
                }}
              >
                {s.namn}
              </a>

              {showSfs && SFS[s.namn] && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-subtle)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {SFS[s.namn]}
                </span>
              )}

              {s.licens && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-accent-text)",
                    letterSpacing: "0.04em",
                    padding: "0.125rem 0.5rem",
                    background: "var(--color-accent-50)",
                    borderRadius: "var(--radius-full)",
                  }}
                >
                  {s.licens}
                </span>
              )}
            </div>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {s.beskrivning}
            </p>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-subtle)",
                letterSpacing: "0.03em",
                marginTop: "0.5rem",
                marginBottom: 0,
                wordBreak: "break-all",
              }}
            >
              {s.url}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */

export default function KallorPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--color-surface-50)",
      }}
    >
      <Header />

      {/* Spacer for fixed header */}
      <div style={{ height: "57px", flexShrink: 0 }} aria-hidden="true" />

      <main id="main-content" style={{ flex: 1 }}>
        {/* Page header */}
        <div
          style={{
            background: "var(--color-surface-0)",
            borderBottom: "1px solid var(--color-surface-200)",
            padding: "2.5rem 1.5rem 2.25rem",
          }}
        >
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <nav
              aria-label="Brodsmuler"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-subtle)",
                letterSpacing: "0.04em",
                marginBottom: "1.75rem",
              }}
            >
              <a
                href="/"
                style={{
                  color: "var(--color-text-muted)",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                Hem
              </a>
              <span aria-hidden="true" style={{ color: "var(--color-surface-300)" }}>
                /
              </span>
              <span
                aria-current="page"
                style={{ color: "var(--color-text-primary)", fontWeight: 500 }}
              >
                Källor
              </span>
            </nav>

            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--color-accent-text)",
                marginBottom: "0.625rem",
              }}
            >
              Transparens
            </p>

            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "var(--color-text-primary)",
                lineHeight: 1.15,
                marginBottom: "0.875rem",
              }}
            >
              Källor och data
            </h1>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                maxWidth: "42rem",
              }}
            >
              Kolla Avtalet jämför ditt anställningsavtal mot svensk lagstiftning,
              offentlig lönestatistik och branschdata. Här är alla källor vi
              använder.
            </p>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            maxWidth: "48rem",
            margin: "0 auto",
            padding: "2.5rem 1.5rem 4rem",
          }}
        >
          <SourceSection title="Lagar" sources={LAGAR} showSfs />
          <SourceSection title="Statistik och data" sources={STATISTIK} />
          <SourceSection title="Branschkällor" sources={BRANSCH} />

          {/* Attribution note */}
          <div
            style={{
              marginTop: "1rem",
              padding: "1.125rem 1.25rem",
              background: "var(--color-surface-0)",
              border: "1px solid var(--color-surface-200)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--color-text-subtle)",
                marginBottom: "0.5rem",
              }}
            >
              Attribution
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "var(--text-base)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Lönestatistik: SCB Lönestrukturstatistik, licensierad under CC BY 4.0.
              Yrkestaxonomi: JobTech Dev (Arbetsförmedlingen), licensierad under CC0.
              Alla lagtexter hämtas från riksdagen.se och är offentliga handlingar.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
