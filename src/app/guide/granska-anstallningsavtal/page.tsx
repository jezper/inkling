import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

const SITE = "https://kollaavtalet.nu";

export const metadata: Metadata = {
  title: "Granska ditt anställningsavtal - steg för steg",
  description:
    "Vad ska du titta på innan du skriver under? Vi går igenom de viktigaste punkterna i ett anställningsavtal och förklarar vad som är standard och vad som är avvikande.",
  alternates: {
    canonical: "/guide/granska-anstallningsavtal",
  },
  openGraph: {
    title: "Granska ditt anställningsavtal - steg för steg | Kolla Avtalet",
    description:
      "Vad ska du titta på innan du skriver under? De sju viktigaste punkterna i ett anställningsavtal förklarade.",
    url: "/guide/granska-anstallningsavtal",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Granska ditt anställningsavtal - steg för steg",
  description:
    "Vad ska du titta på innan du skriver under? De sju viktigaste punkterna i ett anställningsavtal.",
  url: `${SITE}/guide/granska-anstallningsavtal`,
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
      name: "Guider",
      item: `${SITE}/guide`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Granska anställningsavtal",
      item: `${SITE}/guide/granska-anstallningsavtal`,
    },
  ],
};

const TOC = [
  { id: "innan-du-skriver-under", label: "Innan du skriver under" },
  { id: "anstallningsform", label: "1. Anställningsform" },
  { id: "lon-och-formaner", label: "2. Lön och förmåner" },
  { id: "arbetstid", label: "3. Arbetstid" },
  { id: "uppsagningstid-check", label: "4. Uppsägningstid" },
  { id: "konkurrensklausul-check", label: "5. Konkurrensklausul" },
  { id: "sekretess", label: "6. Sekretessklausul" },
  { id: "immateriella-rattigheter", label: "7. Immateriella rättigheter" },
  { id: "vanliga-fallgropar", label: "Vanliga fallgropar", level: 2 as const },
  { id: "nar-forhandla", label: "När ska du förhandla?" },
];

export default function GranskaAnstallningsavtalPage() {
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
        title="Granska ditt anställningsavtal"
        lead="De flesta skriver under utan att läsa igenom ordentligt. Det finns sju punkter du alltid bör kontrollera - oavsett om det är ditt första eller tionde avtal."
        eyebrow="Guide - Steg för steg"
        updatedAt="2026-03-01"
        breadcrumbs={[
          { label: "Hem", href: "/" },
          { label: "Guider", href: "/guide" },
          { label: "Granska anställningsavtal" },
        ]}
        toc={TOC}
        related={getRelatedPages("/guide/granska-anstallningsavtal")}
      >
        <h2 id="innan-du-skriver-under">Innan du skriver under</h2>
        <p>
          Ett anställningsavtal är ett juridiskt bindande dokument. Villkoren
          du skriver under på gäller ofta i flera år och kan påverka vad du
          får göra - och inte göra - långt efter att du slutat.
        </p>
        <p>
          Det är rimligt att be om tid att läsa igenom avtalet. En seriös
          arbetsgivare förväntar det. Fråga om du inte förstår ett villkor.
          Det är bättre att fråga nu än att tvista om det senare.
        </p>

        <h2 id="anstallningsform">1. Anställningsform</h2>
        <p>
          Kontrollera om det är en <strong>tillsvidareanställning</strong> (fast),
          en <strong>provanställning</strong> eller en
          <strong>visstidsanställning</strong>. Det ska stå tydligt i avtalet.
        </p>
        <p>
          Om det är en provanställning: kontrollera att provotiden inte
          överstiger sex månader (LAS paragraf 6, SFS 1982:80). Om det är visstid: kontrollera
          slutdatumet och om det finns en möjlighet till förlängning.
        </p>

        <h2 id="lon-och-formaner">2. Lön och förmåner</h2>
        <p>
          Lön ska framgå i kronor, inte som ett intervall. Kontrollera om
          lönen avser fast lön, rörlig lön eller en kombination. Förmåner
          som friskvård, tjänstepension och bonus bör specificeras separat.
        </p>
        <p>
          Se till att lönen är densamma som vad som lovades muntligt. Om
          bonusar ingick i erbjudandet, kontrollera att de finns med och
          att villkoren för utbetalning är tydliga.
        </p>

        <h2 id="arbetstid">3. Arbetstid</h2>
        <p>
          Avtalet bör ange veckoarbetstid. Oreglerad arbetstid innebär
          normalt att du förväntas jobba tills uppgiften är klar - det kan
          vara rimligt i vissa roller, men det bör vara explicit, inte
          understött.
        </p>

        {/* Inline CTA */}
        <InlineCTA />

        <h2 id="uppsagningstid-check">4. Uppsägningstid</h2>
        <p>
          Kontrollera att uppsägningstiden är minst vad LAS kräver för din
          planerade anställningstid. Kontrollera också om uppsägningstiden
          är densamma för båda parter eller om den skiljer sig.
        </p>
        <p>
          En längre ömsesidig uppsägningstid kan vara en fördel - du vet
          att du har ekonomisk trygghet om arbetsgivaren vill avsluta
          anställningen.
        </p>

        <h2 id="konkurrensklausul-check">5. Konkurrensklausul</h2>
        <p>
          Kontrollera om det finns en klausul som begränsar vad du får göra
          efter anställningen. Om det finns en: kontrollera bindningstiden
          (max 24 månader är normalt), om det utgår kompensation och om
          begränsningen är rimlig i förhållande till din roll.
        </p>
        <p>
          En konkurrensklausul på en juniornivå eller i en roll utan tillgång
          till känslig information är normalt svag i en rättslig prövning.
        </p>

        <h2 id="sekretess">6. Sekretessklausul</h2>
        <p>
          Sekretessklausuler är vanliga och normalt rimliga. Kontrollera att
          de definierar vad som är konfidentiellt - en klausul som gör allt
          du vet om företaget konfidentiellt för all framtid är orimlig.
        </p>
        <p>
          En välskriven sekretessklausul anger vad som skyddas, hur länge
          och vad som händer vid brott.
        </p>

        <h2 id="immateriella-rattigheter">7. Immateriella rättigheter</h2>
        <p>
          Om du skapar något i din anställning (kod, text, design, uppfinningar)
          reglerar avtalet normalt att arbetsgivaren äger resultatet. Det är
          rimligt för arbete du utför i tjänsten.
        </p>
        <p>
          Kontrollera om klausulen också täcker saker du gör{" "}
          <em>utanför arbetstid</em>. Sådana klausuler är problematiska om de
          inte begränsas till vad som faktiskt konkurrerar med arbetsgivarens
          verksamhet.
        </p>

        <h3 id="vanliga-fallgropar">Vanliga fallgropar</h3>
        <p>
          Dessa formuleringar förekommit i avtal och bör granskas extra
          noga:
        </p>
        <ul>
          <li><strong>&quot;Arbetsuppgifterna kan förändras&quot;</strong> utan begränsning - ger arbetsgivaren för bred omplaceringsrätt</li>
          <li><strong>&quot;Konkurrensförbudet gäller i 36 månader&quot;</strong> - överstiger vad som normalt är rimligt</li>
          <li><strong>&quot;Alla immateriella rättigheter, även utanför arbetstid&quot;</strong> - kan vara orimlig</li>
          <li><strong>Provotid 7 månader</strong> - överstiger LAS-gränsen på 6 månader</li>
        </ul>

        <h2 id="nar-forhandla">När ska du förhandla?</h2>
        <p>
          Anställningsavtal är förhandlingsbara - inklusive klausuler om
          konkurrens och sekretess. Den bästa tidpunkten att förhandla är
          innan du skrivit under, inte efteråt.
        </p>
        <p>
          Du behöver inte motivera varje förfrågan. &quot;Jag skulle vilja ändra
          konkurrensklausulen till 9 månader&quot; är ett rimligt yrkande, inte
          ett tecken på att du planerar att sluta direkt.
        </p>
        <div className="law-box">
          <p>
            <strong>Kolla Avtalet gör detta åt dig:</strong> Ladda upp ditt avtal.
            Vi identifierar alla sju punkterna ovan, jämför mot lag och
            flaggar formuleringar som avviker från det normala - med
            lagstöd och förklaring.
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
