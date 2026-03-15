import {
  Briefcase,
  CalendarDays,
  Clock,
  FileWarning,
  Lock,
  Scale,
  Timer,
  Coins,
} from "lucide-react";

const items = [
  { icon: Briefcase, label: "Anställningsform" },
  { icon: CalendarDays, label: "Provanställning" },
  { icon: Clock, label: "Uppsägningstid" },
  { icon: FileWarning, label: "Konkurrensklausul" },
  { icon: Scale, label: "Semester och ledighet" },
  { icon: Timer, label: "Arbetstid" },
  { icon: Lock, label: "Sekretess" },
  { icon: Coins, label: "Lön och förmåner" },
] as const;

export function AnalysisCovers() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-medium uppercase tracking-wider text-accent-400">
          Omfattning
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground-heading sm:text-4xl">
          Det här tittar analysen på
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground-muted">
          Analysen jämför ditt avtal mot LAS, Semesterlagen, Arbetstidslagen
          och tre andra lagar som styr vad ett anställningsavtal får innehålla.
        </p>

        {/* Bento-style grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="glass group flex flex-col items-start gap-3 rounded-xl p-5 transition-all duration-200 hover:border-accent-500/20 hover:-translate-y-0.5"
            >
              <item.icon
                className="h-5 w-5 text-foreground-subtle transition-colors duration-200 group-hover:text-accent-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-foreground-heading">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
