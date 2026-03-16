"use client";

import { ShieldCheck, FileSearch, ArrowRight } from "lucide-react";
import type { StripResult } from "@/lib/pii-stripper";

export interface ConsentStepProps {
  fileName: string;
  pageCount: number;
  stripResult: StripResult;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Mappar displayName (från pii-stripper) till läsbar label */
function formatPiiType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

export function ConsentStep({
  fileName,
  pageCount,
  stripResult,
  onConfirm,
  onCancel,
}: ConsentStepProps) {
  const { piiCount, piiTypes } = stripResult;
  const noPii = piiCount === 0;

  return (
    <div style={{ maxWidth: "680px" }}>
      {/* Fil-info */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          padding: "0.75rem 1rem",
          backgroundColor: "var(--color-surface-0)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          marginBottom: "1.5rem",
        }}
      >
        <FileSearch
          size={20}
          strokeWidth={1.5}
          aria-hidden="true"
          style={{ flexShrink: 0, color: "var(--color-accent-500)" }}
        />
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-sm)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {fileName}
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-subtle)",
              letterSpacing: "0.04em",
              marginTop: "0.125rem",
            }}
          >
            {pageCount} {pageCount === 1 ? "sida" : "sidor"}
          </p>
        </div>
      </div>

      {/* Rubrik */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--color-text-primary)",
          marginBottom: "0.5rem",
        }}
      >
        Innan vi kör igång
      </h2>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
          marginBottom: "1.5rem",
        }}
      >
        Avtalet bearbetas i din webbläsare. Personuppgifter rensas automatiskt
        och ingenting lagras.
      </p>

      {/* PII-sammanfattning */}
      <div
        role="region"
        aria-label="Sammanfattning av borttagna personuppgifter"
        style={{
          padding: "1.25rem",
          backgroundColor: noPii
            ? "var(--color-surface-50)"
            : "var(--color-severity-info-bg)",
          border: `1px solid ${
            noPii
              ? "var(--color-border)"
              : "var(--color-severity-info-border)"
          }`,
          borderRadius: "var(--radius-md)",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
          }}
        >
          <ShieldCheck
            size={20}
            strokeWidth={1.5}
            aria-hidden="true"
            style={{
              flexShrink: 0,
              marginTop: "0.1rem",
              color: noPii
                ? "var(--color-surface-400)"
                : "var(--color-severity-info-icon)",
            }}
          />
          <div>
            {noPii ? (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  0 personuppgifter hittades, dubbelkolla gärna
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-muted)",
                    lineHeight: 1.5,
                    marginTop: "0.25rem",
                  }}
                >
                  Vi skickar avtalstexten utan namn eller kontaktuppgifter för
                  analys. Texten sparas inte efter att svaret returnerats.
                </p>
              </>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 600,
                    color: "var(--color-severity-info-text)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {piiCount} personuppgift{piiCount !== 1 ? "er" : ""} borttagen
                  {piiCount !== 1 ? "a" : ""}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--color-severity-info-text)",
                    lineHeight: 1.5,
                    marginTop: "0.25rem",
                    opacity: 0.85,
                  }}
                >
                  Vi skickar enbart avtalstexten, utan de uppgifter som listats
                  nedan, för analys. Texten sparas inte efter att svaret returnerats.
                </p>

                {/* Typlista */}
                {piiTypes.length > 0 && (
                  <ul
                    aria-label="Typer av borttagna personuppgifter"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.375rem",
                      marginTop: "0.75rem",
                      listStyle: "none",
                      padding: 0,
                    }}
                  >
                    {piiTypes.map((type) => (
                      <li key={type}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.2rem 0.5rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            letterSpacing: "0.04em",
                            color: "var(--color-severity-info-text)",
                            backgroundColor: "var(--color-severity-info-bg)",
                            border: "1px solid var(--color-severity-info-border)",
                            borderRadius: "var(--radius-xs)",
                          }}
                        >
                          {formatPiiType(type)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Detaljer */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-sm)",
          color: "var(--color-text-subtle)",
          lineHeight: 1.6,
          marginBottom: "2rem",
        }}
      >
        Det här är en informationsanalys. Den citerar vad lagen anger och vad
        avtalet anger. Dra inga juridiska slutsatser utan att rådgöra med en
        jurist om du är osäker.
      </p>

      {/* Knappar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={onConfirm}
          className="btn-accent group"
        >
          Jag förstår, starta analysen
          <ArrowRight
            size={16}
            strokeWidth={2.5}
            aria-hidden="true"
            className="transition-transform duration-100 group-hover:translate-x-0.5"
          />
        </button>

        <button
          type="button"
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-subtle)",
            letterSpacing: "0.04em",
            cursor: "pointer",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}
