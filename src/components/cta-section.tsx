import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative px-6 py-20 sm:py-28">
      {/* Accent glow behind */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-64 w-64 rounded-full bg-accent-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground-heading sm:text-4xl">
          Redo att förstå ditt avtal?
        </h2>
        <p className="mt-4 text-base text-foreground-muted">
          Det tar ungefär en minut och kostar ingenting att prova.
        </p>
        <a
          href="#upload"
          className="group mt-8 inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-base font-semibold text-white shadow-accent-md transition-all duration-200 hover:shadow-accent-lg hover:-translate-y-0.5"
          style={{ background: "var(--gradient-accent)" }}
        >
          Granska mitt avtal
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}
