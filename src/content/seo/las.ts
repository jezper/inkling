export const page = {
  slug: "regler/las",
  title: "LAS — Lagen om anställningsskydd",
  description:
    "Vad säger LAS? Anställningsformer, uppsägningstider, turordning och saklig grund förklarade i klartext. Med lagparagrafer.",
  h1: "LAS — Lagen om anställningsskydd",

  intro:
    "Lagen om anställningsskydd (1982:80) reglerar förhållandet mellan arbetsgivare och arbetstagare i Sverige. Den ger arbetstagare ett grundläggande skydd som inte kan avtalas bort till nackdel för den anställde.",

  sections: [
    {
      heading: "Vad LAS reglerar",
      content: `LAS gäller för alla arbetstagare i privat och offentlig sektor. Undantagen är få: arbetstagare i företagsledande ställning och arbetsgivarens familjemedlemmar i vissa fall (LAS §1).

Lagen är semidispositiv. Det betyder att kollektivavtal kan ersätta eller komplettera lagens regler. Om inget kollektivavtal gäller på din arbetsplats gäller lagens grundregler direkt.

LAS reglerar framför allt fyra saker: vilka anställningsformer som är tillåtna, hur lång uppsägningstid som gäller, i vilken ordning anställda ska sägas upp, och vad som krävs för att en uppsägning ska vara giltig.`,
    },
    {
      heading: "Anställningsformer",
      content: `Huvudregeln i LAS §4 är att en anställning gäller tillsvidare. Tidsbegränsad anställning kräver stöd i lag eller kollektivavtal.

LAS §5 tillåter dessa tidsbegränsade former:

— Allmän visstidsanställning (ALVA): Totalt max 24 månader under en femårsperiod hos samma arbetsgivare. Har du passerat gränsen omvandlas anställningen automatiskt till tillsvidareanställning.

— Provanställning: Max 6 månader (LAS §6). Kan avbrytas utan saklig grund.

— Vikariat och säsongsarbete: Tillåtet under förutsättningar i LAS §5.

Om arbetsgivaren anger en annan anställningsform i avtalet bör du kontrollera att den har stöd i lag eller gällande kollektivavtal.`,
    },
    {
      heading: "Saklig grund för uppsägning",
      content: `En tillsvidareanställd kan bara sägas upp om det finns saklig grund (LAS §7). Det finns två typer: personliga skäl och arbetsbrist.

Personliga skäl handlar om den enskilda arbetstagaren — till exempel allvarliga samarbetsproblem, upprepade varningar eller misskötsel. Arbetsgivaren måste i regel ha varnat och gett möjlighet till förbättring.

Arbetsbrist är ett paraplybegrepp för alla situationer där uppsägningen beror på verksamheten snarare än arbetstagaren — omorganisation, lönsamhetsproblem, nedläggning.

Arbetsgivaren har bevisbördan. Om en uppsägning bestrids prövar Arbetsdomstolen om saklig grund faktiskt förelegat.`,
    },
    {
      heading: "Turordning vid uppsägning",
      content: `Vid uppsägning på grund av arbetsbrist gäller turordningsreglerna i LAS §22. Grundprincipen är "sist in, först ut": den med kortast anställningstid i driftenheten sägs upp först.

Arbetsgivare med högst tio anställda får undanta två arbetstagare från turordningen. De undantagna måste vara av särskild betydelse för den fortsatta verksamheten.

Turordningen kan förhandlas om och ersättas via kollektivavtal. I verksamheter med kollektivavtal är det vanligt att turordningsreglerna ser annorlunda ut.`,
    },
    {
      heading: "Uppsägningstider enligt LAS",
      content: `LAS §11 anger minsta uppsägningstid beroende på anställningstid:`,
      table: {
        caption: "Minsta uppsägningstid enligt LAS §11",
        headers: ["Anställningstid", "Uppsägningstid"],
        rows: [
          ["Kortare än 2 år", "1 månad"],
          ["2–4 år", "2 månader"],
          ["4–6 år", "3 månader"],
          ["6–8 år", "4 månader"],
          ["8–10 år", "5 månader"],
          ["10 år eller längre", "6 månader"],
        ],
        note: "Kollektivavtal eller individuellt avtal kan ge längre uppsägningstid. Kortare än LAS-minimum är ogiltigt.",
      },
    },
    {
      heading: "Provanställning",
      content: `Provanställning regleras i LAS §6. Den får pågå i högst sex månader. Varken arbetsgivaren eller arbetstagaren behöver ange skäl för att avbryta den i förtid.

Om arbetsgivaren vill att provanställningen ska upphöra vid periodens slut måste denne meddela det senast två veckor i förväg. Annars övergår anställningen automatiskt till tillsvidare.

Se separat guide om provanställning för fullständiga regler.`,
    },
  ],

  factbox: {
    heading: "Minsta uppsägningstid — snabbkoll",
    content:
      "Under 2 år: 1 mån. 2–4 år: 2 mån. 4–6 år: 3 mån. 6–8 år: 4 mån. 8–10 år: 5 mån. 10+ år: 6 mån. (LAS §11)",
  },

  disclaimer:
    "Informationen på denna sida är en sammanfattning av lagtext. Den ersätter inte juridisk rådgivning. Kollektivavtal kan ge andra villkor. Kontakta Arbetsförmedlingen, ditt fackförbund eller Arbetsdomstolen vid en tvist.",

  cta_text:
    "Ladda upp ditt avtal så ser du om dina uppsägningstider och anställningsform stämmer med LAS.",

  related: [
    "regler/provanstallning",
    "guide/uppsagningstid",
    "guide/granska-anstallningsavtal",
  ],
};
