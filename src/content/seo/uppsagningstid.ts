export const page = {
  slug: "guide/uppsagningstid",
  title: "Uppsägningstid — vad gäller?",
  description:
    "Hur lång uppsägningstid har du? LAS §11-tabellen, skillnaden mellan arbetsgivare och arbetstagare, kollektivavtal och beräkning.",
  h1: "Uppsägningstid — vad gäller?",

  intro:
    "Uppsägningstiden avgör hur länge anställningen fortsätter efter det att en av parterna har sagt upp den. LAS §11 anger miniminivåer. Ditt avtal eller ditt kollektivavtal kan ge längre tid, men aldrig kortare.",

  sections: [
    {
      heading: "LAS §11 — miniminivåer",
      content: `Lagen om anställningsskydd §11 anger den kortaste tillåtna uppsägningstiden för en tillsvidareanställning. Miniminivån beräknas utifrån hur länge du har arbetat hos arbetsgivaren.

Arbetsgivaren kan aldrig ge dig kortare uppsägningstid än vad LAS anger. Om avtalet innehåller kortare tid är den delen ogiltig och LAS-minimum gäller i stället.

Beräkningen sker från den dag du börjar hos arbetsgivaren. Det spelar ingen roll om anställningsformen har varierat — provanställning, visstid och tillsvidare räknas samman om det rör sig om en sammanhängande anställning.`,
      table: {
        caption: "Minsta uppsägningstid för arbetstagare (LAS §11)",
        headers: ["Anställningstid vid uppsägning", "Uppsägningstid"],
        rows: [
          ["Kortare än 2 år", "1 månad"],
          ["2 år men kortare än 4 år", "2 månader"],
          ["4 år men kortare än 6 år", "3 månader"],
          ["6 år men kortare än 8 år", "4 månader"],
          ["8 år men kortare än 10 år", "5 månader"],
          ["10 år eller längre", "6 månader"],
        ],
      },
    },
    {
      heading: "Skillnad mellan arbetstagare och arbetsgivare",
      content: `Tabellen i LAS §11 gäller när arbetsgivaren säger upp dig. Om du själv säger upp dig har du rätt att tillämpa samma tabell, men du är inte skyldig att ge mer än en månads uppsägningstid.

Kortfattat: arbetstagaren har alltid rätt till den tid tabellen anger, oavsett vem som säger upp. Men du som arbetstagare kan välja att säga upp dig med kortare varsel om ni avtalat om det — dock minst en månad.

Under uppsägningstiden har du rätt att behålla din lön och dina förmåner. Arbetsgivaren kan inte ensidigt ändra villkoren under löpande uppsägningstid.`,
    },
    {
      heading: "Kollektivavtal och individuellt avtal",
      content: `Om din arbetsplats har kollektivavtal kan uppsägningstiderna vara längre än LAS-minimum. Kollektivavtal kan också reglera andra detaljer — till exempel om uppsägningstiden är ömsesidig eller asymmetrisk.

Ditt individuella anställningsavtal kan innehålla längre uppsägningstid än både LAS och kollektivavtalet. Det är tillåtet. Kortare än LAS är det inte.

Vanliga formuleringar att titta efter: "Ömsesidig uppsägningstid om tre månader" eller "Arbetstagaren säger upp sig med en månads varsel, arbetsgivaren med tre månader." Den sistnämnda typen är asymmetrisk och ger dig kortare bindning — men kontrollera om kollektivavtalet tillåter asymmetri.`,
    },
    {
      heading: "Beräkning i praktiken",
      content: `Uppsägningstiden börjar löpa den dag uppsägningen lämnades, inte nästa månadsskifte. Det är en vanlig missuppfattning.

Exempel: Du har arbetat i 3 år och 2 månader. Vid uppsägning från arbetsgivaren gäller 2 månaders uppsägningstid. Säger arbetsgivaren upp dig den 10 mars slutar anställningen den 10 maj.

Har du fler anställningar hos samma arbetsgivare bakåt i tiden, och de är sammanhängande med korta uppehåll, räknas de in i den totala anställningstiden. Vad som räknas som sammanhängande bedöms från fall till fall.`,
    },
    {
      heading: "Turordning och uppsägning vid arbetsbrist",
      content: `Vid uppsägning på grund av arbetsbrist avgör turordningsreglerna i LAS §22 vem som sägs upp. Den med kortast anställningstid i driftenheten berörs först.

Arbetsgivare med upp till tio anställda får undanta två personer från turordningen. Undantagna arbetstagare måste vara av särskild betydelse för den fortsatta verksamheten.

Omplaceringsskyldigheten i LAS §7 innebär att arbetsgivaren måste undersöka om det finns lediga tjänster du kan omplaceras till, innan en uppsägning på grund av arbetsbrist är giltig.`,
    },
  ],

  factbox: {
    heading: "Snabbkoll — LAS §11",
    rows: [
      ["Under 2 år", "1 månads uppsägningstid"],
      ["2–4 år", "2 månader"],
      ["4–6 år", "3 månader"],
      ["6–8 år", "4 månader"],
      ["8–10 år", "5 månader"],
      ["10+ år", "6 månader"],
      ["Avtal kortare än LAS?", "Ogiltigt — LAS gäller"],
    ],
  },

  disclaimer:
    "Informationen på denna sida är en sammanfattning av lagtext. Den ersätter inte juridisk rådgivning. Kollektivavtal kan innebära andra regler. Kontakta ditt fackförbund eller Arbetsdomstolen om du är i en tvist.",

  cta_text:
    "Ladda upp ditt avtal så ser du om din uppsägningstid stämmer med LAS §11 och vad som gäller för din anställningstid.",

  related: [
    "regler/las",
    "regler/provanstallning",
    "guide/granska-anstallningsavtal",
  ],
};
