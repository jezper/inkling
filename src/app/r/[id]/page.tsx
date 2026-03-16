import { redirect } from "next/navigation";
import { resolveShortLink } from "@/lib/short-links";
import { FullReport } from "@/components/full-report";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Din avtalsrapport — Kolla Avtalet",
  robots: { index: false, follow: false },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShortLinkPage({ params }: PageProps) {
  const { id } = await params;

  if (!id || id.length < 6) {
    redirect("/");
  }

  const result = await resolveShortLink(id);

  if (!result) {
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
          Rapportlänkar är giltiga i 30 dagar.
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

  return (
    <FullReport
      result={result.data}
      expiresAt={result.expiresAt}
    />
  );
}
