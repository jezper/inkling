"use client";

import type { Helhetsbedömning } from "@/lib/analysis-types";

interface GaugeConfig {
  activeIndex: number; // 0 = bra, 1 = godkänt, 2 = risk
  label: string;
  activeColor: string;
  labelColor: string;
}

const SEGMENT_COLORS = [
  "var(--color-status-ok-border)",
  "var(--color-severity-medium-border)",
  "var(--color-severity-high-border)",
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
    <div style={{ textAlign: "center" }}>
      {/* Three-segment bar */}
      <div
        style={{
          display: "flex",
          gap: "2px",
          maxWidth: "300px",
          margin: "0 auto",
        }}
        role="img"
        aria-label={`Helhetsbedömning: ${config.label}`}
      >
        {SEGMENT_COLORS.map((color, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "12px",
              borderRadius:
                i === 0
                  ? "6px 0 0 6px"
                  : i === 2
                    ? "0 6px 6px 0"
                    : "0",
              backgroundColor:
                i === config.activeIndex
                  ? color
                  : "var(--color-surface-200)",
              transition: "background-color 0.2s ease",
            }}
          />
        ))}
      </div>

      {/* Label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: config.labelColor,
          marginTop: "0.75rem",
        }}
      >
        {config.label}
      </p>

      {/* Rubrik */}
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-lg)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.01em",
          marginTop: "0.25rem",
        }}
      >
        {assessment.rubrik}
      </p>

      {/* Beskrivning */}
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.6,
          maxWidth: "540px",
          margin: "0.5rem auto 0",
        }}
      >
        {assessment.beskrivning}
      </p>
    </div>
  );
}
