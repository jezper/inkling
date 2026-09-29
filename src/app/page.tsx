import { Logo } from "@/components/logo";

/**
 * Avskedssida. Ersätter hela appen när tjänsten lagts ned.
 *
 * Tre frågor besvaras för den som ändå landar här: är den borta,
 * vad hände med mitt avtal, vart vänder jag mig istället.
 * Ingen interaktion, inga API-anrop, inget som kostar pengar.
 */
export default function Sunset() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background)",
        padding: "3rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: "34rem", width: "100%" }}>
        <div style={{ marginBottom: "2.5rem" }}>
          <Logo size="large" />
        </div>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: "var(--weight-bold)",
            color: "var(--color-text-primary)",
            letterSpacing: "var(--tracking-tight)",
            lineHeight: 1.15,
            marginBottom: "1.5rem",
          }}
        >
          Tjänsten är nedlagd
        </h1>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
            fontSize: "var(--text-lg)",
            lineHeight: 1.6,
            color: "var(--color-text-secondary)",
          }}
        >
          <p>
            Kolla Avtalet stängde i september 2026. Det går inte längre att
            ladda upp eller granska avtal här.
          </p>
          <p>
            Ditt avtal sparades aldrig. Analysen skedde i din webbläsare och
            ingenting lagrades hos oss, så det finns inget kvar att radera.
            Tillfälliga rapportlänkar har slutat gälla.
          </p>
          <p>
            Behöver du hjälp med ett anställningsavtal: hör av dig till ditt
            fackförbund eller en arbetsrättsjurist.
          </p>
        </div>

        <p
          style={{
            marginTop: "2.5rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid var(--border)",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
          }}
        >
          Frågor:{" "}
          <a
            href="mailto:hej@kollaavtalet.nu"
            style={{
              color: "var(--color-accent-600)",
              textDecoration: "underline",
              textUnderlineOffset: "0.2em",
            }}
          >
            hej@kollaavtalet.nu
          </a>
        </p>
      </div>
    </main>
  );
}
