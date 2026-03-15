"use client";

import { useState, useCallback } from "react";
import { Copy, Check, MessageSquare } from "lucide-react";

interface ReferralShareProps {
  referralToken: string;
}

export function ReferralShare({ referralToken }: ReferralShareProps) {
  const [copied, setCopied] = useState(false);
  const siteUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://inkling.se";
  const referralUrl = `${siteUrl}?ref=${referralToken}`;

  const smsText = `Jag har precis granskat mitt anställningsavtal med inkling. Om du ska skriva under snart kan du testa gratis: ${referralUrl}`;
  const smsHref = `sms:?body=${encodeURIComponent(smsText)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard unavailable */
    }
  }, [referralUrl]);

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
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-base)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
        }}
      >
        Känner du någon som ska skriva under?
      </p>
      <p
        style={{
          marginTop: "0.375rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-muted)",
          lineHeight: 1.6,
        }}
      >
        Dela inkling med en kollega eller vän. Den kostnadsfria snabbkollen tar
        under en minut.
      </p>
      <div
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.75rem",
            minHeight: "44px",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-surface-200)",
            borderRadius: "var(--radius-md)",
            cursor: "pointer",
            letterSpacing: "0.04em",
          }}
        >
          {copied ? (
            <Check size={14} strokeWidth={1.5} />
          ) : (
            <Copy size={14} strokeWidth={1.5} />
          )}
          {copied ? "Kopierad" : "Kopiera länk"}
        </button>
        <a
          href={smsHref}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.375rem",
            padding: "0.5rem 0.75rem",
            minHeight: "44px",
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-xs)",
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1px solid var(--color-surface-200)",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          <MessageSquare size={14} strokeWidth={1.5} />
          Dela via SMS
        </a>
      </div>
    </div>
  );
}
