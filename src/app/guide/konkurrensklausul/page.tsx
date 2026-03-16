import type { Metadata } from "next";
import { ArticleLayout, InlineCTA } from "@/components/article-layout";
import { getRelatedPages } from "@/lib/seo-pages";

export const metadata: Metadata = {
  title: "Konkurrensklausul i anställningsavtal — vad gäller? | Kolla Avtalet",
  description:
    "En konkurrensklausul begränsar vad du får göra efter att du slutat. Här förklarar vi när de är giltiga, hur länge de gäller och vad du kan förhandla.",
};

const TOC = [
  { id: "vad-ar-konkurrensklausul", label: "Vad är en konkurrensklausul?" },
  { id: "rimlighetsbedömning", label: "Rimlighetsbedömning" },
  { id: "tidsgransen", label: "Tidsgränsen: 9–24 månader" },
  { id: "kompensation", label: "Kompensationskravet" },
  { id: "geografiskt", label: "Geografisk begränsning", level: 2 as const },
  { id: "forhandla", label: "Vad kan du förhandla?" },
  { id: "ogiltiga", label: "När är klausulen ogiltig?" },
];

export default function KonkurrensklausulPage() {
  return (
    <ArticleLayout
      title="Konkurrensklausuler i anställningsavtal"
      lead="En konkurrensklausul kan begränsa din rätt att ta anställning hos konkurrenter eller starta eget efter att du har slutat. De är tillåtna — men bara om de är rimliga i sin utformning."
      eyebrow="Guide · Arbetsrätt"
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
        avtalsrättsliga principer och Avtalslagen § 36 (generalklausulen om
        oskäliga avtalsvillkor).
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
        viktig referenspunkt — även om det tekniskt sett bara gäller
        kollektivavtalsanslutna.
      </p>

      <h2 id="tidsgransen">Tidsgränsen: 9–24 månader</h2>
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
        ingen roll vad som står i avtalet — om bindningstiden är orimlig
        kan den jämkas eller ogiltigförklaras.
      </p>

      {/* Inline CTA — midpoint */}
      <InlineCTA />

      <h2 id="kompensation">Kompensationskravet</h2>
      <p>
        Om en konkurrensklausul begränsar din möjlighet att försörja dig
        har du normalt rätt till kompensation under bindningstiden. Det
        gäller om begränsningen är reell — det vill säga om du faktiskt
        hindras från att ta arbete inom ditt yrkesområde.
      </p>
      <p>
        Kompensation brukar ligga på 60–100 % av din lön under den tid
        klausulen gäller. Avtal som saknar kompensation riskerar att
        bedömas som oskäliga.
      </p>

      <h3 id="geografiskt">Geografisk begränsning</h3>
      <p>
        En konkurrensklausul som gäller hela Sverige — eller världen — utan
        geografisk motivering är vanligen för vid. En säljare som jobbat i
        Malmö-regionen bör normalt inte vara bunden av ett förbud mot hela
        Skandinavien.
      </p>

      <h2 id="forhandla">Vad kan du förhandla?</h2>
      <p>
        Konkurrensklausuler är avtalsvillkor. De går att förhandla — ofta
        mer än arbetstagare tror. Vanliga förhandlingspunkter:
      </p>
      <ul>
        <li>Korta bindningstiden från 24 till 9 månader</li>
        <li>Begränsa klausulens geografiska räckvidd</li>
        <li>Lägg till en kompensationsklausul</li>
        <li>Avgränsa vad som räknas som "konkurrens"</li>
        <li>Lägg till en klausul om att klausulen faller om arbetsgivaren säger upp dig</li>
      </ul>

      <h2 id="ogiltiga">När är klausulen ogiltig?</h2>
      <p>
        En domstol kan jämka eller ogiltigförklara en konkurrensklausul om den
        är oskälig enligt Avtalslagen § 36. Det är vanligtvis aktuellt om:
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
    </ArticleLayout>
  );
}
