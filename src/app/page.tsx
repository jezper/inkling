import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { AnalysisFlow } from "@/components/analysis-flow";
import { Footer } from "@/components/footer";
import { ReferralCapture } from "@/components/referral-capture";

export const metadata: Metadata = {
  title: "Kolla Avtalet | Förstå ditt anställningsavtal innan du skriver under",
  description:
    "Grattis till jobbet. Vet du vad du tackar ja till? Vi jämför varje klausul mot lag, marknadspraxis och lönedata. Snabbkoll gratis.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Förstå ditt avtal innan du skriver under",
    description:
      "Grattis till jobbet. Vet du vad du tackar ja till? Varje klausul jämförs mot lag, marknadspraxis och lönedata.",
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
