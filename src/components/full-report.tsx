"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Copy,
  Check,
  Download,
  UploadCloud,
  Link2,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MessageCircle,
  ClipboardCheck,
  Bookmark,
  ExternalLink,
} from "lucide-react";
import type { AnalysisResult, Flagga, NästaSteg } from "@/lib/analysis-types";
import { getRelevantResources, type Resource } from "@/lib/resources";
import { parseLagrum } from "@/lib/lagrum-links";
import { ReferralShare } from "./referral-share";

interface FullReportProps {
  result?: AnalysisResult;
  previousResult?: AnalysisResult | null;
  expiresAt?: number;
  token?: string;
  sessionId?: string;
  cancelled?: boolean;
}

export function FullReport({
  result: serverResult,
  previousResult: serverPrev,
  expiresAt,
  token,
  sessionId,
  cancelled,
}: FullReportProps) {
  const [data, setData] = useState<AnalysisResult | null>(serverResult ?? null);
  const [prevData, setPrevData] = useState<AnalysisResult | null>(
    serverPrev ?? null,
  );
  const [shareUrl, setShareUrl] = useState<string | null>(
    token
      ? `${typeof window !== "undefined" ? window.location.origin : ""}/rapport?t=${token}`
      : null,
  );
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!serverResult);
  const [referralToken, setReferralToken] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // Verifiera betalning via session_id, eller läs från sessionStorage
  useEffect(() => {
    if (serverResult) return; // redan dekrypterad via token

    const restoreFromStorage = () => {
      const stored = sessionStorage.getItem("ce_analysis_result");
      if (stored) {
        try {
          setData(JSON.parse(stored));
          const prevStored = sessionStorage.getItem("ce_previous_result");
          if (prevStored) setPrevData(JSON.parse(prevStored));
        } catch {
          /* corrupt data */
        }
      }
    };

    const cleanUrl = () => {
      const url = new URL(window.location.href);
      url.searchParams.delete("session_id");
      url.searchParams.delete("cancelled");
      window.history.replaceState({}, "", url.pathname);
    };

    if (sessionId) {
      // Verifiera betalning server-side
      fetch(`/api/checkout/verify?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => res.json())
        .then((result) => {
          if (result.paid) {
            sessionStorage.setItem("ce_unlocked", "true");
            restoreFromStorage();
            const stored = sessionStorage.getItem("ce_analysis_result");
            if (!stored) {
              setError(
                "Betalningen gick igenom men analysresultatet kunde inte hittas. Det kan hända om du öppnade länken i en ny flik. Ladda upp avtalet igen, det kostar inget extra.",
              );
            } else if (result.email) {
              // Auto-skicka rapport till Stripes kundmail
              fetch("/api/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: result.email, result: JSON.parse(stored) }),
              }).catch(() => {}); // tyst fel — rapporten visas ändå
              setEmailSent(result.email);
            }
          } else {
            setError("Betalningen kunde inte verifieras. Försök igen.");
          }
          cleanUrl();
          setLoading(false);
        })
        .catch(() => {
          restoreFromStorage();
          cleanUrl();
          setLoading(false);
        });
    } else if (cancelled) {
      // Avbröt betalning — gå tillbaka till startsidan
      cleanUrl();
      window.location.href = "/#upload";
      return;
    } else {
      // Direkt besök — kolla sessionStorage
      restoreFromStorage();
      setLoading(false);
    }
  }, [serverResult, sessionId, cancelled]);

  // Generera referral-token när rapport laddats
  useEffect(() => {
    if (!data || !token) return;
    fetch("/api/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportToken: token }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.referralToken) setReferralToken(d.referralToken);
      })
      .catch(() => {});
  }, [data, token]);

  const handleGenerateLink = useCallback(async () => {
    if (!data || shareUrl) return;
    setShareLoading(true);
    try {
      const res = await fetch("/api/rapport/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: data }),
      });
      const json = await res.json();
      if (json.url) {
        setShareUrl(json.url);
        await navigator.clipboard.writeText(json.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      /* ignore */
    } finally {
      setShareLoading(false);
    }
  }, [data, shareUrl]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [shareUrl]);

  const [pdfLoading, setPdfLoading] = useState(false);

  const handleDownloadPdf = useCallback(async () => {
    if (!data || pdfLoading) return;
    setPdfLoading(true);
    try {
      const res = await fetch("/api/rapport/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: data }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kollaavtalet-rapport.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Fallback till print
      window.print();
    } finally {
      setPdfLoading(false);
    }
  }, [data, pdfLoading]);

  const handleReanalyze = useCallback(() => {
    if (data) {
      sessionStorage.setItem("ce_previous_result", JSON.stringify(data));
      sessionStorage.setItem("ce_unlocked", "true");
    }
    window.location.href = "/#upload";
  }, [data]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)", letterSpacing: "0.04em" }}>
          Laddar rapport...
        </p>
      </div>
    );
  }

  if (error) {
    return <EmptyState message={error} />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const highFlags = data.flaggor.filter((f) => f.allvarlighet === "hög");
  const mediumFlags = data.flaggor.filter((f) => f.allvarlighet === "medel");
  const infoFlags = data.flaggor.filter((f) => f.allvarlighet === "info");
  // Granskningsöversikt
  const styrkorCount = data.styrkor?.length ?? 0;
  const flaggorCount = data.flaggor.length;
  const totalGranskade = styrkorCount + flaggorCount;
  const needsAttentionCount = highFlags.length + mediumFlags.length;

  // Resurser — hämtas en gång
  const resources = getRelevantResources(data);

  return (
    <div style={{ backgroundColor: "var(--color-surface-50)", minHeight: "100vh" }}>
      {/* Action bar — sticky */}
      <div
        className="no-print report-action-bar"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          backgroundColor: "var(--color-surface-0)",
          borderBottom: "1px solid var(--color-surface-200)",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <a
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: "var(--color-text-muted)",
              letterSpacing: "0.04em",
              textDecorationLine: "underline",
              textUnderlineOffset: "3px",
              minHeight: "44px",
            }}
          >
            <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
            kollaavtalet.com
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ActionButton
              icon={
                copied ? (
                  <Check size={14} strokeWidth={1.5} />
                ) : (
                  <Link2 size={14} strokeWidth={1.5} />
                )
              }
              label={
                copied
                  ? "Kopierad"
                  : shareUrl
                    ? "Kopiera länk"
                    : "Spara länk"
              }
              onClick={shareUrl ? handleCopyLink : handleGenerateLink}
              loading={shareLoading}
            />
            <ActionButton
              icon={<Download size={14} strokeWidth={1.5} />}
              label="PDF"
              onClick={handleDownloadPdf}
            />
            <ActionButton
              icon={<UploadCloud size={14} strokeWidth={1.5} />}
              label="Ny version"
              onClick={handleReanalyze}
            />
          </div>
        </div>
      </div>

      {/* Report header + sammanfattning — vit yta */}
      <div
        ref={reportRef}
        className="report-content-inner"
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem 1rem 0",
        }}
      >
        <header style={{ marginBottom: "0.375rem" }}>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
            }}
          >
            Kolla Avtalet · Avtalsrapport ·{" "}
            {new Date().toLocaleDateString("sv-SE")}
          </p>
          {expiresAt && (
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
                marginTop: "0.25rem",
              }}
            >
              Länk giltig till{" "}
              {new Date(expiresAt).toLocaleDateString("sv-SE")}
            </p>
          )}
        </header>
      </div>

      {/* Helhetsbedömning + sammanfattning — full-bleed sektion */}
      <div style={{ backgroundColor: "var(--color-surface-50)" }}>
        <div
          className="report-content-inner"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "1.5rem 1rem 2.5rem",
          }}
        >
          {/* Helhetsbedömning */}
          {data.helhetsbedömning && (
            <div style={{ marginBottom: "1.5rem" }}>
              <OverallAssessment assessment={data.helhetsbedömning} />
            </div>
          )}

          {/* Sammanfattning */}
          <p
            style={{
              fontSize: "var(--text-base)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.75,
              maxWidth: "640px",
            }}
          >
            {data.sammanfattning}
          </p>

          {/* (jämförelsevy borttagen — V2) */}
        </div>
      </div>

      {/* ================================================================
          GRANSKNING — Primärt innehåll på distinkt bakgrund
          ================================================================ */}
      {totalGranskade > 0 && (
        <div
          style={{
            backgroundColor: "#EBEBEF",
            borderTop: "1px solid var(--color-surface-200)",
            borderBottom: "1px solid var(--color-surface-200)",
          }}
        >
          <div
            className="report-content-inner"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "2.5rem 1rem 3rem",
            }}
          >
            {/* Sektion-header med räknarrad */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "var(--color-text-muted)",
                    marginBottom: "0.375rem",
                  }}
                >
                  Granskning
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.03em",
                    lineHeight: 1.15,
                    margin: 0,
                  }}
                >
                  {totalGranskade} punkter granskade
                </h2>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  letterSpacing: "0.04em",
                  paddingBottom: "0.25rem",
                }}
              >
                {styrkorCount > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: "var(--color-status-ok-text)",
                    }}
                  >
                    <CheckCircle2 size={12} strokeWidth={2} aria-hidden="true" />
                    {styrkorCount} ok
                  </span>
                )}
                {needsAttentionCount > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.25rem",
                      color: highFlags.length > 0
                        ? "var(--color-severity-high-text)"
                        : "var(--color-severity-medium-text)",
                    }}
                  >
                    <AlertTriangle size={12} strokeWidth={2} aria-hidden="true" />
                    {needsAttentionCount} att titta på
                  </span>
                )}
              </div>
            </div>

            {/* Granskningsinnehåll */}
            <GranskningLista
              highFlags={highFlags}
              mediumFlags={mediumFlags}
              infoFlags={infoFlags}
              styrkor={data.styrkor}
              isReanalysis={false}
              newFlags={[]}
            />
          </div>
        </div>
      )}

      {/* ================================================================
          MARKNADSJÄMFÖRELSE — vit yta med tydlig rubrik
          ================================================================ */}
      {data.marknadsjämförelse && data.marknadsjämförelse.length > 0 && (
        <div style={{ backgroundColor: "var(--color-surface-0)" }}>
          <div
            className="report-content-inner"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "2.5rem 1rem 2.5rem",
            }}
          >
            <BandHeading label="Kontext">Ditt avtal vs marknaden</BandHeading>
            <div
              style={{
                backgroundColor: "var(--color-surface-50)",
                border: "1px solid var(--color-surface-200)",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                marginTop: "1.5rem",
              }}
            >
              <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                <table
                  style={{
                    width: "100%",
                    minWidth: "480px",
                    borderCollapse: "collapse",
                    fontSize: "var(--text-base)",
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-surface-200)" }}>
                      {["Villkor", "Ditt avtal", "Marknad", "Källa"].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "0.75rem 1rem",
                            fontFamily: "var(--font-mono)",
                            fontSize: "var(--text-xs)",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--color-text-muted)",
                            textAlign: "left",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.marknadsjämförelse.map((mj, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom:
                            i < data.marknadsjämförelse!.length - 1
                              ? "1px solid var(--color-surface-100)"
                              : "none",
                        }}
                      >
                        <td style={{ padding: "0.75rem 1rem", fontWeight: 500, color: "var(--color-text-primary)" }}>
                          {mj.villkor}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-text-primary)" }}>
                          {mj.avtalets_värde}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                          {mj.benchmark_värde}
                        </td>
                        <td style={{ padding: "0.75rem 1rem", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                          {mj.benchmark_källa}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          SAKNADE VILLKOR — lätt bakgrund
          ================================================================ */}
      {data.saknade_villkor && data.saknade_villkor.length > 0 && (
        <div style={{ backgroundColor: "var(--color-surface-50)", borderTop: "1px solid var(--color-surface-200)" }}>
          <div
            className="report-content-inner"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "2.5rem 1rem 2.5rem",
            }}
          >
            <BandHeading label="Saknas">Villkor som inte nämns</BandHeading>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
              {data.saknade_villkor.map((sv, i) => (
                <div
                  key={i}
                  style={{
                    padding: "1rem 1.25rem",
                    backgroundColor: "var(--color-surface-0)",
                    border: "1px solid var(--color-surface-200)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-base)",
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                    }}
                  >
                    {sv.villkor}
                  </p>
                  <p
                    style={{
                      marginTop: "0.375rem",
                      fontSize: "var(--text-base)",
                      color: "var(--color-text-muted)",
                      lineHeight: 1.6,
                    }}
                  >
                    {sv.relevans}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          NÄSTA STEG — omdöpt till "Värt att tänka på", friare format
          ================================================================ */}
      {data.nästa_steg && data.nästa_steg.length > 0 && (
        <div style={{ backgroundColor: "var(--color-surface-0)", borderTop: "1px solid var(--color-surface-200)" }}>
          <div
            className="report-content-inner"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "2.5rem 1rem 2.5rem",
            }}
          >
            <BandHeading label="Tips">Värt att tänka på</BandHeading>
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.01em",
                lineHeight: 1.5,
              }}
            >
              Inte obligatoriskt, men kan ge dig ett bättre utgångsläge.
            </p>
            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0",
              }}
            >
              {data.nästa_steg.map((steg, i) => (
                <TipsRow key={i} steg={steg} isLast={i === data.nästa_steg!.length - 1} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          RESURSER — kompakt, referens-känsla, inte en huvudsektion
          ================================================================ */}
      {resources.length > 0 && (
        <div
          style={{
            backgroundColor: "var(--color-surface-50)",
            borderTop: "1px solid var(--color-surface-200)",
          }}
        >
          <div
            className="report-content-inner"
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              padding: "1.5rem 1rem 2rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "0.875rem",
              }}
            >
              Resurser
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {resources.map((r, i) => (
                <ResourceChip key={i} resource={r} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          OMGRANSKNING CTA + UTILITIES
          ================================================================ */}
      <div style={{ backgroundColor: "var(--color-surface-0)", borderTop: "1px solid var(--color-surface-200)" }}>
        <div
          className="report-content-inner"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: "2rem 1rem 2rem",
          }}
        >
          {/* Email-bekräftelse */}
          {emailSent && (
            <div
              className="no-print"
              style={{
                marginBottom: "1.25rem",
                padding: "0.875rem 1.25rem",
                border: "1px solid var(--color-status-ok-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-status-ok-bg)",
              }}
            >
              <p style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-status-ok-text)" }}>
                Rapporten har skickats till {emailSent}
              </p>
            </div>
          )}

          {/* Omgranskning CTA */}
          <div
            className="no-print"
            style={{
              marginBottom: "1.25rem",
              padding: "1.5rem",
              border: "1px solid var(--color-surface-200)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--color-surface-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1.5rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-lg)",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Fått ett reviderat avtal?
              </p>
              <p
                style={{
                  marginTop: "0.25rem",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-muted)",
                  lineHeight: 1.5,
                }}
              >
                Ladda upp den nya versionen så granskar vi den. Ingår i priset.
              </p>
            </div>
            <button
              onClick={handleReanalyze}
              className="btn-accent"
              style={{
                padding: "0.7rem 1.5rem",
                fontSize: "var(--text-sm)",
                flexShrink: 0,
              }}
            >
              <UploadCloud size={16} strokeWidth={1.5} />
              Ladda upp nytt utkast
            </button>
          </div>

          {/* Spara länk — inline reminder */}
          {!shareUrl && (
            <div
              className="no-print"
              style={{
                marginBottom: "1.25rem",
                padding: "1rem 1.25rem",
                border: "1px solid var(--color-surface-200)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-surface-0)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <div>
                <p style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-text-primary)" }}>
                  Spara en länk till denna rapport
                </p>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", marginTop: "0.125rem" }}>
                  Giltig i 30 dagar. Använd samma länk för omgranskning.
                </p>
              </div>
              <button
                onClick={handleGenerateLink}
                disabled={shareLoading}
                className="btn-accent"
                style={{ padding: "0.6rem 1.25rem", fontSize: "var(--text-sm)", flexShrink: 0 }}
              >
                <Link2 size={14} strokeWidth={1.5} />
                {shareLoading ? "Skapar..." : "Skapa länk"}
              </button>
            </div>
          )}

          {shareUrl && (
            <div
              className="no-print"
              style={{
                marginBottom: "1.25rem",
                padding: "1rem 1.25rem",
                border: "1px solid var(--color-status-ok-border)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-status-ok-bg)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "var(--text-base)", fontWeight: 500, color: "var(--color-status-ok-text)" }}>
                    Länk sparad
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-muted)",
                      marginTop: "0.25rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {shareUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.375rem",
                    padding: "0.5rem 0.75rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    backgroundColor: "var(--color-surface-0)",
                    border: "1px solid var(--color-surface-200)",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    flexShrink: 0,
                  }}
                >
                  {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
                  {copied ? "Kopierad" : "Kopiera"}
                </button>
              </div>
            </div>
          )}

          {/* Referral */}
          {referralToken && (
            <div className="no-print" style={{ marginBottom: "1.25rem" }}>
              <ReferralShare referralToken={referralToken} />
            </div>
          )}

          {/* Disclaimer */}
          <footer style={{ paddingTop: "1.5rem", borderTop: "1px solid var(--color-surface-200)" }}>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
              Det här är information, inte juridisk rådgivning. Analysen jämför
              mot LAS, Semesterlagen, Arbetstidslagen, Diskrimineringslagen och
              Föräldraledighetslagen. Kollektivavtal ingår inte. Vid osäkerhet,
              kontakta ett fackförbund eller en arbetsrättsjurist.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// GranskningLista — filtrering + sammanhängande flöde
// ---------------------------------------------------------------------------

function GranskningLista({
  highFlags,
  mediumFlags,
  infoFlags,
  styrkor,
  isReanalysis,
  newFlags,
}: {
  highFlags: Flagga[];
  mediumFlags: Flagga[];
  infoFlags: Flagga[];
  styrkor?: { titel: string; beskrivning: string }[];
  isReanalysis: boolean;
  newFlags: Flagga[];
}) {
  const allFlags = [...highFlags, ...mediumFlags, ...infoFlags];
  const showFilter = allFlags.length > 5;
  const [activeFilter, setActiveFilter] = useState<"alla" | "hög" | "medel" | "info">("alla");

  const filteredHigh = activeFilter === "alla" || activeFilter === "hög" ? highFlags : [];
  const filteredMedium = activeFilter === "alla" || activeFilter === "medel" ? mediumFlags : [];
  const filteredInfo = activeFilter === "alla" || activeFilter === "info" ? infoFlags : [];
  const showStyrkor = activeFilter === "alla";

  return (
    <div>
      {/* Filter — visas bara om >5 flaggor */}
      {showFilter && (
        <div
          style={{
            display: "flex",
            gap: "0.375rem",
            flexWrap: "wrap",
            marginBottom: "1.5rem",
          }}
          role="group"
          aria-label="Filtrera granskning"
        >
          {(
            [
              { key: "alla", label: `Alla (${allFlags.length})` },
              ...(highFlags.length > 0 ? [{ key: "hög" as const, label: `Hög (${highFlags.length})` }] : []),
              ...(mediumFlags.length > 0 ? [{ key: "medel" as const, label: `Medel (${mediumFlags.length})` }] : []),
              ...(infoFlags.length > 0 ? [{ key: "info" as const, label: `Info (${infoFlags.length})` }] : []),
            ] as { key: "alla" | "hög" | "medel" | "info"; label: string }[]
          ).map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{
                padding: "0.375rem 0.875rem",
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                letterSpacing: "0.04em",
                border: "1px solid",
                borderRadius: "999px",
                cursor: "pointer",
                transition: "all 0.12s ease",
                backgroundColor:
                  activeFilter === f.key
                    ? "var(--color-text-primary)"
                    : "transparent",
                borderColor:
                  activeFilter === f.key
                    ? "var(--color-text-primary)"
                    : "var(--color-surface-300)",
                color:
                  activeFilter === f.key
                    ? "var(--color-surface-0)"
                    : "var(--color-text-muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Flaggor och styrkor */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Hög allvarlighet */}
        {filteredHigh.length > 0 && (
          <FlagGroup
            severity="hög"
            label="Bryter mot lag"
            flags={filteredHigh}
            isReanalysis={false}
            newFlags={[]}
          />
        )}

        {/* Medel allvarlighet */}
        {filteredMedium.length > 0 && (
          <FlagGroup
            severity="medel"
            label="Avviker från praxis"
            flags={filteredMedium}
            isReanalysis={false}
            newFlags={[]}
          />
        )}

        {/* Styrkor — presenteras efter flaggor med hög/medel allvarlighet */}
        {showStyrkor && styrkor && styrkor.length > 0 && (
          <div>
            {(highFlags.length > 0 || mediumFlags.length > 0) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0.5rem 0 0.75rem",
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-surface-300)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ser bra ut
                </span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-surface-300)" }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {styrkor.map((s, i) => (
                <StyrkaCard key={i} styrka={s} />
              ))}
            </div>
          </div>
        )}

        {/* Info-flaggor — lägst prioritet */}
        {filteredInfo.length > 0 && (
          <>
            {(filteredHigh.length > 0 || filteredMedium.length > 0 || (showStyrkor && styrkor && styrkor.length > 0)) && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  margin: "0.25rem 0 0.25rem",
                }}
              >
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-surface-300)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-muted)",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  Att känna till
                </span>
                <div style={{ flex: 1, height: "1px", backgroundColor: "var(--color-surface-300)" }} />
              </div>
            )}
            <FlagGroup
              severity="info"
              label="Att känna till"
              flags={filteredInfo}
              isReanalysis={false}
              newFlags={[]}
              hideGroupLabel
            />
          </>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function EmptyState({ message }: { message?: string }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        backgroundColor: "var(--color-surface-50)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}
      >
        Rapporten kunde inte hittas
      </p>
      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--color-text-muted)",
          textAlign: "center",
          maxWidth: "400px",
          lineHeight: 1.6,
        }}
      >
        {message ??
          "Länken kan ha gått ut eller så har sessionsdata rensats. Ladda upp avtalet igen. Om du redan betalat kostar det inget extra."}
      </p>
      <a
        href="/"
        className="btn-accent"
        style={{
          marginTop: "0.5rem",
          padding: "0.7rem 1.5rem",
          fontSize: "var(--text-sm)",
          textDecoration: "none",
        }}
      >
        Till startsidan
      </a>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  loading,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-label={label}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.5rem 0.75rem",
        minHeight: "44px",
        minWidth: "44px",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-muted)",
        backgroundColor: "transparent",
        border: "1px solid var(--color-surface-200)",
        borderRadius: "var(--radius-md)",
        cursor: loading ? "wait" : "pointer",
        letterSpacing: "0.04em",
        opacity: loading ? 0.6 : 1,
        transition: "all var(--duration-fast) var(--ease-in-out)",
      }}
    >
      {icon}
      <span className="hidden-mobile" aria-hidden="true">{label}</span>
    </button>
  );
}

// BandHeading — används för sekundära sektioner med eyebrow + stor rubrik
function BandHeading({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </p>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
          margin: 0,
        }}
      >
        {children}
      </h2>
    </div>
  );
}

function OverallAssessment({
  assessment,
}: {
  assessment: AnalysisResult["helhetsbedömning"];
}) {
  const styles =
    assessment.nivå === "bra"
      ? {
          border: "var(--color-status-ok-border)",
          bg: "var(--color-status-ok-bg)",
          label: "Ser bra ut",
          labelColor: "var(--color-status-ok-text)",
        }
      : assessment.nivå === "risk"
        ? {
            border: "var(--color-severity-high-border)",
            bg: "var(--color-severity-high-bg)",
            label: "Värt att granska noga",
            labelColor: "var(--color-severity-high-text)",
          }
        : {
            border: "var(--color-surface-300)",
            bg: "var(--color-surface-0)",
            label: "Några saker att notera",
            labelColor: "var(--color-text-muted)",
          };

  return (
    <div
      style={{
        padding: "1.5rem",
        borderRadius: "var(--radius-lg)",
        border: `2px solid ${styles.border}`,
        backgroundColor: styles.bg,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: styles.labelColor,
          marginBottom: "0.5rem",
        }}
      >
        {styles.label}
      </p>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-2xl)",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
        }}
      >
        {assessment.rubrik}
      </p>
      <p
        style={{
          marginTop: "0.5rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.7,
        }}
      >
        {assessment.beskrivning}
      </p>
    </div>
  );
}

function ComparisonBanner({
  resolvedFlags,
  newFlags,
}: {
  resolvedFlags: Flagga[];
  newFlags: Flagga[];
}) {
  return (
    <div
      style={{
        padding: "1.25rem",
        border: "1px solid var(--color-surface-200)",
        borderRadius: "var(--radius-lg)",
        backgroundColor: "var(--color-surface-0)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          marginBottom: "0.75rem",
        }}
      >
        Jämfört med förra versionen
      </p>

      {resolvedFlags.length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          {resolvedFlags.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--color-status-ok-text)",
                  letterSpacing: "0.04em",
                }}
              >
                LÖST
              </span>
              <span
                style={{
                  fontSize: "var(--text-base)",
                  color: "var(--color-text-muted)",
                  textDecoration: "line-through",
                }}
              >
                {f.titel}
              </span>
            </div>
          ))}
        </div>
      )}

      {newFlags.length > 0 && (
        <div>
          {newFlags.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--color-severity-medium-text)",
                  letterSpacing: "0.04em",
                }}
              >
                NY
              </span>
              <span style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)" }}>
                {f.titel}
              </span>
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
  );
}

// FlagGroup — används inuti GranskningLista
function FlagGroup({
  severity,
  label,
  flags,
  isReanalysis,
  newFlags,
  hideGroupLabel,
}: {
  severity: "hög" | "medel" | "info";
  label: string;
  flags: Flagga[];
  isReanalysis: boolean;
  newFlags: Flagga[];
  hideGroupLabel?: boolean;
}) {
  const colors =
    severity === "hög"
      ? {
          bg: "var(--color-severity-high-bg)",
          border: "var(--color-severity-high-border)",
          text: "var(--color-severity-high-text)",
          icon: "var(--color-severity-high-icon)",
        }
      : severity === "medel"
        ? {
            bg: "var(--color-severity-medium-bg)",
            border: "var(--color-severity-medium-border)",
            text: "var(--color-severity-medium-text)",
            icon: "var(--color-severity-medium-icon)",
          }
        : {
            bg: "var(--color-severity-info-bg)",
            border: "var(--color-severity-info-border)",
            text: "var(--color-severity-info-text)",
            icon: "var(--color-severity-info-icon)",
          };

  const Icon =
    severity === "hög"
      ? AlertTriangle
      : severity === "medel"
        ? AlertCircle
        : Info;

  return (
    <div>
      {!hideGroupLabel && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            marginBottom: "0.625rem",
          }}
        >
          <Icon size={13} strokeWidth={1.5} style={{ color: colors.icon }} aria-hidden="true" />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: colors.text,
            }}
          >
            {label} ({flags.length})
          </span>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
        {flags.map((flag, i) => (
          <FlagCard
            key={i}
            flag={flag}
            colors={colors}
            isNew={isReanalysis && newFlags.some((f) => f.titel === flag.titel)}
          />
        ))}
      </div>
    </div>
  );
}

// StyrkaCard
function StyrkaCard({ styrka }: { styrka: { titel: string; beskrivning: string } }) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-0)",
        border: "1px solid var(--color-status-ok-border)",
        borderLeft: "3px solid var(--color-status-ok-icon)",
        borderRadius: "var(--radius-lg)",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
      }}
    >
      <CheckCircle2
        size={16}
        strokeWidth={1.5}
        style={{
          color: "var(--color-status-ok-icon)",
          flexShrink: 0,
          marginTop: "0.125rem",
        }}
        aria-hidden="true"
      />
      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {styrka.titel}
        </p>
        <p
          style={{
            marginTop: "0.25rem",
            fontSize: "var(--text-base)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {styrka.beskrivning}
        </p>
      </div>
    </div>
  );
}

function FlagCard({
  flag,
  colors,
  isNew,
}: {
  flag: Flagga;
  colors: { bg: string; border: string; text: string; icon: string };
  isNew: boolean;
}) {
  const [detailsOpen, setDetailsOpen] = useState(flag.allvarlighet === "hög");

  return (
    <div
      style={{
        backgroundColor: "var(--color-surface-0)",
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${colors.icon}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
      }}
    >
      {/* Header — always visible */}
      <button
        onClick={() => setDetailsOpen((o) => !o)}
        aria-expanded={detailsOpen}
        aria-controls={`flag-details-${flag.titel.replace(/\s+/g, "-").toLowerCase()}`}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "1.25rem",
          minHeight: "44px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.375rem",
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                color: colors.icon,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {flag.allvarlighet}
            </span>
            <span style={{ color: "var(--color-surface-300)", fontSize: "var(--text-xs)" }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.04em",
              }}
            >
              {flag.kategori}
            </span>
            {flag.benchmark_avvikelse && (
              <>
                <span style={{ color: "var(--color-surface-300)", fontSize: "var(--text-xs)" }}>·</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-accent-text)",
                    letterSpacing: "0.04em",
                  }}
                >
                  avviker från marknad
                </span>
              </>
            )}
            {isNew && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  color: "var(--color-severity-medium-text)",
                  letterSpacing: "0.04em",
                  backgroundColor: "var(--color-severity-medium-bg)",
                  padding: "0.125rem 0.375rem",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                NY
              </span>
            )}
          </div>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-lg)",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {flag.titel}
          </p>
          <p
            style={{
              marginTop: "0.375rem",
              fontSize: "var(--text-base)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
            }}
          >
            {flag.klartext}
          </p>
        </div>
        <span style={{ flexShrink: 0, color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
          {detailsOpen ? (
            <ChevronUp size={16} strokeWidth={1.5} />
          ) : (
            <ChevronDown size={16} strokeWidth={1.5} />
          )}
        </span>
      </button>

      {/* Details — collapsible */}
      {detailsOpen && (
        <div
          id={`flag-details-${flag.titel.replace(/\s+/g, "-").toLowerCase()}`}
          style={{
            padding: "0 1.25rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
          }}
        >
          {/* Avtal vs lag */}
          {(flag.avtalets_text || flag.lagens_krav) && (
            <div className="comparison-grid-2col">
              {flag.avtalets_text && (
                <ComparisonCell label="Avtalet säger" value={flag.avtalets_text} />
              )}
              {flag.lagens_krav && (
                <ComparisonCell label="Lagen anger" value={flag.lagens_krav} />
              )}
            </div>
          )}

          {/* Frågor att ställa */}
          {flag.frågor_att_ställa && flag.frågor_att_ställa.length > 0 && (
            <div
              style={{
                padding: "0.75rem 1rem",
                backgroundColor: "var(--color-surface-50)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-surface-100)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "var(--text-xs)",
                  fontWeight: 500,
                  color: "var(--color-accent-text)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Frågor att ställa
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.25rem",
                }}
              >
                {flag.frågor_att_ställa.map((q, qi) => (
                  <li
                    key={qi}
                    style={{
                      fontSize: "var(--text-base)",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.5,
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lagrum — med länk till lagtext */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "var(--text-xs)",
              color: colors.text,
              letterSpacing: "0.02em",
            }}
          >
            {parseLagrum(flag.lagrum).map((link, li) => (
              <span key={li}>
                {li > 0 && ", "}
                {link.url ? (
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "inherit",
                      textDecoration: "underline",
                      textUnderlineOffset: "2px",
                    }}
                  >
                    {link.text} ↗
                  </a>
                ) : (
                  link.text
                )}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}

// ResourceChip — kompakt chip-länk istf fullt kort
function ResourceChip({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      title={resource.beskrivning}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.375rem 0.75rem",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-muted)",
        letterSpacing: "0.03em",
        backgroundColor: "var(--color-surface-0)",
        border: "1px solid var(--color-surface-200)",
        borderRadius: "var(--radius-md)",
        textDecoration: "none",
        transition: "border-color 0.12s ease, color 0.12s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-surface-300)";
        e.currentTarget.style.color = "var(--color-text-secondary)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-surface-200)";
        e.currentTarget.style.color = "var(--color-text-muted)";
      }}
    >
      {resource.titel}
      <ExternalLink size={10} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

// TipsRow — horisontell rad med tunn separator, inte ett kort
function TipsRow({ steg, isLast }: { steg: NästaSteg; isLast: boolean }) {
  const Icon =
    steg.typ === "fråga"
      ? MessageCircle
      : steg.typ === "kontrollera"
        ? ClipboardCheck
        : Bookmark;

  const iconColor =
    steg.typ === "fråga"
      ? "var(--color-accent-text)"
      : steg.typ === "kontrollera"
        ? "var(--color-severity-info-icon)"
        : "var(--color-text-muted)";

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem 0",
        borderBottom: isLast ? "none" : "1px solid var(--color-surface-200)",
      }}
    >
      <Icon
        size={16}
        strokeWidth={1.5}
        style={{ color: iconColor, flexShrink: 0, marginTop: "0.2rem" }}
        aria-hidden="true"
      />
      <div>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-base)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.01em",
          }}
        >
          {steg.titel}
        </p>
        <p
          style={{
            marginTop: "0.125rem",
            fontSize: "var(--text-sm)",
            color: "var(--color-text-muted)",
            lineHeight: 1.55,
          }}
        >
          {steg.beskrivning}
        </p>
      </div>
    </div>
  );
}

function ComparisonCell({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "0.75rem 1rem",
        backgroundColor: "var(--color-surface-50)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-surface-100)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          color: "var(--color-text-muted)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "0.375rem",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--color-text-primary)",
          lineHeight: 1.5,
        }}
      >
        {value}
      </p>
    </div>
  );
}
