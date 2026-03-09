import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Mic,
  Cpu,
  Bot,
  MessageSquareText,
  GitBranch,
  BookOpen,
  Sparkles,
  FileText,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Omar Bortolato — AI Practitioner & Manager",
  description:
    "Manager, imprenditore, practitioner. Trasformo l'AI da teoria a risultati concreti — senza paroloni, solo applicazioni reali.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const credibilityItems = [
  { icon: Briefcase, label: "AI Manager @ Aspiag ICS" },
  { icon: Building2, label: "Co-founder @ Azoa Seed" },
  { icon: Mic,       label: "Speaker AI Week Milano 2026" },
  { icon: Cpu,       label: "6+ progetti AI operativi" },
];

interface Project {
  id:          string;
  badge:       { label: string; classes: string };
  title:       string;
  description: string;
  tags:        string[];
  href:        string;
  external:    boolean;
}

const projects: Project[] = [
  {
    id: "phoenix",
    badge: {
      label:   "Active",
      classes: "bg-green-100 text-green-700 border border-green-200",
    },
    title:       "Phoenix RE Capital",
    description:
      "Fund immobiliare USA per investitori italiani. AI per market research, property analysis, investor reporting.",
    tags:     ["ChatGPT", "n8n", "Census API"],
    href:     "https://phoenixrecapital.com",
    external: true,
  },
  {
    id: "fastlien",
    badge: {
      label:   "In Development",
      classes: "bg-blue-100 text-blue-700 border border-blue-200",
    },
    title:       "Fastlien",
    description:
      "Software per investimenti tax lien/deed. AI per analisi aste e scoring opportunità.",
    tags:     ["Claude", "Python", "Data Analysis"],
    href:     "https://fastlien.co",
    external: true,
  },
  {
    id: "herbalife",
    badge: {
      label:   "Active",
      classes: "bg-green-100 text-green-700 border border-green-200",
    },
    title:       "E-commerce Multi-Paese",
    description:
      "6 siti automatizzati (IT, FR, DE, UK, US, ES). SEO automation, contenuti multilingua, Google Ads optimization.",
    tags:     ["ChatGPT", "n8n", "WordPress"],
    href:     "/progetti#herbalife",
    external: false,
  },
  {
    id: "azoa",
    badge: {
      label:   "Founding",
      classes: "bg-purple-100 text-purple-700 border border-purple-200",
    },
    title:       "Azoa Seed",
    description:
      "AI-native startup factory. Fast prototyping, DAO governance, proprietary infrastructure.",
    tags:     ["Claude Code", "Cowork", "Full Stack AI"],
    href:     "/progetti#azoa",
    external: false,
  },
];

const tools = [
  { icon: Bot,                name: "Claude.ai + Claude Code" },
  { icon: MessageSquareText,  name: "ChatGPT" },
  { icon: GitBranch,          name: "n8n" },
  { icon: BookOpen,           name: "NotebookLM" },
  { icon: Sparkles,           name: "Gemini" },
  { icon: FileText,           name: "Notion" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">

          {/* flex-col-reverse → image on top on mobile, text left + image right on desktop */}
          <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">

            {/* ── Text ── */}
            <div className="flex-1 text-center md:text-left">

              {/* Availability pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-600 mb-6">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Disponibile per consulenze AI
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl lg:text-6xl">
                AI Pratica per chi vuole{" "}
                <span className="text-primary-800">fare</span>,
                <br className="hidden sm:block" />
                {" "}non solo{" "}
                <span className="text-accent-500">sapere</span>.
              </h1>

              <p className="mt-5 max-w-xl mx-auto md:mx-0 text-lg leading-relaxed text-gray-600">
                Manager, imprenditore, practitioner. Trasformo l&apos;AI da teoria
                a risultati concreti — senza paroloni, solo applicazioni reali.
              </p>

              <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
                <Button asChild size="lg">
                  <Link href="/progetti">
                    Scopri i progetti
                    <ArrowRight size={16} />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-accent-500 text-accent-600 hover:bg-accent-500 hover:text-white hover:border-accent-500"
                >
                  <Link href="/collabora">Collabora</Link>
                </Button>
              </div>
            </div>

            {/* ── Hero image ── */}
            <div className="relative mx-auto md:mx-0 flex-shrink-0
                            w-full max-w-[300px] h-[300px]
                            md:w-[340px] md:h-[420px]
                            lg:w-[390px] lg:h-[470px]
                            rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/omar-hero.png"
                alt="Omar Bortolato — AI Practitioner"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 300px, (max-width: 1024px) 340px, 390px"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. CREDIBILITY STRIP ─────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-white">
        <div className="container mx-auto max-w-5xl px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {credibilityItems.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 md:p-4"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-800/10">
                  <Icon size={18} className="text-primary-800" />
                </div>
                <span className="text-xs font-medium leading-tight text-gray-800 md:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CHI SONO ──────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* ── Text ── */}
          <div className="flex-1 text-center md:text-left">
            <Badge variant="accent" className="mb-4 text-xs">Chi sono</Badge>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Omar Bortolato
            </h2>
            <p className="mt-1 mb-5 font-medium text-primary-800">
              AI Manager &amp; Practitioner
            </p>
            <p className="leading-relaxed text-gray-600 mb-6">
              46 anni, Padova. Padre, manager, imprenditore seriale.
              Da anni aiuto aziende e professionisti a passare dalla curiosità
              sull&apos;AI all&apos;implementazione concreta. Non vendo corsi
              teorici: mostro cosa ho costruito io stesso con l&apos;AI e come
              puoi replicarlo.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 font-medium text-primary-800 transition-colors hover:text-primary-700"
            >
              Leggi la storia completa
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* ── Profile image ── */}
          <div className="flex-shrink-0">
            <div className="relative h-44 w-44 md:h-52 md:w-52 overflow-hidden rounded-full shadow-lg ring-4 ring-primary-800/10">
              <Image
                src="/images/omar-profile.jpg"
                alt="Omar Bortolato"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 176px, 208px"
              />
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. PROGETTI IN EVIDENZA ──────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Progetti</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Cosa ho costruito con l&apos;AI
          </h2>
          <p className="mt-2 mb-10 max-w-xl text-gray-500">
            Progetti attivi, in sviluppo e in fase di lancio.
            Niente showcase: solo cose che funzionano.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {projects.map((project) => (
              <Card
                key={project.id}
                className="flex flex-col bg-white transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-3">
                  {/* Status badge */}
                  <span
                    className={`inline-flex w-fit items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${project.badge.classes}`}
                  >
                    {project.badge.label}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-gray-900">
                    {project.title}
                  </h3>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="mb-4 text-sm leading-relaxed text-gray-600">
                    {project.description}
                  </p>
                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-primary-800/15 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter>
                  {project.external ? (
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
                    >
                      Visita il sito
                      <ExternalLink size={14} />
                    </a>
                  ) : (
                    <Link
                      href={project.href}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
                    >
                      Scopri di più
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. TOOLS STACK ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-20">
        <Badge variant="accent" className="mb-3 text-xs">Stack</Badge>
        <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
          Il mio stack AI quotidiano
        </h2>
        <p className="mt-2 mb-10 text-gray-500">
          Niente teoria. Solo tool che uso davvero ogni giorno.
        </p>

        <div className="flex flex-wrap gap-3">
          {tools.map(({ icon: Icon, name }) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-primary-800/30 hover:text-primary-800"
            >
              <Icon size={15} className="text-primary-800" />
              {name}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
          >
            Vedi come li uso
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 6. SPEAKING & EVENTI ─────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">

            {/* ── Image ── */}
            <div className="relative w-full md:w-[45%] h-64 md:h-80 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/omar-speaking.jpg"
                alt="Omar Bortolato speaker al AI Week Milano 2026"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 45vw"
              />
            </div>

            {/* ── Text ── */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-xs font-semibold text-accent-600 mb-4">
                Maggio 2026
              </div>
              <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-4">
                Speaker @ AI Week Milano 2026
              </h2>
              <p className="leading-relaxed text-gray-600">
                Main stage insieme ad Arsenalia. Tema: implementazione
                pratica dell&apos;AI in azienda.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── 7. CTA FINALE ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Vuoi parlare di AI pratica?
          </h2>
          <p className="mt-4 mb-10 max-w-lg mx-auto text-lg text-primary-200">
            Consulenze, speaking, partnership.
            Lavoriamo insieme su progetti concreti.
          </p>
          <Button asChild variant="accent" size="lg" className="px-8 text-base">
            <Link href="/collabora">
              Collaboriamo
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
