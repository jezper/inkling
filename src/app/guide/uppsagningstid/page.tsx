import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

const SITE = "https://kollaavtalet.nu";

export const metadata: Metadata = {
  title: "Uppsägningstider - vad lagen kräver",
  description:
    "Uppsägningstiden beror på hur länge du jobbat. LAS anger minimigränser. Ditt avtal kan ge dig mer, men aldrig mindre. Här går vi igenom reglerna.",
  alternates: {
    canonical: "/guide/uppsagningstid",
  },
  openGraph: {
    title: "Uppsägningstider - vad lagen kräver | Kolla Avtalet",
    description:
      "Uppsägningstiden beror på hur länge du jobbat. LAS anger minimigränser. Ditt avtal kan ge dig mer, men aldrig mindre.",
    url: "/guide/uppsagningstid",
    type: "article",
  },
};

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Uppsägningstider - vad lagen kräver",
  description:
    "Uppsägningstiden beror på hur länge du jobbat. LAS (SFS 1982:80) anger minimigränser.",
  url: `${SITE}/guide/uppsagningstid`,
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
      name: "Uppsägningstider",
      item: `${SITE}/guide/uppsagningstid`,
    },
  ],
};

const TOC = [
  { id: "lagens-minimum", label: "Lagens minimigränser" },
  { id: "arbetstagare-vs-arbetsgivare", label: "Arbetstagare vs. arbetsgivare" },
  { id: "avtal-kan-ge-mer", label: "Avtalet kan ge mer" },
  { id: "lon-under-uppsagningstid", label: "Lön under uppsägningstid" },
  { id: "fritstallning", label: "Friställning", level: 2 as const },
  { id: "lasa-avtalet", label: "Så läser du ditt avtal" },
];

export default function UppsagningstidPage() {
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
        title="Uppsägningstider"
        lead="Hur lång uppsägningstid du har beror på hur länge du har jobbat hos arbetsgivaren. LAS anger ett minimum. Ditt avtal kan vara förmånligare - men aldrig sämre."
        eyebrow="Guide - LAS paragraf 11"
        updatedAt="2026-03-01"
        breadcrumbs={[
          { label: "Hem", href: "/" },
          { label: "Guider", href: "/guide" },
          { label: "Uppsägningstider" },
        ]}
        toc={TOC}
        related={getRelatedPages("/guide/uppsagningstid")}
      >
        <h2 id="lagens-minimum">Lagens minimigränser</h2>
        <p>
          Uppsägningstider regleras i LAS paragraf 11 (SFS 1982:80). Miniminivåerna utgår från din
          sammanlagda anställningstid hos arbetsgivaren:
        </p>
        <ul>
          <li>Kortare än 2 år: <strong>1 månad</strong></li>
          <li>2 men kortare än 4 år: <strong>2 månader</strong></li>
          <li>4 men kortare än 6 år: <strong>3 månader</strong></li>
          <li>6 men kortare än 8 år: <strong>4 månader</strong></li>
          <li>8 men kortare än 10 år: <strong>5 månader</strong></li>
          <li>10 år eller längre: <strong>6 månader</strong></li>
        </ul>
        <blockquote>
          <p>
            &quot;Arbetsgivaren skall iaktta en minsta uppsägningstid av en månad
            [...] Längre uppsägningstider gäller beroende på den sammanlagda
            anställningstiden.&quot;
          </p>
          <cite>LAS paragraf 11 (SFS 1982:80)</cite>
        </blockquote>

        <h2 id="arbetstagare-vs-arbetsgivare">Arbetstagare vs. arbetsgivare</h2>
        <p>
          LAS-tabellen ovan gäller <strong>arbetsgivarens</strong>{" "}
          uppsägningstid mot dig. Som arbetstagare har du lagstadgad
          minimiuppsägningstid på en månad, oavsett anställningstid.
        </p>
        <p>
          I praktiken brukar avtal ange samma uppsägningstid åt båda håll -
          men det är inte ett lagkrav. Avtalet kan ge dig längre uppsägningstid
          gentemot arbetsgivaren utan att ge arbetsgivaren samma mot dig.
        </p>

        <h2 id="avtal-kan-ge-mer">Avtalet kan ge mer</h2>
        <p>
          Ditt anställningsavtal kan ange längre uppsägningstider än LAS kräver.
          Det är fullt tillåtet och gynnar normalt arbetstagaren.
        </p>
        <p>
          Vad avtalet inte kan göra är att ange kortare uppsägningstid än lagen.
          Om ditt avtal anger kortare tid, är det den lagenliga tiden som gäller -
          oavsett vad som står i kontraktet.
        </p>

        {/* Inline CTA */}
        <InlineCTA />

        <h2 id="lon-under-uppsagningstid">Lön under uppsägningstid</h2>
        <p>
          Under uppsägningstiden behåller du som huvudregel din fulla lön och
          övriga anställningsförmåner. Du är normalt skyldig att arbeta under
          perioden, om inte annat avtalas.
        </p>

        <h3 id="fritstallning">Friställning</h3>
        <p>
          Friställning innebär att arbetsgivaren betalar din lön under
          uppsägningstiden men befriar dig från arbetsskyldigheten. Det är
          relativt vanligt vid högre befattningar eller om det skulle uppstå
          intressekonflikter att du är kvar på arbetsplatsen.
        </p>
        <p>
          Friställning är inte reglerat i LAS utan uppstår antingen genom
          avtalsklausul eller arbetsgivarens ensidiga beslut. Under friställning
          kan du normalt ta ny anställning.
        </p>

        <h2 id="lasa-avtalet">Så läser du ditt avtal</h2>
        <p>
          Leta efter rubriken Uppsägningstid eller Upphörande av anställning. Kontrollera:
        </p>
        <ul>
          <li>Anges uppsägningstid för båda parter?</li>
          <li>Är din tid (arbetstagaren) minst 1 månad?</li>
          <li>Är arbetsgivarens tid minst den LAS kräver för din anställningstid?</li>
          <li>Finns det koppling till konkurrensklausul under uppsägningstiden?</li>
        </ul>
        <div className="law-box">
          <p>
            <strong>Kolla Avtalet kontrollerar:</strong> Vi identifierar
            uppsägningstiden i ditt avtal och jämför den mot LAS-tabellen.
            Om arbetsgivaren har kortare tid än lagen kräver flaggar vi det.
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
