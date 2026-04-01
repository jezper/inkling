import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Integritetspolicy",
  description:
    "Hur Kolla Avtalet hanterar dina uppgifter. Originaldokumentet lämnar aldrig din enhet. Ingen databas, inga konton.",
  alternates: {
    canonical: "/integritetspolicy",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function Integritetspolicy() {
  return (
    <>
      <Header />
      <main
        style={{
          paddingTop: "6rem",
          paddingBottom: "5rem",
          backgroundColor: "var(--background)",
        }}
      >
        <div
          style={{
            maxWidth: "42rem",
            margin: "0 auto",
            padding: "0 1.5rem",
          }}
        >
          {/* Rubrik */}
          <div style={{ marginBottom: "3rem" }}>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "var(--text-xs)",
                color: "var(--color-text-muted)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Senast uppdaterad 2026-03-16
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-4xl)",
                fontWeight: "var(--weight-bold)",
                color: "var(--color-text-primary)",
                letterSpacing: "var(--tracking-tight)",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              Integritetspolicy
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Den här texten beskriver hur Kolla Avtalet behandlar uppgifter om
              dig. Vi har försökt skriva den så att den faktiskt går att läsa,
              inte som ett juridiskt dokument.
            </p>
          </div>

          {/* Innehåll */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
            }}
          >
            {/* ------------------------------------------------------------------ */}
            <Section title="Det kortaste möjliga sammanfattningen">
              <p>
                Ditt avtal läses av din webbläsare, inte av vår server.
                Personuppgifter rensas bort på din enhet innan något skickas
                vidare. Vi sparar inga avtal, inga analyser och inga uppgifter
                om dig. Undantaget är din e-postadress om du väljer att få rapporten
                skickad till dig.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Vad som händer när du laddar upp ett avtal">
              <p>
                Ditt PDF-dokument läses av din webbläsare med hjälp av
                JavaScript som körs lokalt på din enhet. Originaldokumentet
                skickas aldrig till vår server, inte ens en kopia av det.
              </p>
              <p>
                Om PDF:en är skannad (det vill säga ett foto av ett papper) körs
                en OCR-process direkt i webbläsaren för att omvandla bilden till
                text. Även detta sker helt på din enhet.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="PII-rensning: vad som tas bort och hur">
              <p>
                Innan texten lämnar din enhet rensas identifierbara uppgifter
                bort automatiskt. Det sker med mönsterigenkänning (reguljära
                uttryck) direkt i webbläsaren.
              </p>
              <p>Följande uppgifter identifieras och ersätts med platshållare:</p>
              <ul>
                <li>E-postadresser → [EMAIL]</li>
                <li>Personnummer → [PERSONNUMMER]</li>
                <li>Bankkontonummer → [KONTONUMMER]</li>
                <li>Telefonnummer (svenska format) → [TELEFON]</li>
                <li>Gatuadresser → [ADRESS]</li>
                <li>Postnummer → [POSTNUMMER]</li>
                <li>
                  Namn på arbetstagare och arbetsgivare (heuristik baserad på
                  kontext i avtalstexten) → [PART A] respektive [PART B]
                </li>
                <li>
                  Övriga långa siffersträngar som kan vara identifierare →
                  [BORTTAGET]
                </li>
              </ul>
              <p>
                Rensningen är automatisk och ingen kan garantera att alla
                identifierande uppgifter fångas. Exempelvis kan ovanliga
                namnformat eller lokala adressformat missas. Enbart den
                anonymiserade texten skickas vidare för analys.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Vad som skickas till vår server">
              <p>
                När du väljer att köra analysen skickas den anonymiserade
                avtalstexten, med alla identifierare utbytta mot platshållare,
                till vår server. Inga personuppgifter ska vid det laget finnas
                kvar i texten.
              </p>
              <p>
                Vi lagrar inte avtalstexten. Den används enbart för att ställa
                en förfrågan till det analysstöd vi använder och skrivs sedan
                bort.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="IP-adress och hastighetsbegränsning">
              <p>
                För att förhindra missbruk begränsas antalet analyser per
                IP-adress till fem per timme. Din IP-adress används enbart för
                den räknaren och lagras inte på disk. Den finns bara i
                serverns arbetsminne och nollställs när servern startas om.
                IP-adressen kopplas aldrig till innehållet i ditt avtal.
              </p>
              <p>
                Den rättsliga grunden för behandlingen är berättigat intresse
                (GDPR art. 6.1 f): att skydda tjänsten mot automatiserat
                missbruk.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Analysstöd (Anthropic)">
              <p>
                Den anonymiserade avtalstexten skickas till Anthropics API för
                att generera analysen. Anthropic är ett amerikanskt bolag.
                Överföringen sker inom ramen för standardavtalsklausuler (SCC)
                som är en godkänd överföringsmekanism enligt GDPR.
              </p>
              <p>
                Anthropic anger i sina API-villkor att data som skickas via
                API:et inte används för att träna deras modeller. Vi kan inte
                självständigt garantera tredjepartsvillkor, men du kan läsa
                deras datapolicy på{" "}
                <ExternalLink href="https://www.anthropic.com/privacy">
                  anthropic.com/privacy
                </ExternalLink>
                .
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Betalning (Stripe)">
              <p>
                Betalningar hanteras av Stripe. När du väljer att betala för en
                fullständig rapport skickas du till Stripes betalningssida.
                Kolla Avtalet ser aldrig ditt kortnummer eller övriga
                betalningsuppgifter. De hanteras uteslutande av Stripe.
              </p>
              <p>
                Rättslig grund: avtalets fullgörande (GDPR art. 6.1 b) —
                betalningsuppgifterna behövs för att genomföra köpet.
                Stripe är databiträde med tecknat databehandlingsavtal (DPA).
                Stripe är ett amerikanskt bolag. Överföringen sker inom ramen
                för standardavtalsklausuler. Stripes integritetspolicy finns på{" "}
                <ExternalLink href="https://stripe.com/privacy">
                  stripe.com/privacy
                </ExternalLink>
                .
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="E-post (Resend)">
              <p>
                Om du anger en e-postadress för att få rapporten skickad till
                dig behandlas den e-postadressen av Resend, som är vår
                e-postleverantör. Resend är ett amerikanskt bolag. Överföringen
                sker inom ramen för standardavtalsklausuler.
              </p>
              <p>
                Rättslig grund: avtalets fullgörande (GDPR art. 6.1 b) —
                e-postadressen behövs för att leverera den köpta tjänsten.
                Din e-postadress används enbart för att leverera rapporten. Den
                sparas inte av oss, och vi skickar inga marknadsföringsutskick.
              </p>
              <p>
                Resends integritetspolicy finns på{" "}
                <ExternalLink href="https://resend.com/privacy">
                  resend.com/privacy
                </ExternalLink>
                .
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Hosting (Vercel)">
              <p>
                Tjänsten körs på Vercels infrastruktur. Vercel är ett
                amerikanskt bolag. All nätverkstrafik till och från tjänsten
                passerar Vercels servrar, vilket innebär att de tekniskt sett
                är ett databiträde. Vercels dataskyddspolicy finns på{" "}
                <ExternalLink href="https://vercel.com/legal/privacy-policy">
                  vercel.com/legal/privacy-policy
                </ExternalLink>
                .
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Rapportlänkar">
              <p>
                När du har betalt skapas en krypterad länk till din rapport.
                Länken innehåller analysresultatet i krypterat format (AES-256)
                inbakat i URL:en. Inga uppgifter lagras i en databas. Länken
                är giltig i 30 dagar, därefter fungerar den inte längre.
              </p>
              <p>
                Den som har länken kan se rapporten. Dela den bara med personer
                du litar på.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Vad som lagras i din webbläsare">
              <p>
                Kolla Avtalet använder{" "}
                <code
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9em",
                    backgroundColor: "var(--color-surface-100)",
                    padding: "0.1em 0.3em",
                    borderRadius: "var(--radius-xs)",
                  }}
                >
                  localStorage
                </code>{" "}
                för ett enda syfte: att spara ett referral-token om du kommit
                via en delad länk. Det används för att koppla ihop en eventuell
                rabatt vid betalning. Uppgiften tas bort automatiskt efter
                72 timmar.
              </p>
              <p>
                Vi använder inga cookies. Inga spårningsskript från sociala
                plattformar. Inga annonsverktyg.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Konton och databas">
              <p>
                Kolla Avtalet har inga konton och ingen databas. Det finns
                ingenting att logga in på, och vi lagrar inga uppgifter om dig
                kopplat till en identitet.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Dina rättigheter enligt GDPR">
              <p>
                Eftersom vi i princip inte lagrar personuppgifter är de flesta
                GDPR-rättigheter uppfyllda per konstruktion. Det finns inget
                att radera, inget att begränsa och inget att exportera.
              </p>
              <p>
                Den enda situation där uppgifter om dig tillfälligt behandlas
                är:
              </p>
              <ul>
                <li>
                  Din IP-adress (in-memory, för hastighetsbegränsning, nollställs
                  vid omstart)
                </li>
                <li>
                  Din e-postadress (om du väljer att få rapporten via e-post,
                  skickas vidare till Resend för leverans)
                </li>
              </ul>
              <p>
                Om du har frågor om hur dina uppgifter behandlas, eller vill
                utöva dina rättigheter enligt GDPR (tillgång, rättelse, radering,
                invändning), kan du kontakta oss på{" "}
                <a
                  href="mailto:hej@kollaavtalet.nu"
                  style={{ color: "var(--color-accent-text)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  hej@kollaavtalet.nu
                </a>
                .
              </p>
              <p>
                Du har även rätt att lämna klagomål till Integritetsskyddsmyndigheten
                (IMY) om du anser att vi behandlar dina uppgifter felaktigt.
                Mer information finns på{" "}
                <ExternalLink href="https://www.imy.se">imy.se</ExternalLink>.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Ansvarig för behandlingen">
              <p>
                Personuppgiftsansvarig är Jezper Lorné (enskild firma).
              </p>
              <p>
                Gamla Kilandavägen 9, 44930 Nödinge, Sweden
              </p>
              <p>
                Kontakta oss på{" "}
                <a
                  href="mailto:hej@kollaavtalet.nu"
                  style={{ color: "var(--color-accent-text)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                >
                  hej@kollaavtalet.nu
                </a>{" "}
                vid frågor om personuppgiftsbehandling.
              </p>
            </Section>

            {/* ------------------------------------------------------------------ */}
            <Section title="Ändringar av policyn">
              <p>
                Om vi ändrar den här policyn på ett sätt som påverkar hur vi
                behandlar dina uppgifter uppdaterar vi datumet överst på sidan.
                Vi rekommenderar att du kontrollerar policyn vid varje ny
                användning av tjänsten.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Interna hjälpkomponenter                                             */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-semibold)",
          color: "var(--color-text-primary)",
          letterSpacing: "var(--tracking-tight)",
          marginBottom: "0.875rem",
        }}
      >
        {title}
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          fontSize: "var(--text-base)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.65,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: "var(--color-accent-text)",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
      }}
    >
      {children}
    </a>
  );
}
