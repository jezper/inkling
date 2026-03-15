"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "./header";
import { Footer } from "./footer";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TocItem {
  /** Must match the id attribute on the heading in the article body */
  id: string;
  label: string;
  /** 1 = h2 (top-level), 2 = h3 (sub-item). Default 1. */
  level?: 1 | 2;
}

export interface RelatedPage {
  href: string;
  label: string;
  description: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ArticleLayoutProps {
  children: React.ReactNode;
  title: string;
  /** One-sentence ingress shown below the title */
  lead: string;
  breadcrumbs: BreadcrumbItem[];
  toc: TocItem[];
  related: RelatedPage[];
  /** Mono eyebrow label above the title, e.g. "LAS § 6" or "Guide" */
  eyebrow?: string;
  /** ISO date string for last update */
  updatedAt?: string;
}

// ─── Shared prose + layout styles ────────────────────────────────────────────
// Injected once at the top of ArticleLayout to avoid repeating them.

const GLOBAL_STYLES = `
  /* ── Two-column layout grid ─────────────────── */
  .inkling-article-grid {
    max-width: 72rem;
    margin: 0 auto;
    padding: 1.5rem 1rem 3rem;
  }
  @media (min-width: 640px) {
    .inkling-article-grid {
      padding: 2rem 1.5rem 3.5rem;
    }
  }
  @media (min-width: 1024px) {
    .inkling-article-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 17rem;
      grid-template-rows: auto;
      column-gap: 3.5rem;
      align-items: start;
    }
    .inkling-article-grid .article-body-col {
      grid-column: 1;
    }
    .inkling-article-grid .sidebar-col {
      grid-column: 2;
      grid-row: 1 / 99;
    }
    .inkling-mobile-toc { display: none !important; }
    .inkling-desktop-sidebar { display: block !important; }
  }
  @media (max-width: 1023px) {
    .inkling-desktop-sidebar { display: none !important; }
    .inkling-mobile-toc { display: block !important; }
  }

  /* ── Prose typography ───────────────────────── */
  .article-prose h2 {
    font-family: var(--font-display);
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--color-text-primary);
    line-height: 1.25;
    margin-top: 2.75rem;
    margin-bottom: 0.875rem;
    scroll-margin-top: 5.5rem;
  }
  .article-prose h3 {
    font-family: var(--font-display);
    font-size: 1.125rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--color-text-primary);
    line-height: 1.3;
    margin-top: 2rem;
    margin-bottom: 0.625rem;
    scroll-margin-top: 5.5rem;
  }
  .article-prose p {
    font-family: var(--font-sans);
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.7;
    margin-bottom: 1.125rem;
  }
  .article-prose ul,
  .article-prose ol {
    padding-left: 1.375rem;
    margin-bottom: 1.25rem;
  }
  .article-prose li {
    font-family: var(--font-sans);
    font-size: 1rem;
    color: var(--color-text-secondary);
    line-height: 1.65;
    margin-bottom: 0.4rem;
  }
  .article-prose strong {
    font-weight: 600;
    color: var(--color-text-primary);
  }
  .article-prose a {
    color: var(--color-accent-text);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .article-prose a:hover {
    color: var(--color-accent-600);
  }
  /* Law citation / statutory quote */
  .article-prose blockquote {
    margin: 1.75rem 0;
    padding: 1rem 1.25rem;
    border-left: 3px solid var(--color-surface-300);
    background: var(--color-surface-0);
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  }
  .article-prose blockquote p {
    font-family: var(--font-mono);
    font-size: 0.9375rem;
    color: var(--color-text-muted);
    line-height: 1.65;
    margin-bottom: 0;
  }
  .article-prose blockquote cite {
    display: block;
    margin-top: 0.5rem;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-subtle);
    letter-spacing: 0.04em;
    font-style: normal;
  }
  /* Info box — use <div className="law-box"> inside article */
  .article-prose .law-box {
    margin: 1.75rem 0;
    padding: 1.125rem 1.25rem;
    background: var(--color-surface-50);
    border: 1px solid var(--color-surface-200);
    border-radius: var(--radius-lg);
  }
  .article-prose .law-box p {
    margin-bottom: 0.5rem;
  }
  .article-prose .law-box p:last-child {
    margin-bottom: 0;
  }

  /* Sidebar sticky */
  .sidebar-sticky {
    position: sticky;
    top: 5rem;
  }
`;

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Brödsmulor"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.375rem",
        flexWrap: "wrap",
        fontFamily: "var(--font-mono)",
        fontSize: "var(--text-xs)",
        color: "var(--color-text-subtle)",
        letterSpacing: "0.04em",
        marginBottom: "1.75rem",
      }}
    >
      {items.map((item, i) => (
        <span
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}
        >
          {i > 0 && (
            <span aria-hidden="true" style={{ color: "var(--color-surface-300)" }}>
              /
            </span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              style={{
                color: "var(--color-text-muted)",
                textDecoration: "underline",
                textUnderlineOffset: "3px",
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              aria-current="page"
              style={{ color: "var(--color-text-primary)", fontWeight: 500 }}
            >
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── TableOfContents ──────────────────────────────────────────────────────────

function TableOfContents({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  return (
    <nav aria-label="Innehållsförteckning">
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--color-text-subtle)",
          marginBottom: "0.625rem",
        }}
      >
        Innehåll
      </p>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.0625rem",
        }}
      >
        {items.map(item => {
          const isActive = item.id === activeId;
          const isSub = item.level === 2;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                style={{
                  display: "block",
                  padding: isSub
                    ? "0.5rem 0.75rem 0.5rem 1.375rem"
                    : "0.5rem 0.75rem",
                  minHeight: "44px",
                  fontSize: isSub ? "0.875rem" : "var(--text-sm)",
                  fontFamily: "var(--font-sans)",
                  color: isActive
                    ? "var(--color-text-primary)"
                    : "var(--color-text-muted)",
                  fontWeight: isActive ? 500 : 400,
                  textDecoration: "none",
                  borderLeft: isActive
                    ? "2px solid var(--color-accent-500)"
                    : "2px solid transparent",
                  borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                  transition: "color 120ms, border-color 120ms",
                  lineHeight: 1.45,
                }}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ─── InlineCTA ────────────────────────────────────────────────────────────────
// Used inside article body — export so page authors can place it after ~40%
// of content. Left-accent border signals it belongs to the reading flow
// without feeling like an ad.

export function InlineCTA() {
  return (
    <aside
      aria-label="Granska ditt avtal"
      style={{
        margin: "2.5rem 0",
        padding: "1.5rem 1.625rem",
        background: "var(--color-surface-0)",
        border: "1px solid var(--color-surface-200)",
        borderLeft: "3px solid var(--color-accent-500)",
        borderRadius: "0 var(--radius-lg) var(--radius-lg) 0",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-accent-text)",
          marginBottom: "0.5rem",
        }}
      >
        Har du ett avtal?
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          marginBottom: "1.125rem",
          lineHeight: 1.55,
        }}
      >
        Ladda upp ditt anställningsavtal. Vi jämför det mot LAS och andra
        arbetsrättslagar — direkt i webbläsaren.
      </p>
      <a href="/#upload" className="btn-accent" style={{ display: "inline-flex" }}>
        Granska mitt avtal →
      </a>
      <p
        style={{
          marginTop: "0.75rem",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-subtle)",
          letterSpacing: "0.03em",
        }}
      >
        99 kr · inget konto · dokumentet lämnar aldrig din enhet
      </p>
    </aside>
  );
}

// ─── SidebarCTA (private) ─────────────────────────────────────────────────────

function SidebarCTA() {
  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.25rem",
        background: "var(--color-surface-0)",
        border: "1px solid var(--color-surface-200)",
        borderRadius: "var(--radius-lg)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-base)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          lineHeight: 1.3,
          marginBottom: "0.5rem",
        }}
      >
        Har du ett avtal att granska?
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.875rem",
          color: "var(--color-text-muted)",
          lineHeight: 1.5,
          marginBottom: "1rem",
        }}
      >
        Ladda upp PDF. Analys mot lag på sekunder.
      </p>
      <a
        href="/#upload"
        className="btn-accent"
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        Granska mitt avtal →
      </a>
      <p
        style={{
          marginTop: "0.625rem",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          color: "var(--color-text-subtle)",
          letterSpacing: "0.03em",
          textAlign: "center",
        }}
      >
        99 kr · ingen registrering
      </p>
    </div>
  );
}

// ─── MobileTOC ────────────────────────────────────────────────────────────────

function MobileTOC({
  items,
  activeId,
}: {
  items: TocItem[];
  activeId: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="inkling-mobile-toc"
      style={{
        marginBottom: "1.75rem",
        borderBottom: "1px solid var(--color-surface-200)",
        paddingBottom: "1.5rem",
      }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-controls="mobile-toc-panel"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0.75rem 1rem",
          minHeight: "44px",
          background: "var(--color-surface-0)",
          border: "1px solid var(--color-surface-200)",
          borderRadius: "var(--radius-lg)",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          textAlign: "left",
        }}
      >
        <span>Innehåll</span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 150ms",
            fontSize: "0.75rem",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          id="mobile-toc-panel"
          role="region"
          aria-label="Innehållsförteckning"
          style={{
            marginTop: "0.375rem",
            padding: "0.625rem 0.375rem",
            background: "var(--color-surface-0)",
            border: "1px solid var(--color-surface-200)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <TableOfContents items={items} activeId={activeId} />
        </div>
      )}
    </div>
  );
}

// ─── RelatedPages ─────────────────────────────────────────────────────────────

function RelatedPages({ pages }: { pages: RelatedPage[] }) {
  if (pages.length === 0) return null;
  return (
    <section
      aria-label="Relaterade sidor"
      style={{
        marginTop: "4rem",
        paddingTop: "2.5rem",
        borderTop: "1px solid var(--color-surface-200)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          color: "var(--color-text-subtle)",
          marginBottom: "1.25rem",
        }}
      >
        Relaterade sidor
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "0.875rem",
        }}
      >
        {pages.map(page => (
          <Link
            key={page.href}
            href={page.href}
            style={{
              display: "block",
              padding: "1rem 1.125rem",
              background: "var(--color-surface-0)",
              border: "1px solid var(--color-surface-200)",
              borderRadius: "var(--radius-lg)",
              textDecoration: "none",
              transition: "border-color 120ms, box-shadow 120ms",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-base)",
                fontWeight: 600,
                color: "var(--color-text-primary)",
                marginBottom: "0.375rem",
                lineHeight: 1.3,
              }}
            >
              {page.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.875rem",
                color: "var(--color-text-muted)",
                lineHeight: 1.5,
              }}
            >
              {page.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

// ─── ArticleLayout ────────────────────────────────────────────────────────────

export function ArticleLayout({
  children,
  title,
  lead,
  breadcrumbs,
  toc,
  related,
  eyebrow,
  updatedAt,
}: ArticleLayoutProps) {
  const [activeId, setActiveId] = useState<string>(toc[0]?.id ?? "");

  // Drive active TOC item via IntersectionObserver
  useEffect(() => {
    if (typeof window === "undefined" || toc.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "0px 0px -55% 0px", threshold: 0 }
    );

    toc.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <>
      {/* Inject layout + prose styles once */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface-50)",
        }}
      >
        <Header />

        {/* Spacer to clear fixed header (~57px tall) */}
        <div style={{ height: "57px", flexShrink: 0 }} aria-hidden="true" />

        <main id="main-content" style={{ flex: 1 }}>

          {/* ── Page header strip ──────────────────────────────── */}
          <div
            style={{
              background: "var(--color-surface-0)",
              borderBottom: "1px solid var(--color-surface-200)",
              padding: "2.5rem 1.5rem 2.25rem",
            }}
          >
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
              <Breadcrumb items={breadcrumbs} />

              {eyebrow && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    letterSpacing: "0.10em",
                    textTransform: "uppercase",
                    color: "var(--color-accent-text)",
                    marginBottom: "0.625rem",
                  }}
                >
                  {eyebrow}
                </p>
              )}

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--color-text-primary)",
                  lineHeight: 1.15,
                  marginBottom: "0.875rem",
                  maxWidth: "42rem",
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-lg)",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "42rem",
                }}
              >
                {lead}
              </p>

              {updatedAt && (
                <p
                  style={{
                    marginTop: "1rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    color: "var(--color-text-subtle)",
                    letterSpacing: "0.04em",
                  }}
                >
                  Uppdaterad{" "}
                  {new Date(updatedAt).toLocaleDateString("sv-SE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>

          {/* ── Two-column content area ─────────────────────────── */}
          <div className="inkling-article-grid">

            {/* Sidebar column — desktop only */}
            <aside
              className="sidebar-col inkling-desktop-sidebar"
              aria-label="Sidopanel"
            >
              <div className="sidebar-sticky">
                <TableOfContents items={toc} activeId={activeId} />
                <SidebarCTA />
              </div>
            </aside>

            {/* Main article column */}
            <div className="article-body-col">

              {/* Mobile TOC — shown only below 1024px */}
              <MobileTOC items={toc} activeId={activeId} />

              {/* Article prose */}
              <article className="article-prose">
                {children}
              </article>

              <RelatedPages pages={related} />
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
