import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "LAS — Lagen om anställningsskydd | Kolla Avtalet",
  description:
    "LAS reglerar din rätt till fast anställning, uppsägningstid och turordning. Här förklarar vi vad lagen säger och vad du ska leta efter i ditt avtal.",
};

const TOC = [
  { id: "vad-ar-las", label: "Vad är LAS?" },
  { id: "vem-skyddas", label: "Vem skyddas av LAS?" },
  { id: "anstallningsformer", label: "Anställningsformer" },
  { id: "uppsagningstid", label: "Uppsägningstid enligt LAS", level: 2 as const },
  { id: "turordning", label: "Turordningsregler (§ 22)" },
  { id: "avtalet-vs-lagen", label: "Avtalet vs. lagen" },
  { id: "undantag", label: "Undantag och kollektivavtal" },
];

export default function LASPage() {
  return (
    <ArticleLayout
      title="LAS — Lagen om anställningsskydd"
      lead="LAS ger dig grundläggande skydd som arbetstagare i Sverige. Den reglerar anställningsformer, uppsägningstider och rätten att vara kvar om företaget drar ned."
      eyebrow="Lag · SFS 1982:80"
      updatedAt="2026-03-01"
      breadcrumbs={[
        { label: "Hem", href: "/" },
        { label: "Regler", href: "/regler" },
        { label: "LAS" },
      ]}
      toc={TOC}
      related={getRelatedPages("/regler/las")}
    >
      <h2 id="vad-ar-las">Vad är LAS?</h2>
      <p>
        Lagen om anställningsskydd (LAS) trädde i kraft 1982 och är en av de
        viktigaste lagarna på den svenska arbetsmarknaden. Den gäller som
        huvudregel alla arbetstagare utom de som har en ledande ställning.
      </p>
      <p>
        LAS är en <strong>semidispositiv lag</strong> — det betyder att delar
        av den kan avtalas bort via kollektivavtal, men inte via enskilda
        anställningsavtal. Du kan alltså inte ge upp dina rättigheter bara
        för att det står i ditt kontrakt.
      </p>

      <h2 id="vem-skyddas">Vem skyddas av LAS?</h2>
      <p>
        Lagen gäller i princip alla anställda i Sverige. Det finns några
        undantag:
      </p>
      <ul>
        <li>Arbetstagare i arbetsgivarens hushåll</li>
        <li>Arbetstagare i företagsledande ställning</li>
        <li>Arbetstagare under 18 år (delvis undantagna)</li>
      </ul>
      <p>
        De flesta som jobbar i Sverige — oavsett om de är födda här eller
        invandrat — omfattas av LAS.
      </p>

      <h2 id="anstallningsformer">Anställningsformer</h2>
      <p>
        LAS utgår från att tillsvidareanställning (fast anställning) är
        huvudregeln. Tidsbegränsade anställningar är tillåtna, men under
        begränsade former.
      </p>
      <blockquote>
        <p>
          "Avtal om tidsbegränsad anställning får träffas för allmän
          visstidsanställning, för vikariat, för säsongsarbete samt när
          arbetstagaren har fyllt 67 år."
        </p>
        <cite>LAS § 5</cite>
      </blockquote>
      <p>
        En allmän visstidsanställning (ALVA) övergår automatiskt till
        tillsvidareanställning om den sammanlagda anställningstiden överstiger
        12 månader under en femårsperiod.
      </p>

      <h3 id="uppsagningstid">Uppsägningstid enligt LAS</h3>
      <p>
        Minsta lagstadgade uppsägningstid beror på hur länge du har jobbat
        hos arbetsgivaren:
      </p>
      <ul>
        <li>Anställningstid under 2 år: <strong>1 månad</strong></li>
        <li>2–4 år: <strong>2 månader</strong></li>
        <li>4–6 år: <strong>3 månader</strong></li>
        <li>6–8 år: <strong>4 månader</strong></li>
        <li>8–10 år: <strong>5 månader</strong></li>
        <li>10 år eller mer: <strong>6 månader</strong></li>
      </ul>
      <p>
        Ditt avtal kan ange längre uppsägningstid — det är tillåtet. Det kan
        dock inte ange kortare tid än vad lagen kräver.
      </p>

      {/* Inline CTA — placed after ~45% of the content */}
      <InlineCTA />

      <h2 id="turordning">Turordningsregler (§ 22)</h2>
      <p>
        Vid driftinskränkning och uppsägning på grund av arbetsbrist måste
        arbetsgivaren följa turordningsregler. Principen är <strong>sist
        in, först ut</strong> — de med kortast anställningstid sägs upp
        först, förutsatt att de med längre anställningstid har tillräckliga
        kvalifikationer.
      </p>
      <p>
        Sedan lagändringen 2022 får arbetsgivare med upp till 50 anställda
        undanta upp till fem nyckelpersoner från turordningen.
      </p>

      <h2 id="avtalet-vs-lagen">Avtalet vs. lagen</h2>
      <p>
        Ditt anställningsavtal kan ge dig mer skydd än LAS, men aldrig
        mindre. Om avtalet anger kortare uppsägningstid än lagen, gäller
        lagen ändå.
      </p>
      <div className="law-box">
        <p>
          <strong>Vad Kolla Avtalet kontrollerar:</strong> Vi jämför
          anställningstid, uppsägningstider och anställningsform mot LAS
          minimikrav. Om något avviker flaggar vi det med lagstöd.
        </p>
      </div>

      <h2 id="undantag">Undantag och kollektivavtal</h2>
      <p>
        Är du fackligt ansluten och din arbetsgivare har kollektivavtal kan
        det finnas avvikelser från LAS. Kollektivavtal kan förhandla bort
        eller modifiera delar av lagen — men bara till din fördel, och aldrig
        under ett visst golv.
      </p>
      <p>
        Kolla Avtalet granskar mot lagtext. Kollektivavtal ingår inte i V1 av
        tjänsten.
      </p>
    </ArticleLayout>
  );
}
