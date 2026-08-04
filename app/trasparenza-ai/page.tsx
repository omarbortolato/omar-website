import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, X, FileText, Bot, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Trasparenza AI — Omar Bortolato",
  description:
    "Dove uso l'intelligenza artificiale su questo sito, come vengono revisionati i contenuti e chi ne ha la responsabilità editoriale.",
};

const usa = [
  {
    icon: FileText,
    title: "Articoli del blog",
    desc: "La prima stesura nasce da un mio appunto o da un post che ho scritto io, e viene sviluppata con un modello linguistico. Rileggo e riscrivo prima della pubblicazione. Le idee, le opinioni e gli errori sono miei.",
  },
  {
    icon: FileText,
    title: "Spremute di libro",
    desc: "Sono rielaborazioni generate da un modello a partire dal libro e dalle mie note di lettura, con una pipeline automatica. Le controllo prima che vadano online. Non sono riassunti ufficiali né sostituiscono il libro.",
  },
  {
    icon: FileText,
    title: "Guide scaricabili",
    desc: "Ricerca, struttura e stesura sono assistite da modelli. Le fonti citate sono verificate una per una, e ogni guida riporta la data di consultazione.",
  },
  {
    icon: Bot,
    title: "Automazioni interne",
    desc: "Il flusso editoriale che porta un'idea fino alla pubblicazione è automatizzato. Nessuna di queste automazioni pubblica da sola: l'ultimo passaggio è sempre una mia approvazione.",
  },
];

const nonUsa = [
  "Non ci sono chatbot o assistenti conversazionali su questo sito: nessuna pagina ti mette a parlare con un'AI.",
  "Non genero recensioni, testimonianze o commenti di persone che non esistono.",
  "Non pubblico immagini che ritraggono persone reali in situazioni che non sono avvenute.",
  "Non uso sistemi di riconoscimento delle emozioni, categorizzazione biometrica o profilazione dei visitatori.",
];

export default function TrasparenzaAiPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Trasparenza AI</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-800/20 bg-primary-800/5 px-3 py-1 text-xs font-semibold text-primary-800">
            <ShieldCheck size={12} />
            Informativa
          </span>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
            Come uso l&apos;AI su questo sito
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
            Scrivo di AI applicata, quindi la uso. Qui c&apos;è scritto dove, come vengono
            controllati i contenuti e chi ne risponde. Senza formule legali dove non servono.
          </p>
        </div>
      </section>

      {/* ── Responsabilità ───────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">
        <div className="rounded-2xl border border-primary-800/15 bg-primary-800/5 p-6 md:p-8">
          <h2 className="text-xl font-bold text-primary-800 md:text-2xl">
            La responsabilità editoriale è mia
          </h2>
          <p className="mt-3 leading-relaxed text-gray-600">
            Qualunque sia stato lo strumento usato per produrlo, ogni contenuto pubblicato su
            omarbortolato.it passa da una mia revisione prima di andare online. Se un contenuto
            contiene un errore, l&apos;errore è mio: non è dell&apos;AI e non è una scusa.
          </p>
        </div>
      </section>

      {/* ── Dove la uso ──────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 pb-14 md:pb-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">Dove la uso</h2>
        <p className="mb-8 text-gray-500">Con che ruolo, e cosa resta a carico mio.</p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {usa.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary-800/10">
                <Icon size={18} className="text-primary-800" />
              </div>
              <h3 className="mb-1.5 font-semibold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Dove non la uso ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 md:text-3xl">Dove non la uso</h2>
          <div className="grid grid-cols-1 gap-3">
            {nonUsa.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <X size={11} className="text-gray-500" />
                </div>
                <p className="text-sm leading-relaxed text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cosa dice la norma ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
          Il riferimento normativo
        </h2>
        <p className="mb-8 text-gray-500">
          Per chi vuole sapere a quale obbligo corrisponde questa pagina.
        </p>

        <div className="space-y-4 text-gray-600">
          <p className="leading-relaxed">
            Il Regolamento (UE) 2024/1689, noto come AI Act, all&apos;articolo 50 prevede una
            serie di obblighi di trasparenza. Quello che riguarda un sito come questo è il
            paragrafo 4: chi pubblica testo generato o manipolato da un sistema di intelligenza
            artificiale allo scopo di informare il pubblico su questioni di interesse pubblico deve
            dichiararlo.
          </p>
          <p className="leading-relaxed">
            Lo stesso paragrafo prevede un&apos;esenzione: l&apos;obbligo non si applica quando il
            contenuto è stato sottoposto a revisione umana o a controllo editoriale, e una persona
            fisica o giuridica ne assume la responsabilità editoriale. È esattamente la situazione
            di questo sito.
          </p>
          <p className="leading-relaxed">
            Dichiaro comunque, in ogni articolo e in ogni guida, che il contenuto è stato prodotto
            con l&apos;assistenza di sistemi di AI. Non perché sia obbligatorio nel mio caso, ma
            perché scrivere di AI pratica e nascondere di usarla sarebbe una contraddizione.
          </p>

          <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
            <div className="flex items-start gap-3">
              <Check size={16} className="mt-0.5 flex-shrink-0 text-green-600" />
              <p className="text-sm leading-relaxed text-gray-600">
                Le disposizioni dell&apos;articolo 50 si applicano dal <strong>2 agosto 2026</strong>.
                Questa pagina è in vigore da quella data.
              </p>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-gray-500">
            Testo dell&apos;articolo:{" "}
            <a
              href="https://artificialintelligenceact.eu/article/50/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-800 hover:underline"
            >
              artificialintelligenceact.eu/article/50
            </a>
          </p>
        </div>
      </section>

      {/* ── Segnalazioni ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
            Hai trovato un errore?
          </h2>
          <p className="max-w-2xl leading-relaxed text-gray-600">
            Se un contenuto di questo sito contiene un&apos;informazione sbagliata, una fonte citata
            male o un&apos;attribuzione scorretta, scrivimi e lo correggo. Le correzioni sono la
            parte più utile del riscontro che ricevo.
          </p>
          <Link
            href="/collabora"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-800 hover:underline"
          >
            Scrivimi
          </Link>
        </div>
      </section>

      <div className="container mx-auto max-w-4xl px-4 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-primary-800"
        >
          <ArrowLeft size={14} />
          Torna alla home
        </Link>
      </div>
    </>
  );
}
