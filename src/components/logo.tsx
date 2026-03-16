/**
 * Logo — Kolla Avtalet
 *
 * Variant: slash-separator
 *
 * "kolla" i medium weight — verbet, instruktionen, lätt
 * "/" i krimson-accent — separator, Bloomberg Terminal-känsla
 * "avtalet" i bold — substantivet, det viktiga, tungt
 *
 * Hierarkin är avsiktlig: tyngden sitter på vad som granskas,
 * inte på uppmaningen. Slash löser ordgränsen utan punkt-separator
 * (som förvirrar med kollaavtalet.com) och utan versalklumpighet.
 *
 * Varianter (se nedan som kommentarer) valdes bort:
 *   – Versalkontrast "KOLLA avtalet": läser som akronym, för skriket
 *   – Tvåfärg "KollaAvtalet" camelCase: svår att läsa vid 15px
 *   – Gemener utan separator: ett ord, ingen gräns
 */

export function Logo({
  className = "",
  size = "default",
}: {
  className?: string;
  size?: "default" | "large";
}) {
  const fontSize = size === "large" ? "clamp(1.5rem, 3.5vw, 2.25rem)" : "1.125rem";

  return (
    <span
      className={`select-none ${className}`}
      aria-label="Kolla Avtalet"
      style={{
        fontFamily: "var(--font-display)",
        fontSize,
        lineHeight: 1,
        letterSpacing: "-0.02em",
      }}
    >
      {/* "kolla" — regular weight, understated */}
      <span
        style={{
          fontWeight: 400,
          color: "var(--color-text-muted)",
        }}
      >
        kolla
      </span>

      {/* "/" — accent, dramatisk signal */}
      <span
        style={{
          fontWeight: 700,
          color: "var(--color-accent-500)",
          margin: "0 0.02em",
        }}
      >
        /
      </span>

      {/* "avtalet" — bold, tungt, det viktiga */}
      <span
        style={{
          fontWeight: 700,
          color: "var(--color-text-primary)",
        }}
      >
        avtalet
      </span>
    </span>
  );
}

/*
 * ─── ÖVERVÄGDA VARIANTER ──────────────────────────────────────────────────────
 *
 * Variant A — Versalkontrast (valdes bort)
 * ─────────────────────────────────────────
 * <span style={{ fontWeight: 800, letterSpacing: "0.08em", color: "var(--color-text-primary)" }}>
 *   KOLLA
 * </span>
 * <span style={{ fontWeight: 400, letterSpacing: "0.04em", color: "var(--color-accent-text)" }}>
 *   {" "}avtalet
 * </span>
 *
 * Problem: versaler i 15px läser som ett förkortnings-akronym, inte ett verb.
 * "KOLLA" associerar med en myndighets-varning, inte med en tjänst.
 * Funkar bättre i stor display (hero) men inte som header-identitet.
 *
 *
 * Variant B — Bold/Regular tvåfärg utan separator (nuläget + liten justering)
 * ──────────────────────────────────────────────────────────────────────────────
 * Kolla<span style={{ color: "var(--color-accent-text)" }}>Avtalet</span>
 *
 * Problem: ord-gränsen är osynlig vid hastig blick i 15px.
 * CamelCase-känslan passar inte systemet (Space Grotesk är geometrisk, inte kodtypografi).
 * Fungerar men utnyttjar inte designsystemets identitetspotential.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
