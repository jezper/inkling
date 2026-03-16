import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-foreground-heading px-4 py-12 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-8 sm:grid-cols-2 lg:flex lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div>
          <p className="text-xs leading-relaxed text-foreground-muted" style={{ maxWidth: "20rem" }}>
            Information, inte juridisk rådgivning. Vi jämför avtalstext
            mot lag, men ersätter inte en jurist.
          </p>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          <p
            style={{
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            Regler
          </p>
          <div className="flex flex-col gap-1.5">
            <a href="/regler/las" className="transition-colors duration-100" style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}>
              LAS
            </a>
            <a href="/regler/provanstallning" className="transition-colors duration-100" style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}>
              Provanställning
            </a>
          </div>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          <p
            style={{
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.5rem",
            }}
          >
            Guider
          </p>
          <div className="flex flex-col gap-1.5">
            <a href="/guide/konkurrensklausul" className="transition-colors duration-100" style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}>
              Konkurrensklausul
            </a>
            <a href="/guide/uppsagningstid" className="transition-colors duration-100" style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}>
              Uppsägningstid
            </a>
            <a href="/guide/granska-anstallningsavtal" className="transition-colors duration-100" style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}>
              Granska ditt avtal
            </a>
          </div>
        </div>

        <div
          className="flex flex-col gap-2 lg:text-right"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.04em",
          }}
        >
          <a
            href="/faq"
            className="transition-colors duration-100"
            style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}
          >
            Vanliga frågor
          </a>
          <a
            href="/kallor"
            className="transition-colors duration-100"
            style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}
          >
            Källor
          </a>
          <a
            href="/integritetspolicy"
            className="transition-colors duration-100"
            style={{ textDecorationLine: "underline", textUnderlineOffset: "3px" }}
          >
            Integritetspolicy
          </a>
          <span>&copy; {new Date().getFullYear()} Kolla Avtalet</span>
        </div>
      </div>
    </footer>
  );
}
