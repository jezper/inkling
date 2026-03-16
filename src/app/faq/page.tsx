import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FaqContent } from "./faq-content";

// ---------------------------------------------------------------------------
// SEO metadata (title ≤60, description ≤155)
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: "Vanliga frågor | Kolla Avtalet",
  description:
    "Hur fungerar avtalgranskningen? Sparas mitt avtal? Vad ingår? Svar på det viktigaste om Kolla Avtalet.",
};

// ---------------------------------------------------------------------------
// Page — server component
// ---------------------------------------------------------------------------

export default function FaqPage() {
  return (
    <>
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

          {/* Accordion sections — client component */}
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
