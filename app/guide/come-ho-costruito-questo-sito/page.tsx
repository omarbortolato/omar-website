import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, Terminal, Zap, Code2, Globe, GitBranch, Cpu } from "lucide-react";
import { SubscribeForm } from "@/components/guide/subscribe-form";

export const metadata: Metadata = {
  title: "Come ho costruito questo sito con Claude Code — Guida Gratuita",
  description:
    "Da zero a sito professionale in 2 settimane. Budget €0, zero competenze di coding. La guida completa con strumenti, processo ed errori reali.",
};

const learnings = [
  {
    icon: Terminal,
    title: "Il setup completo",
    desc: "Next.js 14, Tailwind, TypeScript, Vercel. Ogni scelta spiegata con il motivo — non solo il cosa, ma il perché.",
  },
  {
    icon: Code2,
    title: "Come lavori con Claude Code",
    desc: "Il metodo per dare istruzioni efficaci, come gestire i file, come revisionare il codice senza saperlo leggere.",
  },
  {
    icon: GitBranch,
    title: "Git e deploy automatico",
    desc: "Il workflow commit → push → Vercel. Come ogni modifica va online in 3 minuti senza toccare un server.",
  },
  {
    icon: Globe,
    title: "Notion come CMS",
    desc: "Il blog alimentato da Notion. Scrivi su Notion, il sito si aggiorna da solo. Zero database, zero hosting extra.",
  },
  {
    icon: Zap,
    title: "Gli errori che ho fatto",
    desc: "Cosa non ha funzionato, perché, e come l'ho risolto. La parte che non trovi su YouTube.",
  },
  {
    icon: Cpu,
    title: "Il principio che cambia tutto",
    desc: "Come usare Claude come pair programmer invece che come generatore di codice. La differenza che fa la differenza.",
  },
];

const forWho = [
  "Hai un'idea per un sito ma non sai programmare",
  "Vuoi capire come funziona davvero Next.js senza un corso da 40 ore",
  "Stai valutando Claude Code ma non sai da dove iniziare",
  "Cerchi un processo documentato da qualcuno che l'ha fatto per davvero",
];

export default function GuidaClaudeCodePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guide" className="hover:text-primary-800 transition-colors">Guide</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">Come ho costruito questo sito</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            {/* Text */}
            <div className="flex-1">
              <span className="mb-4 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Guida gratuita
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
                Come ho costruito questo sito con Claude Code
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                Da zero a sito professionale in 2 settimane.
                Budget: €0. Competenze di coding richieste: zero.
              </p>

              {/* Credibility note */}
              <p className="mt-6 rounded-xl border border-primary-800/15 bg-primary-800/5 px-4 py-3 text-sm text-primary-800">
                <strong>Questo sito stesso</strong> è stato costruito esattamente
                con il processo descritto in questa guida.
              </p>
            </div>

            {/* Visual — stacked pages */}
            <div className="flex-shrink-0">
              <div className="relative w-44 h-56 mx-auto">
                <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-2xl bg-primary-800/10 border border-primary-800/15" />
                <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-2xl bg-primary-800/15 border border-primary-800/20" />
                <div className="absolute inset-0 rounded-2xl bg-white shadow-xl border border-gray-200 p-5 flex flex-col gap-2">
                  <div className="w-10 h-1.5 rounded bg-accent-500 mb-1" />
                  <div className="h-2 w-full rounded bg-gray-100" />
                  <div className="h-2 w-5/6 rounded bg-gray-100" />
                  <div className="h-2 w-4/5 rounded bg-gray-100" />
                  <div className="h-px bg-gray-100 my-1" />
                  <div className="h-1.5 w-full rounded bg-gray-50" />
                  <div className="h-1.5 w-full rounded bg-gray-50" />
                  <div className="h-1.5 w-3/4 rounded bg-gray-50" />
                  <div className="h-1.5 w-full rounded bg-gray-50" />
                  <div className="h-1.5 w-5/6 rounded bg-gray-50" />
                  <div className="mt-auto h-7 w-full rounded-lg bg-primary-800/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cosa imparerai ───────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
          Cosa trovi nella guida
        </h2>
        <p className="mb-10 text-gray-500">
          Non teoria. Ogni scelta ha un motivo concreto.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {learnings.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800/10">
                <Icon size={18} className="text-primary-800" />
              </div>
              <h3 className="mb-1.5 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Per chi è ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">
            Per chi è questa guida
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {forWho.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl bg-white border border-gray-100 p-4 shadow-sm"
              >
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                  <Check size={11} className="text-green-600" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form email ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Scarica la guida gratis
          </h2>
          <p className="mb-8 text-gray-500">
            Inserisci la tua email e ricevi il link di download immediato.
          </p>
          <SubscribeForm guide="come-ho-costruito-questo-sito" />
        </div>
      </section>

      {/* ── Back link ─────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-4xl px-4 pb-16">
        <Link
          href="/guide"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-primary-800"
        >
          <ArrowLeft size={14} />
          Tutte le guide
        </Link>
      </div>
    </>
  );
}
