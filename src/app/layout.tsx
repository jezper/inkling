import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kolla Avtalet — Granska ditt anställningsavtal",
  description:
    "Ladda upp ditt anställningsavtal och se hur det stämmer mot svensk arbetsrätt. Ingen registrering, dokumentet lämnar inte din enhet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  );
}
