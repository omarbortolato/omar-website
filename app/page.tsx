import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Layers, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Omar Bortolato — Developer & Designer",
  description: "Sviluppo esperienze digitali moderne. Developer, designer, creator.",
};

const skills = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind CSS", "Figma"];

const highlights = [
  {
    icon: Code2,
    title: "Sviluppo Web",
    description: "Applicazioni moderne con React, Next.js e TypeScript. Codice pulito, performante e scalabile.",
  },
  {
    icon: Layers,
    title: "UI/UX Design",
    description: "Interfacce intuitive e visivamente curate, con attenzione ai dettagli e all'esperienza utente.",
  },
  {
    icon: Sparkles,
    title: "Prodotti Digitali",
    description: "Dalla strategia al deploy: trasformo idee in prodotti concreti e funzionanti.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="container mx-auto max-w-5xl px-4 py-24 md:py-32">
        <div className="max-w-3xl">
          <Badge variant="accent" className="mb-4">
            Disponibile per nuovi progetti
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Ciao, sono <span className="text-primary-800">Omar</span>.
            <br />
            <span className="text-accent-500">Costruisco</span> per il web.
          </h1>
          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl">
            Developer e designer con la passione per le interfacce curate e il codice
            che funziona davvero. Aiuto team e founder a trasformare idee in prodotti digitali.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {skills.map((skill) => (
              <Badge key={skill} variant="outline" className="border-primary-800/20 text-primary-800">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild size="lg">
              <Link href="/progetti">
                Vedi i miei progetti
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/collabora">Collaboriamo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What I do */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cosa faccio</h2>
          <p className="text-gray-500 mb-10">
            Un mix di tecnica e creatività al servizio del prodotto.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-800/10 flex items-center justify-center mb-3">
                    <Icon size={20} className="text-primary-800" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto max-w-5xl px-4 py-20">
        <div className="rounded-2xl bg-primary-800 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-bold mb-3">Hai un progetto in mente?</h2>
          <p className="text-primary-200 mb-8 max-w-lg mx-auto">
            Sono sempre aperto a collaborazioni interessanti. Parliamo del tuo progetto.
          </p>
          <Button asChild variant="accent" size="lg">
            <Link href="/collabora">
              Iniziamo a parlare
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
