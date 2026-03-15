import { Shield, UserX, Scale } from "lucide-react";

const points = [
  {
    icon: Shield,
    title: "Dokumentet stannar hos dig",
    description:
      "Avtalet bearbetas direkt i din webbläsare. Det lämnar aldrig din enhet och lagras ingenstans.",
  },
  {
    icon: UserX,
    title: "Inget konto behövs",
    description:
      "Ladda upp, få analys, gå vidare. Ingen e-postadress, inget lösenord, ingen prenumeration att glömma bort att avsluta.",
  },
  {
    icon: Scale,
    title: "Information, inte juridik",
    description:
      "Vi jämför ditt avtal mot vad lagen faktiskt anger — och visar vad som stämmer, vad som avviker och var du kan läsa mer.",
  },
] as const;

export function Trust() {
  return (
    <section className="px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
        {points.map((point, i) => (
          <div
            key={i}
            className="glass-accent group rounded-xl p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-accent-sm"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10">
              <point.icon
                className="h-5 w-5 text-accent-400"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
            <h3 className="mt-4 text-base font-semibold text-foreground-heading">
              {point.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              {point.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
