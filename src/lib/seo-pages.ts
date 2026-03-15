/**
 * Shared data for SEO information pages.
 * Each page imports what it needs from here.
 */

import type { RelatedPage } from "@/components/article-layout";

export const ALL_SEO_PAGES: RelatedPage[] = [
  {
    href: "/regler/las",
    label: "LAS — Lagen om anställningsskydd",
    description: "Grundläggande skydd för anställda. Vad lagen kräver av ditt avtal.",
  },
  {
    href: "/regler/provanstallning",
    label: "Provanställning",
    description: "Hur lång får den vara? Vad gäller vid avbrott?",
  },
  {
    href: "/guide/konkurrensklausul",
    label: "Konkurrensklausuler",
    description: "När är en klausul rimlig? Vad kan du förhandla bort?",
  },
  {
    href: "/guide/uppsagningstid",
    label: "Uppsägningstider",
    description: "Lagens miniminivåer och hur du läser avtalet rätt.",
  },
  {
    href: "/guide/granska-anstallningsavtal",
    label: "Granska ditt anställningsavtal",
    description: "Steg-för-steg: vad du ska titta på innan du skriver under.",
  },
];

/** Returns all pages except the current one */
export function getRelatedPages(currentHref: string): RelatedPage[] {
  return ALL_SEO_PAGES.filter(p => p.href !== currentHref);
}
