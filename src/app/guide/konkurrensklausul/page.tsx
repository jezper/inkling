import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

const SITE = "https://kollaavtalet.com";

export const metadata: Metadata = {
  title: "Konkurrensklausul i anställningsavtal - vad gäller?",
  description:
    "En konkurrensklausul begränsar vad du får göra efter att du slutat. Här förklarar vi när de är giltiga, hur länge de gäller och vad du kan förhandla.",
  alternates: {
    canonical: "/guide/konkurrensklausul",
  },
  openGraph: {
    title: "Konkurrensklausul i anställningsavtal | Kolla Avtalet",
    description:
      "En konkurrensklausul begränsar vad du får göra efter att du slutat. När är de giltiga, hur länge gäller de och vad kan du förhandla?",
    url: "/guide/konkurrensklausul",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Konkurrensklausul i anställningsavtal - vad gäller?",
  description:
    "En konkurrensklausul begränsar vad du får göra efter att du slutat.",
  url: `${SITE}/guide/konkurrensklausul`,
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
      name: "Avtalslagen",
      legislationIdentifier: "SFS 1915:218",
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
      name: "Konkurrensklausul",
      item: `${SITE}/guide/konkurrensklausul`,
    },
  ],
};

const TOC = [
  { id: "vad-ar-konkurrensklausul", label: "Vad är en konkurrensklausul?" },
  { id: "rimlighetsbedömning", label: "Rimlighetsbedömning" },
  { id: "tidsgransen", label: "Tidsgränser: 9-24 månader" },
  { id: "kompensation", label: "Kompensationskravet" },
  { id: "geografiskt", label: "Geografisk begränsning", level: 2 as const },
  { id: "forhandla", label: "Vad kan du förhandla?" },
  { id: "ogiltiga", label: "När är klausulen ogiltig?" },
];

export default function KonkurrensklausulPage() {
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
        title="Konkurrensklausuler i anställningsavtal"
        lead="En konkurrensklausul kan begränsa din rätt att ta anställning hos konkurrenter eller starta eget efter att du har slutat. De är tillåtna - men bara om de är rimliga i sin utformning."
        eyebrow="Guide - Arbetsrätt"
        updatedAt="2026-03-01"
        breadcrumbs={[
          { label: "Hem", href: "/" },
          { label: "Guider", href: "/guide" },
          { label: "Konkurrensklausul" },
        ]}
        toc={TOC}
        related={getRelatedPages("/guide/konkurrensklausul")}
      >
        <h2 id="vad-ar-konkurrensklausul">Vad är en konkurrensklausul?</h2>
        <p>
          En konkurrensklausul (även kallad konkurrensförbudsklausul) är en
          avtalsklausul som begränsar vad du får göra efter att du har avslutat
          din anställning. Vanliga begränsningar är att du inte får:
        </p>
        <ul>
          <li>Ta anställning hos en direkt konkurrent</li>
          <li>Starta en konkurrerande verksamhet</li>
          <li>Ta med dig kunder till en ny arbetsgivare</li>
        </ul>
        <p>
          Det finns ingen specifik lag som reglerar konkurrensklausuler i
          anställningsavtal. Bedömningen görs istället mot allmänna
          avtalsrättsliga principer och Avtalslagen paragraf 36 (SFS 1915:218),
          generalklausulen om oskäliga avtalsvillkor.
        </p>

        <h2 id="rimlighetsbedömning">Rimlighetsbedömning</h2>
        <p>
          En konkurrensklausul måste vara rimlig för att hålla vid en
          rättslig prövning. Arbetsdomstolen bedömer rimligheten utifrån
          ett antal faktorer:
        </p>
        <ul>
          <li>Har arbetsgivaren ett <strong>legitimt syfte</strong> att skydda?</li>
          <li>Är begränsningen <strong>inte mer ingripande än nödvändigt</strong>?</li>
          <li>Är <strong>kompensation</strong> utbetald under bindningstiden?</li>
          <li>Är <strong>tidsgränsen</strong> rimlig?</li>
        </ul>
        <p>
          1969 slöt Arbetsgivarverket och PTK ett avtal om begränsningar av
          konkurrensklausuler för tjänstemän. Det avtalet är fortfarande en
          viktig referenspunkt - även om det tekniskt sett bara gäller
          kollektivavtalsanslutna.
        </p>

        <h2 id="tidsgransen">Tidsgränser: 9-24 månader</h2>
        <p>
          Enligt 1969 års avtal bör konkurrensklausuler normalt inte gälla
          längre än:
        </p>
        <ul>
          <li><strong>9 månader</strong> som normalfall</li>
          <li><strong>24 månader</strong> som absolut maximum vid exceptionella omständigheter</li>
        </ul>
        <p>
          En klausul på 36 månader eller längre är normalt ogiltig. Det spelar
          ingen roll vad som står i avtalet - om bindningstiden är orimlig
          kan den jämkas eller ogiltigförklaras.
        </p>

        {/* Inline CTA */}
        <InlineCTA />

        <h2 id="kompensation">Kompensationskravet</h2>
        <p>
          Om en konkurrensklausul begränsar din möjlighet att försörja dig
          har du normalt rätt till kompensation under bindningstiden. Det
          gäller om begränsningen är reell - det vill säga om du faktiskt
          hindras från att ta arbete inom ditt yrkesområde.
        </p>
        <p>
          Kompensation brukar ligga på 60-100 procent av din lön under den tid
          klausulen gäller. Avtal som saknar kompensation riskerar att
          bedömas som oskäliga.
        </p>

        <h3 id="geografiskt">Geografisk begränsning</h3>
        <p>
          En konkurrensklausul som gäller hela Sverige - eller världen - utan
          geografisk motivering är vanligen för vid. En säljare som jobbat i
          Malmö-regionen bör normalt inte vara bunden av ett förbud mot hela
          Skandinavien.
        </p>

        <h2 id="forhandla">Vad kan du förhandla?</h2>
        <p>
          Konkurrensklausuler är avtalsvillkor. De går att förhandla - ofta
          mer än arbetstagare tror. Vanliga förhandlingspunkter:
        </p>
        <ul>
          <li>Korta bindningstiden från 24 till 9 månader</li>
          <li>Begränsa klausulens geografiska räckvidd</li>
          <li>Lägg till en kompensationsklausul</li>
          <li>Avgränsa vad som räknas som &quot;konkurrens&quot;</li>
          <li>Lägg till en klausul om att klausulen faller om arbetsgivaren säger upp dig</li>
        </ul>

        <h2 id="ogiltiga">När är klausulen ogiltig?</h2>
        <p>
          En domstol kan jämka eller ogiltigförklara en konkurrensklausul om den
          är oskälig enligt Avtalslagen paragraf 36 (SFS 1915:218). Det är vanligtvis aktuellt om:
        </p>
        <ul>
          <li>Bindningstiden är väsentligt längre än 24 månader</li>
          <li>Ingen kompensation ges trots reell inskränkning</li>
          <li>Det saknas ett legitimt skyddsintresse från arbetsgivarens sida</li>
          <li>Klausulen gäller vid arbetsgivarens eget initiativ till uppsägning</li>
        </ul>
        <div className="law-box">
          <p>
            <strong>Kolla Avtalet kontrollerar:</strong> Vi identifierar
            konkurrensklausuler i ditt avtal och flaggar bindningstid,
            kompensationsskrivningar och geografisk räckvidd mot etablerad
            praxis.
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
