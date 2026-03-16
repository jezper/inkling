import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { AnalysisFlow } from "@/components/analysis-flow";
import { Footer } from "@/components/footer";
import { ReferralCapture } from "@/components/referral-capture";

export const metadata: Metadata = {
  title: "Kolla Avtalet - Granska ditt anställningsavtal",
  description:
    "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Snabbkoll gratis, full rapport 99 kr. Dokumentet lämnar aldrig din enhet.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kolla Avtalet - Granska ditt anställningsavtal",
    description:
      "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Snabbkoll gratis, full rapport 99 kr.",
    url: "/",
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <ReferralCapture />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <AnalysisFlow />
      </main>
      <Footer />
    </>
  );
}
