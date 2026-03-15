import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-background-deep px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36">
      <div className="mx-auto w-full max-w-2xl text-center">
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.05em",
            color: "var(--color-text-primary)",
          }}
        >
          Grattis till jobbet.
          <br />
          <span style={{ color: "var(--color-accent-text)" }}>Vet du vad du tackar ja till?</span>
        </h1>

        <p
          className="mx-auto mt-7 leading-relaxed text-foreground-muted"
          style={{ maxWidth: "480px", fontSize: "var(--text-base)" }}
        >
          Konkurrensförbud, övertidsklausuler, uppsägningstider — det
          som avgör dina villkor de kommande åren gömmer sig i
          finstilt. Vi jämför varje punkt mot lag, marknadspraxis och
          lönedata för din yrkesgrupp.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <a
            href="#upload"
            className="btn-accent group"
            style={{ padding: "0.9rem 2rem", fontSize: "var(--text-base)" }}
          >
            Kolla ditt avtal
            <ArrowRight
              className="h-5 w-5 transition-transform duration-100 group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </a>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.04em",
            }}
          >
            din fil stannar hos dig · inga uppgifter lagras
          </span>
        </div>

        {/* Pris — sekventiellt flöde, inte pricing tiers */}
        <div
          className="mt-12 mx-auto"
          style={{ maxWidth: "540px", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}
        >
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
            }}
            className="hero-price-grid"
          >
            {/* Steg 1 — alltid gratis */}
            <div style={{ padding: "1.25rem 1.5rem" }} className="text-left">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: "0.5rem",
                }}
              >
                01 · Alltid gratis
              </p>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-2xl)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Snabbkoll
              </p>
              <p className="text-sm leading-snug text-foreground-muted">
                Sammanfattning och helhetsbedömning
              </p>
            </div>

            {/* Separator — pil */}
            <div
              className="hero-price-separator"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 0.5rem",
                borderLeft: "1px solid var(--border)",
                borderRight: "1px solid var(--border)",
              }}
              aria-hidden="true"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                style={{ color: "var(--color-text-subtle)", flexShrink: 0 }}
              >
                <path
                  d="M1 6h10M7 2l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                />
              </svg>
            </div>

            {/* Steg 2 — full rapport */}
            <div style={{ padding: "1.25rem 1.5rem" }} className="text-left">
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--color-accent-text)",
                  marginBottom: "0.5rem",
                }}
              >
                02 · Full rapport
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--color-text-primary)",
                  }}
                >
                  99 kr
                </p>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                  }}
                >
                  en gång, klart
                </span>
              </div>
              <p className="text-sm leading-snug text-foreground-muted">
                Vad som är rimligt, vad som sticker ut och varför. Omgranskning ingår.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
