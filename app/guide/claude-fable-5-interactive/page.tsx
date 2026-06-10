import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Fable5Widget } from "@/components/guide/Fable5Widget";

export const metadata: Metadata = {
  title: "Claude Fable 5: guida interattiva — Omar Bortolato",
  description:
    "Esplora i modelli Claude in modo interattivo: radar chart, confronto capacità, casi d'uso e decision tree. Aggiornata giugno 2026.",
};

export default function GuidaFable5InteractivePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">

          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guide" className="hover:text-primary-800 transition-colors">Guide</Link>
            <span>/</span>
            <span className="text-gray-600">Claude Fable 5 — Interattiva</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Badge variant="accent" className="text-xs">Guida Interattiva</Badge>
            <span className="inline-flex items-center rounded-full border border-primary-800/20 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800">
              Giugno 2026
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
            Claude Fable 5
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
            Esplora modelli, confronta capacità, scopri i casi d&apos;uso per il tuo business.
            Seleziona un modello e osserva il radar chart cambiare in tempo reale.
          </p>

          <div className="mt-5 flex items-center gap-4">
            <Link
              href="/guide/claude-fable-5"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
            >
              Versione testuale →
            </Link>
          </div>

        </div>
      </section>

      {/* ── Widget ───────────────────────────────────────────────────────── */}
      <section className="bg-gray-950 py-10 md:py-14">
        <div className="container mx-auto max-w-4xl px-4">
          <Fable5Widget />
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center md:py-20">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Vuoi parlare di AI pratica?
          </h2>
          <p className="mt-3 mb-8 text-primary-200 max-w-lg mx-auto">
            Consulenze, partnership, co-building. Seguimi su LinkedIn per aggiornamenti
            su modelli AI, automazioni e applicazioni reali in azienda.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild variant="accent" size="lg" className="px-8">
              <a href="https://linkedin.com/in/omarbortolato" target="_blank" rel="noopener noreferrer">
                <Linkedin size={18} />
                Seguimi su LinkedIn
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 hover:text-white hover:border-white/50">
              <Link href="/collabora">
                Collaboriamo
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Back ─────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-800"
        >
          <ArrowLeft size={14} />
          Tutte le guide
        </Link>
      </div>
    </>
  );
}
