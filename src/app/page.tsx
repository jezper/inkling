import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { AnalysisFlow } from "@/components/analysis-flow";
import { Footer } from "@/components/footer";
import { ReferralCapture } from "@/components/referral-capture";

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
