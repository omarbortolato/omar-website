import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Omar Bortolato — Developer & Designer",
    template: "%s | Omar Bortolato",
  },
  description:
    "Personal website of Omar Bortolato — developer, designer, and creator.",
  keywords: ["developer", "designer", "portfolio", "next.js", "react"],
  authors: [{ name: "Omar Bortolato" }],
  creator: "Omar Bortolato",
  openGraph: {
    type: "website",
    locale: "it_IT",
    url: "https://omarbortolato.dev",
    title: "Omar Bortolato — Developer & Designer",
    description:
      "Personal website of Omar Bortolato — developer, designer, and creator.",
    siteName: "Omar Bortolato",
  },
  twitter: {
    card: "summary_large_image",
    title: "Omar Bortolato — Developer & Designer",
    description:
      "Personal website of Omar Bortolato — developer, designer, and creator.",
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
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
