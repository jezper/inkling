import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Provanställning — regler och rättigheter | Kolla Avtalet",
  description:
    "Provanställning får vara högst 6 månader. Här förklarar vi vad som gäller, när den kan avbrytas och vad du ska kontrollera i ditt avtal.",
};

const TOC = [
  { id: "vad-ar-provanstallning", label: "Vad är provanställning?" },
  { id: "maximal-langd", label: "Maximal längd: 6 månader" },
  { id: "avbryta", label: "Avbryta en provanställning" },
  { id: "overgang", label: "Övergång till fast anställning" },
  { id: "vad-ska-stå", label: "Vad ska stå i avtalet?", level: 2 as const },
  { id: "vanliga-fel", label: "Vanliga fel i avtal" },
];

export default function ProvanstallningPage() {
  return (
    <ArticleLayout
      title="Provanställning"
      lead="En provanställning är en tidsbegränsad anställning som arbetsgivaren kan använda för att pröva en nyanställd. Den har ett tak på sex månader och omvandlas automatiskt till tillsvidareanställning om ingendera part avbryter den."
      eyebrow="Lag · LAS § 6"
      updatedAt="2026-03-01"
      breadcrumbs={[
        { label: "Hem", href: "/" },
        { label: "Regler", href: "/regler" },
        { label: "Provanställning" },
      ]}
      toc={TOC}
      related={getRelatedPages("/regler/provanstallning")}
    >
      <h2 id="vad-ar-provanstallning">Vad är provanställning?</h2>
      <p>
        Provanställning regleras i LAS § 6. Det är en anställningsform som
        tillåter arbetsgivaren att pröva en arbetstagare under en begränsad
        period innan anställningen övergår till ett tillsvidareavtal.
      </p>
      <p>
        En provanställning skiljer sig från en visstidsanställning: syftet är
        inte att täcka ett tillfälligt behov, utan att utvärdera om
        arbetstagaren passar i rollen.
      </p>

      <h2 id="maximal-langd">Maximal längd: 6 månader</h2>
      <blockquote>
        <p>
          "Avtal om anställning på prov får träffas, om prövotiden är längst
          sex månader."
        </p>
        <cite>LAS § 6</cite>
      </blockquote>
      <p>
        Provanställningen får aldrig vara längre än sex månader. Om ditt avtal
        anger sju månader eller mer är den överskjutande tiden ogiltig — lagen
        gäller ändå.
      </p>
      <p>
        En provanställning kan inte förnyas hos samma arbetsgivare för samma
        typ av arbete. Arbetsgivaren kan alltså inte låta dig provanstas i sex
        månader, avbryta, och sedan provanstas igen.
      </p>

      <h2 id="avbryta">Avbryta en provanställning</h2>
      <p>
        Både arbetsgivaren och arbetstagaren kan avbryta provanställningen
        i förtid utan att ange skäl. Det finns inget krav på saklig grund
        (som vid uppsägning av tillsvidareanställning).
      </p>
      <p>
        Undantag: arbetsgivaren får inte avbryta provanställningen av skäl som
        strider mot diskrimineringslagen, föräldraledighetslagen eller andra
        skyddslagar.
      </p>

      {/* Inline CTA placed roughly at the midpoint */}
      <InlineCTA />

      <h2 id="overgang">Övergång till fast anställning</h2>
      <p>
        Om provanställningen löper ut utan att någon part meddelar att den
        ska avslutas, <strong>övergår den automatiskt till
        tillsvidareanställning</strong>. Inget nytt avtal behöver tecknas.
      </p>
      <p>
        Det är tillräckligt att arbetsgivaren meddelar dig senast vid
        prövotidens slut om provanställningen inte ska fortsätta. Meddelandet
        behöver inte vara skriftligt, men skriftlighet rekommenderas för att
        undvika tvister.
      </p>

      <h3 id="vad-ska-stå">Vad ska stå i avtalet?</h3>
      <p>Ditt avtal bör tydligt ange:</p>
      <ul>
        <li>Att det rör sig om en provanställning</li>
        <li>Prövotidens längd (max 6 månader)</li>
        <li>Vad som gäller om provanställningen avbryts i förtid</li>
        <li>Eventuell förlängning vid sjukdom eller föräldraledighet</li>
      </ul>

      <h2 id="vanliga-fel">Vanliga fel i avtal</h2>
      <p>
        Det förekommer avtal som anger längre prövotid än sex månader,
        ofta av misstag. Det förekommer också avtal som ger arbetsgivaren
        rätt att "förlänga" provanställningen, vilket normalt inte är
        tillåtet om det leder till att den totala prövotiden överstiger
        sex månader.
      </p>
      <div className="law-box">
        <p>
          <strong>Kolla Avtalet kontrollerar:</strong> Vi identifierar om
          prövotidens längd överstiger lagens gräns på sex månader, och
          flaggar formuleringar som kan innebära otillåten förlängning.
        </p>
      </div>
    </ArticleLayout>
  );
}
