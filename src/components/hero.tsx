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
          Konkurrensförbud, övertidsklausuler, uppsägningstider. Det
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
            snabbkoll gratis · full rapport 99 kr
          </span>
        </div>
      </div>
    </section>
  );
}
