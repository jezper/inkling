export const page = {
  slug: "guide/granska-anstallningsavtal",
  title: "Så granskar du ditt anställningsavtal",
  description:
    "Checklista med 10 punkter att kontrollera i ditt anställningsavtal. Vanliga misstag, röda flaggor och vad lagen kräver.",
  h1: "Så granskar du ditt anställningsavtal",

  intro:
    "De flesta skriver under sitt anställningsavtal utan att gå igenom det punkt för punkt. Det är förståeligt — avtalen är långa och juridiska. Den här guiden bryter ner vad du faktiskt bör titta på, och vilka formuleringar som kräver extra uppmärksamhet.",

  sections: [
    {
      heading: "Checklista — 10 punkter att gå igenom",
      content: `Gå igenom dessa punkter innan du skriver under:

1. Anställningsform. Är det tillsvidare, provanställning eller visstid? Stämmer det med vad du kommit överens om muntligt?

2. Anställningens startdatum. Exakt datum ska framgå. Det påverkar intjänande av semesterdagar och din anställningstid enligt LAS.

3. Arbetstid. Är det heltid eller deltid? Hur många timmar? Övertid — finns det ersättning eller är den inbakad?

4. Lön. Belopp, utbetalningsdatum och vad lönen inkluderar. Om bonus finns: hur beräknas den och är den garanterad?

5. Uppsägningstid. Kontrollera mot LAS §11-tabellen. Är din tid kortare än LAS-minimum är den ogiltigt avtalad.

6. Konkurrensklausul. Finns det ett förbud att arbeta hos konkurrenter efter avslutad anställning? Hur länge och mot vilken kompensation?

7. Sekretessklausul. Vad definieras som konfidentiellt? Gäller det efter anställningen? Hur lång tid?

8. Semestervillkor. Lagen (1977:480) ger rätt till 25 dagars semester per år. Kontrollera om avtalet avviker.

9. Tjänstepension. Ingår tjänstepension? Vilket belopp eller vilken procentsats? Kollektivavtal reglerar ofta detta.

10. Prövotid. Om det är en provanställning — hur lång är den? Max 6 månader tillåtet (LAS §6). Vad händer efter provtiden?`,
    },
    {
      heading: "Röda flaggor att stanna upp vid",
      content: `Dessa formuleringar dyker upp i anställningsavtal och förtjänar mer uppmärksamhet än resten:

— Konkurrensklausul utan kompensation. Om du binds under 9–12+ månader utan ersättning är det sannolikt oskäligt (38 § AvtL).

— Ensidig ändringsrätt. "Arbetsgivaren förbehåller sig rätten att ändra arbetsuppgifter, arbetstider och arbetsplats." Hur bred är denna rätt egentligen?

— Övertid inkluderas i lönen. Innebär att du förväntas arbeta övertid utan extra ersättning. Kontrollera om det är rimligt för din roll och om det är branchpraxis.

— Lön "enligt muntlig överenskommelse". Inget belopp i avtalet gör det svårare att hävda rätt till avtalad lön.

— Sekretess utan tidsgräns. Sekretessklausuler som gäller för evigt är ovanliga men förekommer. Skäliga avtal anger en konkret tid.`,
    },
    {
      heading: "Vad lagen kräver att avtalet innehåller",
      content: `Arbetsgivaren är skyldig att skriftligen informera om anställningsvillkoren (LAS §6c). Informationen ska lämnas senast sju dagar från att arbetet påbörjas, för de viktigaste villkoren.

Minsta innehåll enligt lag:

— Parterna (arbetsgivare och arbetstagare med namn och adress)
— Arbetsplats
— Befattning eller arbetsuppgifter
— Anställningens startdatum
— Anställningsform och, vid tidsbegränsad anställning, slutdatum
— Provanställningsperiod om tillämplig
— Lön och hur den betalas ut
— Ordinarie arbetstid
— Semester och semesterlön
— Uppsägningstid
— Tillämpligt kollektivavtal, om det finns`,
    },
    {
      heading: "Vanliga misstag",
      content: `De vanligaste misstagen handlar inte om vad som står utan om vad som saknas.

Inget är lika illa som ett avtal som bara reglerar lön och startdatum. Allt som inte är reglerat faller tillbaka på lagen — det kan vara bra eller dåligt beroende på vad saken gäller.

Annat som ofta missas: Avtalet innehåller en konkurrensklausul men ingen tydlig definition av vad som räknas som konkurrent. Eller en sekretessklausul som inte särskiljer allmänt tillgänglig information från faktiska affärshemligheter.

Lika vanligt: Arbetstagaren och arbetsgivaren har haft en muntlig diskussion om villkoren, men avtalet speglar inte det som faktiskt sades. Muntliga avtal är bindande, men svåra att bevisa.`,
    },
    {
      heading: "Vad händer om avtalet bryter mot lagen?",
      content: `Om ett avtalsvillkor strider mot LAS eller annan lag är det ogiltiga villkoret utan verkan. Lagen gäller i stället. Det innebär att du inte förlorar dina lagstadgade rättigheter även om du skrivit under ett avtal som försöker begränsa dem.

Exempel: Avtalet anger en månads uppsägningstid trots att du har arbetat i sex år. Trots underskriften gäller LAS §11 — fyra månaders uppsägningstid.

Att ett villkor är ogiltigt innebär inte att hela avtalet är ogiltigt. Övriga delar gäller.`,
    },
  ],

  factbox: {
    heading: "Vad ska alltid finnas i ett skriftligt avtal",
    rows: [
      ["Parterna", "Namn och adresser"],
      ["Startdatum", "Exakt datum"],
      ["Anställningsform", "Tillsvidare, prova, visstid"],
      ["Lön", "Belopp och utbetalningsdag"],
      ["Arbetstid", "Timmar per vecka"],
      ["Uppsägningstid", "Antal månader"],
      ["Semester", "Dagar per år"],
      ["Arbetsplats", "Ort eller distans"],
    ],
  },

  disclaimer:
    "Informationen på denna sida är en sammanfattning av lagtext och vanlig praxis. Den ersätter inte juridisk rådgivning. Bedömningen av ett enskilt avtal kräver en genomgång av de faktiska omständigheterna. Kontakta ditt fackförbund eller en jurist om du är osäker.",

  cta_text:
    "Ladda upp ditt avtal så får du en genomgång av de tio punkterna — och ser om något avviker från vad lagen kräver.",

  related: [
    "regler/las",
    "regler/provanstallning",
    "guide/konkurrensklausul",
    "guide/uppsagningstid",
  ],
};
