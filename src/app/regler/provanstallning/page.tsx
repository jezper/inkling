import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

const SITE = "https://kollaavtalet.nu";

export const metadata: Metadata = {
  title: "Provanställning - regler och rättigheter",
  description:
    "Provanställning får vara högst 6 månader. Här förklarar vi vad som gäller, när den kan avbrytas och vad du ska kontrollera i ditt avtal.",
  alternates: {
    canonical: "/regler/provanstallning",
  },
  openGraph: {
    title: "Provanställning - regler och rättigheter | Kolla Avtalet",
    description:
      "Provanställning får vara högst 6 månader. Här förklarar vi vad som gäller, när den kan avbrytas och vad du ska kontrollera i ditt avtal.",
    url: "/regler/provanstallning",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Provanställning - regler och rättigheter",
  description:
    "Provanställning får vara högst 6 månader enligt LAS paragraf 6.",
  url: `${SITE}/regler/provanstallning`,
  dateModified: "2026-03-01",
  datePublished: "2026-03-01",
  author: {
    "@type": "Organization",
    name: "Kolla Avtalet",
    url: SITE,
  },
  publisher: {
    "@type": "Organization",
    name: "Kolla Avtalet",
    url: SITE,
  },
  inLanguage: "sv-SE",
  about: [
    {
      "@type": "Legislation",
      name: "Lagen om anställningsskydd",
      legislationIdentifier: "SFS 1982:80",
      jurisdiction: "SE",
    },
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Hem",
      item: SITE,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Regler",
      item: `${SITE}/regler`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Provanställning",
      item: `${SITE}/regler/provanstallning`,
    },
  ],
};

const TOC = [
  { id: "vad-ar-provanstallning", label: "Vad är provanställning?" },
  { id: "maximal-langd", label: "Maximal längd: 6 månader" },
  { id: "avbryta", label: "Avbryta en provanställning" },
  { id: "overgang", label: "Övergång till fast anställning" },
  { id: "vad-ska-sta", label: "Vad ska stå i avtalet?", level: 2 as const },
  { id: "vanliga-fel", label: "Vanliga fel i avtal" },
];

export default function ProvanstallningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ArticleLayout
        title="Provanställning"
        lead="En provanställning är en tidsbegränsad anställning som arbetsgivaren kan använda för att pröva en nyanställd. Den har ett tak på sex månader och omvandlas automatiskt till tillsvidareanställning om ingendera part avbryter den."
        eyebrow="Lag - LAS paragraf 6"
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
          Provanställning regleras i LAS paragraf 6 (SFS 1982:80). Det är en anställningsform som
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
            &quot;Avtal om anställning på prov får träffas, om provotiden är längst
            sex månader.&quot;
          </p>
          <cite>LAS paragraf 6 (SFS 1982:80)</cite>
        </blockquote>
        <p>
          Provanställningen får aldrig vara längre än sex månader. Om ditt avtal
          anger sju månader eller mer är den överskjutande tiden ogiltig - lagen
          gäller ändå.
        </p>
        <p>
          En provanställning kan inte förnyas hos samma arbetsgivare för samma
          typ av arbete. Arbetsgivaren kan alltså inte låta dig provanställas i sex
          månader, avbryta, och sedan provanställas igen.
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

        {/* Inline CTA */}
        <InlineCTA />

        <h2 id="overgang">Övergång till fast anställning</h2>
        <p>
          Om provanställningen löper ut utan att någon part meddelar att den
          ska avslutas, <strong>övergår den automatiskt till
          tillsvidareanställning</strong>. Inget nytt avtal behöver tecknas.
        </p>
        <p>
          Det är tillräckligt att arbetsgivaren meddelar dig senast vid
          provotidens slut om provanställningen inte ska fortsätta. Meddelandet
          behöver inte vara skriftligt, men skriftlighet rekommenderas för att
          undvika tvister.
        </p>

        <h3 id="vad-ska-sta">Vad ska stå i avtalet?</h3>
        <p>Ditt avtal bör tydligt ange:</p>
        <ul>
          <li>Att det rör sig om en provanställning</li>
          <li>Provotidens längd (max 6 månader)</li>
          <li>Vad som gäller om provanställningen avbryts i förtid</li>
          <li>Eventuell förlängning vid sjukdom eller föräldraledighet</li>
        </ul>

        <h2 id="vanliga-fel">Vanliga fel i avtal</h2>
        <p>
          Det förekommit avtal som anger längre provotid än sex månader,
          ofta av misstag. Det förekommit också avtal som ger arbetsgivaren
          rätt att &quot;förlänga&quot; provanställningen, vilket normalt inte är
          tillåtet om det leder till att den totala provotiden överstiger
          sex månader.
        </p>
        <div className="law-box">
          <p>
            <strong>Kolla Avtalet kontrollerar:</strong> Vi identifierar om
            provotidens längd överstiger lagens gräns på sex månader, och
            flaggar formuleringar som kan innebära otillåten förlängning.
          </p>
        </div>

        <div className="law-box">
          <p>
            <strong>Ansvarsbegränsning:</strong> Denna sida innehåller juridisk
            information, inte juridisk rådgivning. För specifika frågor om ditt
            avtal, kontakta ett fackförbund eller en arbetsrättsjurist.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
