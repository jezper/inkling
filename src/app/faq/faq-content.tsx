"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

interface FaqSection {
  label: string;
  items: FaqItem[];
}

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const sections: FaqSection[] = [
  {
    label: "Hur det fungerar",
    items: [
      {
        question: "Hur fungerar granskningen?",
        answer: (
          <>
            <p>
              Ladda upp din PDF. Texten i avtalet läses direkt i din webbläsare
              och all identifierbar information tas bort innan något lämnar din
              enhet.
            </p>
            <p>
              Sedan jämförs varje klausul mot gällande lag (LAS, Semesterlagen,
              Arbetstidslagen och fler) och du får en rapport med vad som är
              standard, vad som avviker, och vad som saknas.
            </p>
          </>
        ),
      },
      {
        question: "Hur lång tid tar det?",
        answer: (
          <p>
            Vanligtvis under en minut. Enkla avtal går snabbare, komplexa avtal
            med många klausuler kan ta lite längre.
          </p>
        ),
      },
      {
        question: "Vilka typer av avtal kan ni granska?",
        answer: (
          <>
            <p>
              Svenska anställningsavtal i PDF-format. Tjänstemanna-, tekniker-
              och ledaravtal fungerar bra.
            </p>
            <p>
              Kollektivavtal, chefsavtal med avvikande individuella villkor och
              handskrivna tillägg ingår inte i den här versionen.
            </p>
          </>
        ),
      },
      {
        question: "Vad händer med mitt dokument?",
        answer: (
          <>
            <p>
              Originaldokumentet stannar hos dig. Det laddas inte upp till någon
              server.
            </p>
            <p>
              Det som skickas vidare är enbart anonymiserad avtalstext, utan
              ditt namn, personnummer, telefonnummer eller e-postadress. Den
              texten sparas inte efter att analysen är klar.
            </p>
          </>
        ),
      },
    ],
  },
  {
    label: "Privacy och säkerhet",
    items: [
      {
        question: "Sparar ni mitt avtal?",
        answer: (
          <p>
            Nej. Varken originaldokumentet eller avtalstexten sparas. Det finns
            ingen databas i tjänsten. Ingenting lagras efter att rapporten
            genererats.
          </p>
        ),
      },
      {
        question: "Vem kan se mitt avtal?",
        answer: (
          <p>
            Ingen. Originalet lämnar aldrig din enhet, och texten som faktiskt
            analyseras är redan avidentifierad när den passerar våra servrar.
          </p>
        ),
      },
      {
        question: "Är det säkert att ladda upp känsliga dokument?",
        answer: (
          <>
            <p>
              PDF:en läses i din webbläsare, samma princip som att öppna en
              fil i ett lokalt program. Filen flyttas inte.
            </p>
            <p>
              Personnummer, namn, telefonnummer och e-postadresser identifieras
              och tas bort automatiskt innan texten lämnar din enhet. Du
              godkänner den anonymiserade texten innan granskningen startar.
            </p>
          </>
        ),
      },
    ],
  },
  {
    label: "Juridiskt",
    items: [
      {
        question: "Är det här juridisk rådgivning?",
        answer: (
          <>
            <p>Nej. Det är juridisk information.</p>
            <p>
              Rapporten jämför avtalets villkor mot lag och marknadspraxis. Den
              drar inga slutsatser om vad du ska göra. Behöver du ett juridiskt
              ombud är Arbetsdomstolen och lokala fackförbund bra
              utgångspunkter.
            </p>
          </>
        ),
      },
      {
        question: "Kan jag lita på analysen?",
        answer: (
          <>
            <p>
              Rapporten baseras på gällande svensk arbetsrättslagstiftning och
              anger alltid vilket lagrum som gäller för varje punkt. Formuleringar
              som "avtalet avviker från LAS §11" har en konkret, verifierbar
              grund.
            </p>
            <p>
              Analysen är ett genomgångsverktyg, inte ett substitut för en
              jurist när det faktiskt är kris. Kontakta ett fackförbund eller en
              arbetsrättsjurist för komplexa avtal och tvister.
            </p>
          </>
        ),
      },
      {
        question: "Vilka lagar granskas avtalet mot?",
        answer: (
          <ul>
            <li>LAS (SFS 1982:80): uppsägningstid, provanställning, anställningsform</li>
            <li>Semesterlagen (SFS 1977:480): semester och semesterlön</li>
            <li>Arbetstidslagen (SFS 1982:673): arbetstid, övertid, dygnsvila</li>
            <li>Diskrimineringslagen (SFS 2008:567): otillåtna villkor</li>
            <li>Föräldraledighetslagen (SFS 1995:584): skydd vid ledighet</li>
            <li>38 § Avtalslagen + praxis: konkurrensklausuler</li>
          </ul>
        ),
      },
      {
        question: "Täcker ni kollektivavtal?",
        answer: (
          <p>
            Inte i den här versionen. Kollektivavtal varierar kraftigt mellan
            branscher och avtalsparter, vilket kräver en annan typ av analys.
            Det är planerat för en kommande version.
          </p>
        ),
      },
    ],
  },
  {
    label: "Betalning och pris",
    items: [
      {
        question: "Vad kostar det?",
        answer: (
          <p>
            Snabbkollen är gratis. Full rapport kostar 99 kr. En engångskostnad,
            ingen prenumeration.
          </p>
        ),
      },
      {
        question: "Vad ingår i gratisversionen?",
        answer: (
          <>
            <p>
              Gratis: sammanfattning och en förhandsvisning av rapporten,
              tillräckligt för att se om avtalet innehåller något som sticker ut.
            </p>
            <p>
              Full rapport (99 kr): alla flaggor med lagrum, klarspråksförklaring
              av varje klausul, marknadsjämförelse för din yrkesgrupp, saknade
              standardvillkor och förslag på frågor att ställa till
              arbetsgivaren. Plus omgranskning om avtalet revideras.
            </p>
          </>
        ),
      },
      {
        question: "Vad är omgranskning?",
        answer: (
          <p>
            Om arbetsgivaren ändrar avtalet efter din genomgång kan du ladda
            upp den reviderade versionen och få en ny fullständig rapport utan
            extra kostnad. Ingår i de 99 kronorna.
          </p>
        ),
      },
      {
        question: "Hur betalar jag?",
        answer: (
          <p>
            Kortbetalning via Stripe. Apple Pay och Google Pay fungerar om din
            enhet stödjer det. Ingen registrering krävs.
          </p>
        ),
      },
    ],
  },
  {
    label: "Övrigt",
    items: [
      {
        question: "Vem står bakom Kolla Avtalet?",
        answer: (
          <p>
            Kolla Avtalet drivs av Clause &amp; Effect. Tjänsten riktar sig till
            anställda i Sverige som vill förstå sina avtalsvillkor innan de
            skriver under.
          </p>
        ),
      },
      {
        question: "Vad gör jag om jag hittar ett problem i mitt avtal?",
        answer: (
          <>
            <p>
              Rapporten listar frågor du kan ställa till arbetsgivaren för varje
              avvikelse. Att fråga om ett villkor är helt normalt. De flesta
              arbetsgivare justerar gärna om något är oklart eller uppenbart
              utanför standard.
            </p>
            <p>
              Är avvikelsen allvarlig och arbetsgivaren inte vill diskutera kan
              ditt fackförbund ge råd. Arbetsdomstolens vägledning finns på{" "}
              <a
                href="https://www.ad.se"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--color-accent-text)",
                  textDecorationLine: "underline",
                  textUnderlineOffset: "3px",
                }}
              >
                ad.se
              </a>
              .
            </p>
          </>
        ),
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Accordion item
// ---------------------------------------------------------------------------

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: "flex",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "1.25rem 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "var(--font-display)",
          fontSize: "var(--text-base)",
          fontWeight: 600,
          color: "var(--color-text-primary)",
          letterSpacing: "var(--tracking-tight)",
        }}
      >
        <span>{item.question}</span>
        <span
          aria-hidden="true"
          style={{
            flexShrink: 0,
            marginTop: "2px",
            color: "var(--color-accent-500)",
            transition: "transform 180ms var(--ease-in-out)",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ChevronDown size={18} strokeWidth={2} />
        </span>
      </button>

      {isOpen && (
        <div className="faq-answer" style={{ paddingBottom: "1.25rem" }}>
          {item.answer}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

function FaqSectionBlock({ section }: { section: FaqSection }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id={section.label.toLowerCase().replace(/[^a-zåäö0-9]+/g, "-").replace(/-+$/, "")}
      style={{ marginBottom: "3rem" }}
    >
      <h2
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "var(--text-xs)",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.10em",
          color: "var(--color-text-muted)",
          marginBottom: "0.5rem",
        }}
      >
        {section.label}
      </h2>
      <div style={{ borderTop: "1px solid var(--border)" }}>
        {section.items.map((item, i) => (
          <AccordionItem
            key={i}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Root export
// ---------------------------------------------------------------------------

export function FaqContent() {
  return (
    <>
      {sections.map((section, i) => (
        <FaqSectionBlock key={i} section={section} />
      ))}

      {/* Scoped styles for answer body text */}
      <style>{`
        .faq-answer {
          font-size: var(--text-base);
          color: var(--color-text-secondary);
          line-height: 1.65;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .faq-answer p {
          margin: 0;
        }
        .faq-answer ul {
          margin: 0;
          padding-left: 1.25rem;
          list-style: disc;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .faq-answer li {
          padding-left: 0.25rem;
        }
      `}</style>
    </>
  );
}
