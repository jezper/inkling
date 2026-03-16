import { decryptReportToken } from "@/lib/report-token";
import { FullReport } from "@/components/full-report";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Din avtalsrapport",
  description: "Din personliga avtalsrapport från Kolla Avtalet.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ t?: string; session_id?: string; cancelled?: string }>;
}

export default async function RapportPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const token = params.t;

  // Token-baserad länk - dekryptera server-side
  if (token) {
    const decrypted = decryptReportToken(token);
    if (!decrypted) {
      return <ExpiredLink />;
    }
    return (
      <FullReport
        result={decrypted.data}
        expiresAt={decrypted.expiresAt}
        token={token}
      />
    );
  }

  // sessionStorage-baserad (efter betalning eller direkt)
  // session_id och cancelled hanteras client-side i FullReport
  return (
    <FullReport
      sessionId={params.session_id}
      cancelled={params.cancelled === "true"}
    />
  );
}

function ExpiredLink() {
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
        Länken har gått ut
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
        Rapportlänkar är giltiga i 30 dagar. Ladda upp avtalet igen för en ny
        granskning.
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
