import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OpenPanelComponent } from "@openpanel/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_TITLE = "Omar Bortolato — Chief AI Officer & AI Practitioner";
const SITE_DESCRIPTION =
  "AI pratica per chi vuole fare, non solo sapere. Progetti reali, guide scaricabili e sistemi costruiti in prima persona, spiegati senza hype.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.omarbortolato.it"),
  title: {
    default: SITE_TITLE,
    template: "%s | Omar Bortolato",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI applicata",
    "agenti AI",
    "automazione",
    "Chief AI Officer",
    "Omar Bortolato",
  ],
  authors: [{ name: "Omar Bortolato" }],
  creator: "Omar Bortolato",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://www.omarbortolato.it",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "Omar Bortolato",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <OpenPanelComponent
          clientId="dfb0a23a-d099-4ddd-8b74-f5ec540dde6d"
          trackScreenViews={true}
          trackOutgoingLinks={true}
          trackAttributes={true}
        />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
