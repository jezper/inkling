import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FaqContent } from "./faq-content";

// ---------------------------------------------------------------------------
// SEO metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Vanliga frågor om avtalsgranskning",
  description:
    "Hur fungerar avtalsgranskningen? Sparas mitt avtal? Vad ingår? Svar på det viktigaste om Kolla Avtalet.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Vanliga frågor | Kolla Avtalet",
    description:
      "Hur fungerar avtalsgranskningen? Sparas mitt avtal? Vad ingår? Svar på det viktigaste om Kolla Avtalet.",
    url: "/faq",
    type: "website",
  },
};

// ---------------------------------------------------------------------------
// FAQ JSON-LD schema (Google FAQ rich result)
// ---------------------------------------------------------------------------

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Hur fungerar granskningen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ladda upp din PDF. Texten i avtalet läses direkt i din webbläsare och all identifierbar information tas bort innan något lämnar din enhet. Sedan jämförs varje klausul mot gällande lag (LAS, Semesterlagen, Arbetstidslagen och fler) och du får en rapport med vad som är standard, vad som avviker, och vad som saknas.",
      },
    },
    {
      "@type": "Question",
      name: "Sparar ni mitt avtal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nej. Varken originaldokumentet eller avtalstexten sparas. Det finns ingen databas i tjänsten. Ingenting lagras efter att rapporten genererats.",
      },
    },
    {
      "@type": "Question",
      name: "Är det här juridisk rådgivning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Nej. Det är juridisk information. Rapporten jämför avtalets villkor mot lag och marknadspraxis. Den drar inga slutsatser om vad du ska göra. Behöver du ett juridiskt ombud är Arbetsdomstolen och lokala fackförbund bra utgångspunkter.",
      },
    },
    {
      "@type": "Question",
      name: "Vad kostar det?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Snabbkollen är gratis. Full rapport kostar 49 kr. En engångskostnad, ingen prenumeration.",
      },
    },
    {
      "@type": "Question",
      name: "Vilka lagar granskas avtalet mot?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "LAS (SFS 1982:80), Semesterlagen (SFS 1977:480), Arbetstidslagen (SFS 1982:673), Diskrimineringslagen (SFS 2008:567), Föräldraledighetslagen (SFS 1995:584) och 38 paragraf Avtalslagen vid konkurrensklausuler.",
      },
    },
    {
      "@type": "Question",
      name: "Hur lång tid tar det?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vanligtvis under en minut. Enkla avtal går snabbare, komplexa avtal med många klausuler kan ta lite längre.",
      },
    },
    {
      "@type": "Question",
      name: "Vad är omgranskning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Om arbetsgivaren ändrar avtalet efter din genomgång kan du ladda upp den reviderade versionen och få en ny fullständig rapport utan extra kostnad. Ingår i de 49 kronorna.",
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main
        style={{
          paddingTop: "7rem",
          paddingBottom: "5rem",
          minHeight: "100vh",
          background: "var(--background)",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {/* Page header */}
          <div style={{ marginBottom: "3.5rem" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color: "var(--color-accent-text)",
                marginBottom: "0.75rem",
              }}
            >
              Vanliga frågor
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 6vw, 3.25rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: "var(--tracking-tighter)",
                color: "var(--color-text-primary)",
                marginBottom: "1rem",
              }}
            >
              Vad undrar folk?
            </h1>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-muted)",
                maxWidth: "480px",
                lineHeight: 1.6,
              }}
            >
              Svar på det mesta om hur granskningen går till, vad som händer
              med ditt avtal och vad rapporten faktiskt kan och inte kan.
            </p>
          </div>

          {/* Accordion sections */}
          <FaqContent />

          {/* Bottom CTA */}
          <div
            style={{
              marginTop: "2rem",
              paddingTop: "2.5rem",
              borderTop: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-lg)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              Fortfarande osäker?
            </p>
            <p
              style={{
                fontSize: "var(--text-base)",
                color: "var(--color-text-muted)",
                lineHeight: 1.6,
                maxWidth: "440px",
              }}
            >
              Ladda upp avtalet och se snabbkollen gratis. Det tar under en
              minut och du bestämmer om du vill ha full rapport efteråt.
            </p>
            <div>
              <a
                href="/#upload"
                className="btn-accent"
                style={{ fontSize: "var(--text-base)" }}
              >
                Kolla ditt avtal
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
