import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description: "Chi sono, cosa faccio e cosa mi appassiona.",
};

export default function AboutPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-20">
      <Badge variant="accent" className="mb-4">About me</Badge>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        Chi sono
      </h1>
      <div className="prose prose-gray max-w-none space-y-4 text-gray-600 leading-relaxed">
        <p>
          Sono Omar Bortolato, developer e designer con una passione per le interfacce
          curate e i prodotti digitali ben costruiti. Lavoro principalmente con React,
          Next.js e TypeScript, con un occhio sempre attento alla UX.
        </p>
        <p>
          Mi piace costruire cose che funzionano, sono belle da usare e risolvono
          problemi reali. Che si tratti di un'app web, un sito di portfolio o un SaaS,
          mi appassiona ogni fase: dalla strategia al deploy.
        </p>
        <p>
          Quando non sono davanti al computer, mi trovi a esplorare nuove tecnologie,
          leggere di design system o contribuire a progetti open source.
        </p>
      </div>
    </section>
  );
}
