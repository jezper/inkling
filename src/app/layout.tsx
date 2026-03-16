import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kollaavtalet.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kolla Avtalet | Förstå ditt anställningsavtal innan du skriver under",
    template: "%s | Kolla Avtalet",
  },
  description:
    "Grattis till jobbet. Vet du vad du tackar ja till? Vi jämför varje klausul mot lag, marknadspraxis och lönedata. Snabbkoll gratis.",
  applicationName: "Kolla Avtalet",
  authors: [{ name: "Kolla Avtalet", url: BASE_URL }],
  generator: "Next.js",
  keywords: [
    "anställningsavtal",
    "granska avtal",
    "arbetsrätt",
    "LAS",
    "uppsägningstid",
    "konkurrensklausul",
    "provanställning",
    "anställningsskydd",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Kolla Avtalet",
  publisher: "Kolla Avtalet",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: BASE_URL,
    siteName: "Kolla Avtalet",
    title: "Kolla Avtalet | Förstå ditt avtal innan du skriver under",
    description:
      "Grattis till jobbet. Vet du vad du tackar ja till? Varje klausul jämförs mot lag, marknadspraxis och lönedata.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolla Avtalet | Förstå ditt avtal innan du skriver under",
    description:
      "Grattis till jobbet. Vet du vad du tackar ja till? Varje klausul jämförs mot lag och lönedata.",
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "sv-SE": BASE_URL,
    },
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Kolla Avtalet",
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    description:
      "Tjänst för granskning av anställningsavtal mot svensk arbetsrätt.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "privacy@kollaavtalet.com",
      contactType: "customer service",
      availableLanguage: "Swedish",
    },
  };

  const webApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kolla Avtalet",
    url: BASE_URL,
    description:
      "Granska ditt anställningsavtal mot svensk arbetsrätt. Snabbkoll gratis, full rapport 49 kr.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web browser",
    offers: {
      "@type": "Offer",
      price: "99",
      priceCurrency: "SEK",
      description: "Full avtalsanalys mot svensk arbetsrätt",
    },
    inLanguage: "sv-SE",
    accessibilityFeature: ["highContrast", "largePrint", "structuredNavigation"],
    availableLanguage: {
      "@type": "Language",
      name: "Swedish",
      alternateName: "sv",
    },
  };

  return (
    <html lang="sv">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
