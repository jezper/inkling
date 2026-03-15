export function HowItWorks() {
  return (
    <section className="border-t-2 border-foreground-heading px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <h2
          className="text-center"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",  /* #47474F — 8.5:1 på surface-50, AAA */
          }}
        >
          Process
        </h2>

        <div className="mt-12 grid gap-0 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Du laddar upp",
              desc: "Ditt avtal läses direkt i webbläsaren. Namn och personnummer rensas automatiskt. Ingenting lämnar din enhet.",
            },
            {
              n: "02",
              title: "Vi dissekerar",
              desc: "Varje klausul jämförs mot lag och marknadspraxis. Du ser vad som är standard, vad som avviker och vad allt faktiskt betyder i klartext.",
            },
            {
              n: "03",
              title: "Du äger bilden",
              desc: "Ingen rådgivning, bara fakta. Vad som står, vad lagen säger, vad marknaden gör. Resten är upp till dig.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="border-t border-border-strong py-8 sm:border-l sm:border-t-0 sm:py-0 sm:pl-8 sm:pr-6 first:border-t-0 sm:first:border-l-0 sm:first:pl-0"
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  letterSpacing: "0.10em",
                  color: "var(--color-accent-text)",  /* #A82E14 — 7.1:1 på surface-50, AAA */
                }}
              >
                {step.n}
              </span>
              <h3
                className="mt-3"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary)",
                }}
              >
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-foreground-muted">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
