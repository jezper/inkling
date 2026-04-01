import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Användarvillkor",
  description:
    "Villkor för användning av Kolla Avtalet. Vad tjänsten är, vad du får, och vad som gäller vid köp.",
  alternates: {
    canonical: "/villkor",
  },
  robots: {
    index: true,
    follow: false,
  },
};

export default function Villkor() {
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
              Senast uppdaterad 2026-04-01
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
              Användarvillkor
            </h1>
            <p
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Det här är villkoren för att använda Kolla Avtalet. Vi har skrivit
              dem kort och rakt — inga dolda klausuler.
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
            <Section title="Vad tjänsten är">
              <p>
                Kolla Avtalet är ett informationsverktyg som analyserar svenska
                anställningsavtal mot gällande arbetsrättslagstiftning och
                marknadspraxis. Analysen bygger på AI och jämför avtalets
                innehåll mot LAS, Semesterlagen, Arbetstidslagen,
                Diskrimineringslagen och Föräldraledighetslagen.
              </p>
              <p>
                Tjänsten ger <strong>information</strong>, inte juridisk
                rådgivning. Resultatet ersätter inte kontakt med fackförbund
                eller jurist.
              </p>
            </Section>

            <Section title="Vad du får">
              <p>
                En snabbkoll är gratis och visar en övergripande bedömning
                av ditt avtal.
              </p>
              <p>
                Den fullständiga rapporten kostar 49 kr inklusive moms och
                innehåller: detaljerad genomgång av alla klausuler, jämförelse
                mot lag och marknadspraxis, lönestatistik, saknade villkor och
                konkreta frågor att ställa till arbetsgivaren.
              </p>
              <p>
                Rapporten levereras direkt i webbläsaren, som PDF via e-post
                och via en delbar länk. Vi strävar efter att länken ska vara
                giltig i 30 dagar, men tekniska förändringar kan göra att den
                upphör att fungera tidigare. Ladda alltid ner PDF-rapporten
                för permanent sparande.
              </p>
            </Section>

            <Section title="Betalning och pris">
              <p>
                Betalning sker via Stripe. Priset är 49 kr inklusive 25 % moms
                (39,20 kr exklusive moms). Betalningen är en engångskostnad per
                analys.
              </p>
              <p>
                Vid köp skickas ett kvitto till den e-postadress du angav vid
                betalningen.
              </p>
            </Section>

            <Section title="Återbetalning och ångerrätt">
              <p>
                Eftersom resultatet är digitalt innehåll som levereras
                omedelbart efter betalning gäller inte ångerrätten, förutsatt
                att du uttryckligen samtyckt till omedelbar leverans och
                bekräftat att du är medveten om att ångerrätten upphör
                (16 § konsumentavtalslagen, SFS 2005:59).
              </p>
              <p>
                Om tjänsten inte fungerar som utlovat — till exempel om
                analysen inte kan slutföras — kan du begära återbetalning via
                länken i rapporten. Vi gör en individuell bedömning inom
                rimlig tid.
              </p>
            </Section>

            <Section title="Vad tjänsten inte är">
              <p>
                Kolla Avtalet är inte en advokatbyrå, ett fackförbund eller en
                myndighet. Analysen är automatiserad och inte granskad av
                människa. Den kan innehålla fel. Kollektivavtal ingår inte i
                analysen.
              </p>
              <p>
                Tjänsten kan inte garantera att analysresultatet inte påverkas
                av avtalstextens utformning. Ovanliga eller manipulerade
                dokumentformat kan ge opålitliga resultat.
              </p>
              <p>
                Vi ansvarar inte för beslut du fattar baserat på analysen. Vid
                osäkerhet, kontakta alltid en arbetsrättsjurist eller ditt
                fackförbund.
              </p>
            </Section>

            <Section title="Ansvarsbegränsning">
              <p>
                Kolla Avtalets ansvar är under alla omständigheter begränsat
                till det belopp du betalat för den aktuella analysen (49 kr).
                Vi ansvarar inte för indirekta förluster, utebliven inkomst
                eller förluster till följd av beslut fattade med analysen som
                underlag.
              </p>
            </Section>

            <Section title="Dina uppgifter">
              <p>
                Vi lagrar inga avtal, inga analyser och ingen information om
                dig. Personuppgifter rensas automatiskt innan avtalstexten
                lämnar din enhet. Läs mer i vår{" "}
                <a
                  href="/integritetspolicy"
                  style={{
                    color: "var(--color-accent-text)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  integritetspolicy
                </a>
                .
              </p>
            </Section>

            <Section title="Tillgänglighet och drift">
              <p>
                Vi strävar efter att tjänsten ska vara tillgänglig dygnet runt,
                men kan inte garantera det. Underhåll, uppdateringar eller
                tekniska problem kan göra tjänsten tillfälligt otillgänglig.
              </p>
            </Section>

            <Section title="Ändringar av villkoren">
              <p>
                Vi kan uppdatera dessa villkor. Vid väsentliga ändringar
                uppdateras datumet överst på sidan. Fortsatt användning efter
                en ändring innebär att du godkänner de nya villkoren.
              </p>
            </Section>

            <Section title="Kontakt">
              <p>
                Kolla Avtalet drivs av Jezper Lorné (enskild firma).
              </p>
              <p>
                Frågor om tjänsten:{" "}
                <a
                  href="mailto:hej@kollaavtalet.nu"
                  style={{
                    color: "var(--color-accent-text)",
                    textDecoration: "underline",
                    textUnderlineOffset: "3px",
                  }}
                >
                  hej@kollaavtalet.nu
                </a>
              </p>
            </Section>

            <Section title="Tillämplig lag">
              <p>
                Svensk lag gäller för dessa villkor. Tvister avgörs av svensk
                allmän domstol.
              </p>
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

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
