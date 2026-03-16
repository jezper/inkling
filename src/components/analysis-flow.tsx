"use client";

import { useState, useCallback, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { UploadStep } from "./upload-step";
import { stripPii } from "@/lib/pii-stripper";
import type { AnalysisResult } from "@/lib/analysis-types";

type FlowState = "upload" | "processing" | "consent" | "analyzing" | "result";

interface ParsedData {
  text: string;
  pageCount: number;
  fileName: string;
  usedOcr?: boolean;
}

export function AnalysisFlow() {
  const [state, setState] = useState<FlowState>("upload");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [strippedText, setStrippedText] = useState<string>("");
  const [piiCount, setPiiCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [previousResult, setPreviousResult] = useState<AnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Håller referens till pågående API-anrop så vi kan ignorera resultatet vid avbryt
  const [pendingAnalysis, setPendingAnalysis] = useState<AbortController | null>(null);

  // Kolla om användaren redan betalat (omgranskning)
  const isUnlocked = typeof window !== "undefined" && sessionStorage.getItem("ce_unlocked") === "true";

  const handleParsed = useCallback((result: ParsedData) => {
    setParsedData(result);
    setErrorMessage(null);
    try {
      const strip = stripPii(result.text);
      setStrippedText(strip.strippedText);
      setPiiCount(strip.piiCount);

      // Gå direkt till analyzing — consent visas i upload-steget redan
      setState("analyzing");

      const controller = new AbortController();
      setPendingAnalysis(controller);
      fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: strip.strippedText }),
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrorMessage(data.error);
            setState("upload");
            setPendingAnalysis(null);
            return;
          }
          setAnalysisResult(data.result);
          setPendingAnalysis(null);
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setErrorMessage("Kunde inte nå servern. Försök igen.");
          setState("upload");
          setPendingAnalysis(null);
        });
    } catch {
      setErrorMessage("Kunde inte bearbeta dokumentet. Prova en annan PDF.");
      setState("upload");
    }
  }, []);

  // Om vi väntar på svar och det kommer in → visa result eller redirecta
  useEffect(() => {
    if (state === "analyzing" && analysisResult) {
      // Om redan betald (omgranskning) → spara och gå till /rapport
      if (sessionStorage.getItem("ce_unlocked") === "true") {
        sessionStorage.setItem(
          "ce_analysis_result",
          JSON.stringify(analysisResult),
        );
        window.location.href = "/rapport";
        return;
      }
      setState("result");
    }
  }, [state, analysisResult]);


  const handleReset = useCallback(() => {
    if (pendingAnalysis) pendingAnalysis.abort();
    setPendingAnalysis(null);
    setState("upload");
    setParsedData(null);
    setStrippedText("");
    setPiiCount(0);
    setAnalysisResult(null);
    setPreviousResult(null);
    setErrorMessage(null);
    // Nytt avtal = ny betalning krävs
    sessionStorage.removeItem("ce_unlocked");
    sessionStorage.removeItem("ce_analysis_result");
    sessionStorage.removeItem("ce_previous_result");
  }, [pendingAnalysis]);

  // Omgranskning — sparar nuvarande resultat för jämförelse
  const handleReanalyze = useCallback(() => {
    if (analysisResult) setPreviousResult(analysisResult);
    if (pendingAnalysis) pendingAnalysis.abort();
    setPendingAnalysis(null);
    setState("upload");
    setParsedData(null);
    setStrippedText("");
    setPiiCount(0);
    setAnalysisResult(null);
    setErrorMessage(null);
  }, [analysisResult, pendingAnalysis]);

  return (
    <section
      id="upload"
      style={{
        backgroundColor: "var(--color-surface-0)",
        borderTop: "2px solid var(--color-text-primary)",
      }}
    >
      <div style={{ padding: "2rem 1rem 3rem", maxWidth: "800px", margin: "0 auto" }} className="analysis-flow-inner">

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.5rem",
              backgroundColor: "var(--color-severity-high-bg)",
              border: "1px solid var(--color-severity-high-border)",
              borderRadius: "var(--radius-md)",
            }}
          >
            <AlertCircle size={14} strokeWidth={2} aria-hidden="true" style={{ flexShrink: 0, marginTop: "0.15rem", color: "var(--color-severity-high-icon)" }} />
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-severity-high-text)", lineHeight: 1.5 }}>
              {errorMessage}
            </p>
          </div>
        )}

        {/* Upload */}
        {(state === "upload" || state === "processing") && (
          <>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.5rem" }}>
              Analys
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-2xl)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-primary)", lineHeight: 1.1 }}>
              Ladda upp avtalet
            </h2>
            <div style={{ marginTop: "1.5rem" }}>
              <UploadStep onParsed={handleParsed} onError={(msg) => { setErrorMessage(msg); setState("upload"); }} isProcessing={state === "processing"} />
            </div>
            {/* Consent-info visas innan man väljer fil */}
            <p style={{ marginTop: "1rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em", lineHeight: 1.6 }}>
              Dokumentet bearbetas i din webbläsare. Personuppgifter rensas automatiskt.
              Bara anonymiserad text skickas för analys och sparas inte efteråt.
            </p>
          </>
        )}

        {/* Analyzing — placeholder i flödet, overlay hanteras nedan */}
        {state === "analyzing" && <div />}

        {/* Result */}
        {state === "result" && analysisResult && (
          <ResultView result={analysisResult} previousResult={previousResult} onReset={handleReset} onReanalyze={handleReanalyze} />
        )}
      </div>

      {/* Fullskärmsoverlay under analys */}
      {state === "analyzing" && <AnalyzingOverlay />}
    </section>
  );
}

// -------------------------------------------------------------------
// Resultatvy
// ?unlock=dev i URL:en → visa betald vy direkt (dev-genväg)
// -------------------------------------------------------------------

function ResultView({ result, previousResult, onReset, onReanalyze }: {
  result: AnalysisResult;
  previousResult: AnalysisResult | null;
  onReset: () => void;
  onReanalyze: () => void;
}) {
  const isDevUnlock = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("unlock") === "dev";
  const [unlocked, setUnlocked] = useState(isDevUnlock);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [pageIdx, setPageIdx] = useState(0);
  const flags = result.flaggor;
  const highFlags = flags.filter(f => f.allvarlighet === "hög");
  const otherFlags = flags.filter(f => f.allvarlighet !== "hög");

  // Jämför mot föregående analys
  const prevTitles = new Set(previousResult?.flaggor.map(f => f.titel) ?? []);
  const currTitles = new Set(flags.map(f => f.titel));
  const resolvedFlags = previousResult?.flaggor.filter(f => !currTitles.has(f.titel)) ?? [];
  const newFlags = flags.filter(f => !prevTitles.has(f.titel));
  const isReanalysis = previousResult !== null;

  const sev = (s: string) =>
    s === "hög"
      ? { bg: "var(--color-severity-high-bg)", border: "var(--color-severity-high-border)", text: "var(--color-severity-high-text)", icon: "var(--color-severity-high-icon)" }
      : s === "medel"
      ? { bg: "var(--color-severity-medium-bg)", border: "var(--color-severity-medium-border)", text: "var(--color-severity-medium-text)", icon: "var(--color-severity-medium-icon)" }
      : { bg: "var(--color-severity-info-bg)", border: "var(--color-severity-info-border)", text: "var(--color-severity-info-text)", icon: "var(--color-severity-info-icon)" };

  // ====== GRATIS-VY ======
  if (!unlocked) {
    const highCount = flags.filter(f => f.allvarlighet === "hög").length;
    const medelCount = flags.filter(f => f.allvarlighet === "medel").length;
    const infoCount = flags.filter(f => f.allvarlighet === "info").length;

    // Bygg en sammanfattande rad
    const parts: string[] = [];
    if (highCount > 0) parts.push(`${highCount} punkt${highCount !== 1 ? "er" : ""} som bryter mot lag`);
    if (medelCount > 0) parts.push(`${medelCount} punkt${medelCount !== 1 ? "er" : ""} som avviker från praxis`);
    if (infoCount > 0) parts.push(`${infoCount} punkt${infoCount !== 1 ? "er" : ""} att känna till`);
    const summaryLine = parts.length > 0 ? `Vi hittade ${parts.join(", ")}.` : "Inga anmärkningar hittades.";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* Helhetsbedömning */}
        {result.helhetsbedömning && (
          <div style={{
            padding: "1.25rem",
            borderRadius: "var(--radius-lg)",
            border: `2px solid ${
              result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-border)"
              : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-border)"
              : "var(--color-surface-300)"
            }`,
            backgroundColor:
              result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-bg)"
              : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-bg)"
              : "var(--color-surface-0)",
          }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.5rem",
              color: result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-text)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-text)" : "var(--color-text-muted)",
            }}>
              {result.helhetsbedömning.nivå === "bra" ? "Ser bra ut" : result.helhetsbedömning.nivå === "risk" ? "Värt att granska noga" : "Några saker att notera"}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
              {result.helhetsbedömning.rubrik}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {result.helhetsbedömning.beskrivning}
            </p>
          </div>
        )}

        {/* Sammanfattande rad */}
        <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", lineHeight: 1.6 }}>
          {summaryLine}
        </p>

        {/* Paywall */}
        <div style={{ padding: "1.5rem", border: "2px solid var(--color-accent-500)", borderRadius: "var(--radius-lg)", backgroundColor: "var(--color-surface-0)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
            Full genomgång, 99 kr
          </p>
          <ul style={{ marginTop: "0.75rem", paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {[
              "Klartext för varje punkt, vad det faktiskt innebär för dig",
              "Vad som är standard och vad som sticker ut",
              "Jämförelse mot vad andra i din bransch har",
              "Frågor du kan ställa till arbetsgivaren",
              "Omgranskning om du förhandlar fram ett nytt utkast",
            ].map((item, i) => (
              <li key={i} style={{ fontSize: "var(--text-base)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <button
              className="btn-accent"
              style={{ padding: "0.85rem 2rem", fontSize: "var(--text-base)", opacity: checkoutLoading ? 0.7 : 1 }}
              disabled={checkoutLoading}
              onClick={async () => {
                setCheckoutLoading(true);
                try {
                  sessionStorage.setItem("ce_analysis_result", JSON.stringify(result));
                  if (previousResult) {
                    sessionStorage.setItem("ce_previous_result", JSON.stringify(previousResult));
                  }
                  const refToken = (() => { try { const r = localStorage.getItem("inkling_ref"); if (!r) return null; const p = JSON.parse(r); return Date.now() - p.ts < 72*3600000 ? p.token : null; } catch { return null; } })();
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ referralToken: refToken }),
                  });
                  const data = await res.json();
                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    setCheckoutLoading(false);
                  }
                } catch {
                  setCheckoutLoading(false);
                }
              }}
            >
              {checkoutLoading ? "Omdirigerar..." : "Lås upp rapporten"}
            </button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
              en gång, klart
            </span>
          </div>
        </div>

        <button onClick={onReset} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em", background: "none", border: "1px solid transparent", cursor: "pointer", padding: "0.5rem 0", textAlign: "left", minHeight: "44px" }}>
          Prova med ett annat avtal
        </button>

        <p style={{ marginTop: "0.75rem", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", color: "var(--color-text-muted)", lineHeight: 1.6, letterSpacing: "0.02em" }}>
          Information, inte juridisk rådgivning. Vid osäkerhet, kontakta ett fackförbund eller en arbetsrättsjurist.
        </p>
      </div>
    );
  }

  // ====== BETALD VY — paginerad rapport ======
  // Sidor: översikt → en per flagga → marknad+saknat → sammanfattning+ladda ner+omgranskning
  type Page = "overview" | "flag" | "market" | "summary";
  interface PageDef { type: Page; flagIndex?: number }

  const pages: PageDef[] = [
    { type: "overview" },
    ...flags.map((_, i) => ({ type: "flag" as Page, flagIndex: i })),
    ...(result.marknadsjämförelse?.length || result.saknade_villkor?.length ? [{ type: "market" as Page }] : []),
    { type: "summary" },
  ];

  const page = pages[pageIdx];
  const isFirst = pageIdx === 0;
  const isLast = pageIdx === pages.length - 1;

  const nav = (
    <nav aria-label="Rapportnavigering" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid var(--color-surface-200)" }}>
      <button
        onClick={() => setPageIdx(p => Math.max(0, p - 1))}
        disabled={isFirst}
        aria-label="Föregående sida"
        style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: isFirst ? "var(--color-surface-400)" : "var(--color-text-muted)", background: "none", border: "none", cursor: isFirst ? "default" : "pointer", letterSpacing: "0.04em", minHeight: "44px", minWidth: "44px" }}
      >
        ← Föregående
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}
      >
        <span className="sr-only">Sida </span>{pageIdx + 1}<span className="sr-only"> av </span><span aria-hidden="true"> / </span>{pages.length}
      </span>
      {!isLast ? (
        <button
          onClick={() => setPageIdx(p => Math.min(pages.length - 1, p + 1))}
          aria-label="Nästa sida"
          className="btn-accent"
          style={{ padding: "0.5rem 1.25rem", fontSize: "var(--text-sm)", minHeight: "44px" }}
        >
          Nästa →
        </button>
      ) : (
        <span />
      )}
    </nav>
  );

  // -- Översiktssida --
  if (page.type === "overview") {
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ borderBottom: "2px solid var(--color-text-primary)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
            inkling · Avtalsrapport · {new Date().toLocaleDateString("sv-SE")}
          </p>
        </div>

        {result.helhetsbedömning && (
          <div style={{
            padding: "1.25rem", borderRadius: "var(--radius-lg)", marginBottom: "1.5rem",
            border: `2px solid ${result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-border)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-border)" : "var(--color-surface-300)"}`,
            backgroundColor: result.helhetsbedömning.nivå === "bra" ? "var(--color-status-ok-bg)" : result.helhetsbedömning.nivå === "risk" ? "var(--color-severity-high-bg)" : "var(--color-surface-0)",
          }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
              {result.helhetsbedömning.rubrik}
            </p>
            <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              {result.helhetsbedömning.beskrivning}
            </p>
          </div>
        )}

        {/* Jämförelse mot föregående vid omgranskning */}
        {isReanalysis && (
          <div style={{ padding: "1rem", border: "1px solid var(--color-surface-200)", borderRadius: "var(--radius-lg)", marginBottom: "1rem" }}>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
              Jämfört med förra versionen
            </p>
            {resolvedFlags.length > 0 && (
              <div style={{ marginBottom: "0.75rem" }}>
                {resolvedFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-status-ok-text)", letterSpacing: "0.04em" }}>LÖST</span>
                    <span style={{ fontSize: "var(--text-base)", color: "var(--color-text-muted)", textDecoration: "line-through" }}>{f.titel}</span>
                  </div>
                ))}
              </div>
            )}
            {newFlags.length > 0 && (
              <div>
                {newFlags.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.375rem 0" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-severity-medium-text)", letterSpacing: "0.04em" }}>NY</span>
                    <span style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}>{f.titel}</span>
                  </div>
                ))}
              </div>
            )}
            {resolvedFlags.length === 0 && newFlags.length === 0 && (
              <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-muted)" }}>
                Samma punkter som förra versionen. Inga ändringar hittades.
              </p>
            )}
          </div>
        )}

        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "0.75rem" }}>
          {flags.length} punkt{flags.length !== 1 ? "er" : ""} i denna version
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {flags.map((flag, i) => {
            const c = sev(flag.allvarlighet);
            const isNew = isReanalysis && newFlags.some(f => f.titel === flag.titel);
            return (
              <button
                key={i}
                onClick={() => setPageIdx(i + 1)}
                aria-label={`Visa detaljer för: ${flag.titel} (${flag.allvarlighet})`}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  padding: "0.75rem 0", minHeight: "44px",
                  borderTop: "none", borderLeft: "none", borderRight: "none",
                  borderBottom: i < flags.length - 1 ? "1px solid var(--color-surface-200)" : "none",
                  background: "none", cursor: "pointer", textAlign: "left", width: "100%",
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, color: c.icon, textTransform: "uppercase", letterSpacing: "0.04em", width: "3.5rem", flexShrink: 0 }}>
                  {flag.allvarlighet}
                </span>
                <span style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}>
                  {flag.titel}
                </span>
                {isNew && (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-severity-medium-text)", letterSpacing: "0.04em", marginLeft: "auto" }}>NY</span>
                )}
              </button>
            );
          })}
        </div>
        {nav}
      </div>
    );
  }

  // -- Flagga-sida --
  if (page.type === "flag" && page.flagIndex !== undefined) {
    const flag = flags[page.flagIndex];
    return (
      <div style={{ display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1.5rem" }}>
          Punkt {page.flagIndex + 1} av {flags.length}
        </p>
        <FullFlagCard flag={flag} />
        {nav}
      </div>
    );
  }

  // -- Marknad + saknade villkor --
  if (page.type === "market") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {result.marknadsjämförelse && result.marknadsjämförelse.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              Ditt avtal vs marknaden
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {result.marknadsjämförelse.map((mj, i) => (
                <div key={i} style={{ padding: "1rem", border: "1px solid var(--color-surface-200)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.75rem" }}>{mj.villkor}</p>
                  <div className="comparison-grid-2col">
                    <div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Ditt avtal</p>
                      <p style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)" }}>{mj.avtalets_värde}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Vanligt bland {mj.benchmark_kategori}</p>
                      <p style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)" }}>{mj.benchmark_värde}</p>
                    </div>
                  </div>
                  <p style={{ marginTop: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>Källa: {mj.benchmark_källa}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {result.saknade_villkor && result.saknade_villkor.length > 0 && (
          <div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)", marginBottom: "1rem" }}>
              Saknas i avtalet
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {result.saknade_villkor.map((sv, i) => (
                <div key={i} style={{ padding: "1rem", border: "1px solid var(--color-surface-200)", borderRadius: "var(--radius-md)" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--color-text-primary)" }}>{sv.villkor}</p>
                  <p style={{ marginTop: "0.375rem", fontSize: "var(--text-base)", color: "var(--color-text-muted)", lineHeight: 1.5 }}>{sv.relevans}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {nav}
      </div>
    );
  }

  // -- Sammanfattning + ladda ner + omgranskning --
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div style={{ borderBottom: "2px solid var(--color-text-primary)", paddingBottom: "1rem" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-muted)" }}>
          Sammanfattning
        </p>
        <p style={{ marginTop: "0.75rem", fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
          {result.helhetsbedömning?.rubrik ?? "Analys klar"}
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          {result.sammanfattning}
        </p>
      </div>

      {/* Ladda ner PDF — placeholder för steg 9 */}
      <button
        className="btn-accent"
        style={{ padding: "0.85rem 2rem", fontSize: "var(--text-base)", alignSelf: "flex-start" }}
        onClick={() => alert("PDF-export byggs i steg 9.")}
      >
        Ladda ner rapport som PDF
      </button>

      {/* Omgranskning */}
      <div style={{ padding: "1.25rem", border: "1px solid var(--color-surface-200)", borderRadius: "var(--radius-lg)" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
          Fått ett reviderat avtal?
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          Ladda upp det nya avtalet så granskar vi det utan extra kostnad. Du får se exakt vad som ändrats.
        </p>
        <button
          onClick={onReanalyze}
          style={{
            marginTop: "1rem",
            padding: "0.7rem 1.5rem",
            fontSize: "var(--text-sm)",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            color: "var(--color-text-primary)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-text-primary)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          Ladda upp nytt utkast
        </button>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: "1rem", borderTop: "1px solid var(--color-surface-200)" }}>
        <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.6 }}>
          Det här är information, inte juridisk rådgivning. Analysen jämför mot LAS, Semesterlagen,
          Arbetstidslagen, Diskrimineringslagen och Föräldraledighetslagen. Kollektivavtal ingår inte.
          Vid osäkerhet, kontakta ett fackförbund eller en arbetsrättsjurist.
        </p>
      </div>

      <button onClick={() => setPageIdx(0)} style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", background: "none", border: "1px solid transparent", cursor: "pointer", padding: "0.5rem 0", textAlign: "left", minHeight: "44px" }}>
        ← Tillbaka till översikt
      </button>
    </div>
  );
}

// Analyzing overlay med roterande statusrader
function AnalyzingOverlay() {
  const steps = [
    "Läser avtalstext",
    "Identifierar anställningsform",
    "Kontrollerar uppsägningstider mot LAS §11",
    "Granskar provanställningsvillkor",
    "Letar efter konkurrensklausuler",
    "Bedömer sekretessvillkor",
    "Kontrollerar arbetstid mot Arbetstidslagen",
    "Jämför semestervillkor mot Semesterlagen",
    "Jämför mot marknadspraxis",
    "Söker efter saknade standardvillkor",
    "Skriver klartext för varje punkt",
    "Formulerar frågor att ställa",
    "Sammanställer rapport",
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="analyzing-heading"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(245, 245, 247, 0.97)",
      }}
    >
      <div style={{ width: "240px", height: "2px", backgroundColor: "var(--color-surface-200)", borderRadius: "var(--radius-full)", overflow: "hidden" }} aria-hidden="true">
        <div style={{ height: "100%", backgroundColor: "var(--color-accent-500)", width: "60%", animation: "slideProgress 1.8s ease-in-out infinite" }} />
      </div>

      <p id="analyzing-heading" style={{ marginTop: "2rem", fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)" }}>
        Analyserar ditt avtal
      </p>

      <p
        key={currentStep}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          marginTop: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-muted)",
          letterSpacing: "0.04em",
          animation: "fadeStep 2.8s ease-in-out",
          minHeight: "1.25rem",
        }}
      >
        {steps[currentStep]}
      </p>

      <style>{`
        @keyframes slideProgress { 0% { transform: translateX(-100%); } 50% { transform: translateX(0%); } 100% { transform: translateX(200%); } }
        @keyframes fadeStep { 0% { opacity: 0; transform: translateY(4px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-4px); } }
        @media (prefers-reduced-motion: reduce) {
          @keyframes slideProgress { 0%, 100% { transform: none; opacity: 1; } 50% { opacity: 0.5; } }
          @keyframes fadeStep { 0%, 100% { opacity: 1; transform: none; } }
        }
      `}</style>
    </div>
  );
}

// Full flagga-kort (betald vy)
function FullFlagCard({ flag }: { flag: AnalysisResult["flaggor"][0] }) {
  const c = flag.allvarlighet === "hög"
    ? { bg: "var(--color-severity-high-bg)", border: "var(--color-severity-high-border)", text: "var(--color-severity-high-text)", icon: "var(--color-severity-high-icon)" }
    : flag.allvarlighet === "medel"
    ? { bg: "var(--color-severity-medium-bg)", border: "var(--color-severity-medium-border)", text: "var(--color-severity-medium-text)", icon: "var(--color-severity-medium-icon)" }
    : { bg: "var(--color-severity-info-bg)", border: "var(--color-severity-info-border)", text: "var(--color-severity-info-text)", icon: "var(--color-severity-info-icon)" };

  return (
    <div style={{ padding: "1.25rem", border: `1px solid ${c.border}`, backgroundColor: c.bg, borderRadius: "var(--radius-lg)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 600, color: c.icon, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {flag.allvarlighet}
        </span>
        <span style={{ color: "var(--color-surface-300)", fontSize: "var(--text-xs)" }}>·</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
          {flag.kategori}
        </span>
        {flag.benchmark_avvikelse && (
          <>
            <span style={{ color: "var(--color-surface-300)", fontSize: "var(--text-xs)" }}>·</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-accent-text)", letterSpacing: "0.04em" }}>
              avviker från marknad
            </span>
          </>
        )}
      </div>

      <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-lg)", fontWeight: 600, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
        {flag.titel}
      </p>

      <p style={{ marginTop: "0.5rem", fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        {flag.klartext}
      </p>

      {/* Avtal vs lag */}
      {(flag.avtalets_text || flag.lagens_krav) && (
        <div className="comparison-grid-2col" style={{ marginTop: "1rem" }}>
          {flag.avtalets_text && (
            <div style={{ padding: "0.75rem", backgroundColor: "var(--color-surface-0)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-200)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.375rem" }}>
                Avtalet säger
              </p>
              <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                {flag.avtalets_text}
              </p>
            </div>
          )}
          {flag.lagens_krav && (
            <div style={{ padding: "0.75rem", backgroundColor: "var(--color-surface-0)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-200)" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-text-muted)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.375rem" }}>
                Lagen anger
              </p>
              <p style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", lineHeight: 1.5 }}>
                {flag.lagens_krav}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Frågor att ställa */}
      {flag.frågor_att_ställa && flag.frågor_att_ställa.length > 0 && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "var(--color-surface-0)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-surface-200)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 500, color: "var(--color-accent-text)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            Frågor att ställa
          </p>
          <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.375rem" }}>
            {flag.frågor_att_ställa.map((q, qi) => (
              <li key={qi} style={{ fontSize: "var(--text-base)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lagrum */}
      <p style={{ marginTop: "0.75rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: c.text, letterSpacing: "0.02em" }}>
        {flag.lagrum}
      </p>
    </div>
  );
}
