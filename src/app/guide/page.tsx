import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Guider om anställningsavtal | inkling",
  description:
    "Praktiska guider om konkurrensklausuler, uppsägningstider och hur du granskar ditt anställningsavtal.",
};

const PAGES = [
  {
    href: "/guide/konkurrensklausul",
    eyebrow: "Avtalsrätt",
    title: "Konkurrensklausuler",
    description:
      "När är de giltiga, hur länge gäller de och vad kan du förhandla bort?",
  },
  {
    href: "/guide/uppsagningstid",
    eyebrow: "LAS § 11",
    title: "Uppsägningstider",
    description:
      "Lagens minimigränser, vad avtalet kan ange och vad som gäller under friställning.",
  },
  {
    href: "/guide/granska-anstallningsavtal",
    eyebrow: "Steg-för-steg",
    title: "Granska ditt anställningsavtal",
    description:
      "De sju punkterna du alltid bör kontrollera innan du skriver under.",
  },
];

export default function GuidePage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-surface-50)" }}>
      <Header />
      <div style={{ height: "57px", flexShrink: 0 }} aria-hidden="true" />

      <main id="main-content" style={{ flex: 1, maxWidth: "72rem", margin: "0 auto", padding: "3rem 1.5rem 5rem", width: "100%" }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--color-text-subtle)", marginBottom: "1rem" }}>
          Guider
        </p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--color-text-primary)", lineHeight: 1.15, marginBottom: "0.75rem" }}>
          Guider om anställningsavtal
        </h1>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-lg)", color: "var(--color-text-secondary)", maxWidth: "40rem", marginBottom: "3rem", lineHeight: 1.6 }}>
          Praktisk information om de klausuler som påverkar dig mest.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
          {PAGES.map(page => (
            <Link
              key={page.href}
              href={page.href}
              style={{ display: "block", padding: "1.5rem", background: "var(--color-surface-0)", border: "1px solid var(--color-surface-200)", borderRadius: "var(--radius-lg)", textDecoration: "none" }}
            >
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", letterSpacing: "0.08em", color: "var(--color-text-subtle)", marginBottom: "0.5rem" }}>
                {page.eyebrow}
              </p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--color-text-primary)", marginBottom: "0.5rem", lineHeight: 1.25 }}>
                {page.title}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)", lineHeight: 1.55 }}>
                {page.description}
              </p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
