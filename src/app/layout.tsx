import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = "https://kollaavtalet.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Kolla Avtalet - Granska ditt anställningsavtal",
    template: "%s | Kolla Avtalet",
  },
  description:
    "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Ingen registrering, dokumentet lämnar inte din enhet.",
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
    title: "Kolla Avtalet - Granska ditt anställningsavtal",
    description:
      "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Ingen registrering, dokumentet lämnar inte din enhet.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kolla Avtalet - Granska ditt anställningsavtal",
    description:
      "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Ingen registrering.",
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
      "Granska ditt anställningsavtal mot svensk arbetsrätt. Snabbkoll gratis, full rapport 99 kr.",
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
      </body>
    </html>
  );
}
