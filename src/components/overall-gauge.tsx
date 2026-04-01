"use client";

import type { Helhetsbedömning } from "@/lib/analysis-types";

interface GaugeConfig {
  activeIndex: number; // 0 = bra, 1 = godkänt, 2 = risk
  label: string;
  activeColor: string;
  labelColor: string;
}

const SEGMENTS = [
  { color: "var(--color-status-ok-border)", label: "Bra" },
  { color: "var(--color-severity-medium-border)", label: "Notera" },
  { color: "var(--color-severity-high-border)", label: "Risk" },
];

export function getGaugeConfig(nivå: Helhetsbedömning["nivå"]): GaugeConfig {
  switch (nivå) {
    case "bra":
      return {
        activeIndex: 0,
        label: "Ser bra ut",
        activeColor: "var(--color-status-ok-border)",
        labelColor: "var(--color-status-ok-text)",
      };
    case "godkänt":
      return {
        activeIndex: 1,
        label: "Några saker att notera",
        activeColor: "var(--color-severity-medium-border)",
        labelColor: "var(--color-severity-medium-text)",
      };
    case "risk":
      return {
        activeIndex: 2,
        label: "Värt att granska noga",
        activeColor: "var(--color-severity-high-border)",
        labelColor: "var(--color-severity-high-text)",
      };
  }
}

export function OverallGauge({ assessment }: { assessment: Helhetsbedömning }) {
  const config = getGaugeConfig(assessment.nivå);

  return (
    <div>
      {/* Three-segment bar with labels */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          maxWidth: "320px",
        }}
        role="img"
        aria-label={`Helhetsbedömning: ${config.label}`}
      >
        {SEGMENTS.map((seg, i) => {
          const isActive = i === config.activeIndex;
          return (
            <div key={i} style={{ flex: 1 }}>
              <div
                style={{
                  height: "10px",
                  borderRadius:
                    i === 0
                      ? "5px 0 0 5px"
                      : i === 2
                        ? "0 5px 5px 0"
                        : "0",
                  backgroundColor: isActive
                    ? seg.color
                    : "var(--color-surface-200)",
                  transition: "background-color 0.2s ease",
                }}
              />
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6875rem",
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: isActive ? config.labelColor : "var(--color-text-subtle)",
                  marginTop: "0.375rem",
                  textAlign: "center",
                }}
              >
                {seg.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Rubrik */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.01em",
          marginTop: "0.75rem",
        }}
      >
        {assessment.rubrik}
      </p>

      {/* Beskrivning */}
      <p
        style={{
          marginTop: "0.375rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
        }}
      >
        {assessment.beskrivning}
      </p>
    </div>
  );
}
