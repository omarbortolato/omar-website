import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Zap,
  Brain,
  Eye,
  Code2,
  Bot,
  BarChart3,
  Scale,
  ShoppingCart,
  PenLine,
  Cpu,
  Building2,
  Linkedin,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Claude Fable 5: guida pratica completa — Omar Bortolato",
  description:
    "Cosa è Fable 5, come si confronta con Haiku/Sonnet/Opus, quando usarlo e come sfruttarlo al massimo. Guida pratica aggiornata a giugno 2026.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const models = [
  {
    key: "haiku",
    name: "Haiku 4.5",
    tier: "Speed",
    tagline: "Volume e velocità. Costo quasi nullo.",
    cost: "~$0,25/M token in",
    context: "200K token",
    colorClass: "border-red-200 bg-red-50",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
    barClass: "bg-red-400",
    scores: { coding: 40, reasoning: 35, vision: 30, longContext: 20, agentic: 15, speed: 95 },
    bestFor: ["Classificazione e routing ad alto volume", "Risposte brevi automatizzate", "Pipeline n8n/Make", "Traduzione e normalizzazione dati"],
    notFor: ["Analisi complessa multi-documento", "Codice critico o architetturale"],
  },
  {
    key: "sonnet",
    name: "Sonnet 4.6",
    tier: "Balance",
    tagline: "Il cavallo di battaglia quotidiano.",
    cost: "~$3/M token in",
    context: "200K token",
    colorClass: "border-amber-200 bg-amber-50",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
    barClass: "bg-amber-400",
    scores: { coding: 70, reasoning: 65, vision: 60, longContext: 55, agentic: 55, speed: 80 },
    bestFor: ["Chat e assistenti AI in produzione", "Draft articoli e contenuti", "Analisi dati a media complessità", "Workflow di automazione standard"],
    notFor: ["Task multi-step su codebase lunghe", "Analisi parallela di molti documenti"],
  },
  {
    key: "opus",
    name: "Opus 4.8",
    tier: "Power",
    tagline: "Prima scelta per profondità di ragionamento.",
    cost: "~$15/M token in",
    context: "200K token",
    colorClass: "border-green-200 bg-green-50",
    badgeClass: "bg-green-100 text-green-700 border-green-200",
    barClass: "bg-green-500",
    scores: { coding: 83, reasoning: 85, vision: 78, longContext: 78, agentic: 72, speed: 40 },
    bestFor: ["Pitch deck e presentazioni strategiche", "Analisi legale e contrattuale", "Architettura di sistemi complessi", "Ragionamento profondo su un singolo documento"],
    notFor: ["Produzione in volume (costo elevato)", "Task semplici o ripetitivi"],
  },
  {
    key: "fable",
    name: "Fable 5",
    tier: "Frontier",
    tagline: "Mythos-class con safeguard. Il salto generazionale.",
    cost: "$10/$50/M token in/out",
    context: "1M token",
    colorClass: "border-primary-800/30 bg-primary-800/5",
    badgeClass: "bg-primary-800/10 text-primary-800 border-primary-800/20",
    barClass: "bg-primary-800",
    scores: { coding: 98, reasoning: 97, vision: 95, longContext: 99, agentic: 97, speed: 55 },
    bestFor: ["Refactor e migrazione di grandi codebase", "Agenti multi-step completamente autonomi", "Analisi simultanea di molti documenti complessi", "Prototipazione rapida one-shot", "Vision: screenshot → codice funzionante"],
    notFor: ["Alto volume (costo elevato)", "Task banali o ripetitivi"],
  },
];

const scoreLabels: Record<string, string> = {
  coding: "Coding",
  reasoning: "Reasoning",
  vision: "Vision",
  longContext: "Long Context",
  agentic: "Agentic",
  speed: "Velocità",
};

const useCases = [
  {
    icon: Code2,
    name: "SaaS B2B con AI integrata",
    description: "Piattaforma con AI assistant, documenti, workflow utente",
    recommended: "Sonnet 4.6 + Fable 5",
    why: "Sonnet gestisce la produzione quotidiana degli utenti in modo cost-efficient. Fable entra per le feature differenzianti: analisi documenti complessi, workflow agentic multi-step, funzionalità enterprise che i competitor non possono replicare facilmente.",
    also: "Haiku per auto-categorizzazione, routing interno, notifiche.",
  },
  {
    icon: Zap,
    name: "Agenzia di sviluppo AI-native",
    description: "Consegna prototipi e MVP in tempi drasticamente ridotti",
    recommended: "Fable 5",
    why: "Il caso d'uso più diretto. Fable one-shot applicazioni che prima richiedevano 100 prompt. Stripe ha riportato mesi di engineering compressi in giorni su una codebase da 50M righe. Il vantaggio competitivo è consegnare cose che sembrano impossibili.",
    also: "Claude Code con Fable per sessioni di sviluppo lunghe e autonome.",
  },
  {
    icon: Bot,
    name: "Automazione processi aziendali",
    description: "n8n / Make, email processing, CRM sync, report automatici",
    recommended: "Haiku in prod, Fable per l'architettura",
    why: "Il volume di operazioni non giustifica Fable in produzione. Haiku gestisce il 90% dei task a costo quasi zero. Fable entra per progettare l'architettura iniziale, scrivere i workflow complessi, e risolvere problemi che bloccano il progetto.",
    also: "Sonnet per content generation e analisi a media complessità nel flusso.",
  },
  {
    icon: Scale,
    name: "Legal tech / analisi contrattuale",
    description: "Review contratti, due diligence, comparazione documenti",
    recommended: "Fable 5",
    why: "Il context da 1M token permette di caricare più contratti in parallelo e chiedere analisi cross-documento. Harvey (legal AI) ha già adottato Fable come modello principale riportando risultati al top dei loro benchmark legali.",
    also: "Opus 4.8 come alternativa economica per documenti singoli.",
  },
  {
    icon: ShoppingCart,
    name: "E-commerce + marketing automation",
    description: "Google Ads, copy multilingue, analisi GA4, Apps Script",
    recommended: "Sonnet 4.6",
    why: "Il volume di operazioni quotidiane (copy, traduzioni, analisi performance, script) non giustifica Fable. Sonnet è ottimo per scrivere Apps Script, interpretare GA4, generare copy multilingue in modo coerente.",
    also: "Haiku per pipeline di traduzione bulk. Fable solo per architetture nuove o revisioni strategiche.",
  },
  {
    icon: PenLine,
    name: "Personal brand & content",
    description: "Articoli LinkedIn, blog tecnici, newsletter, thought leadership",
    recommended: "Fable 5",
    why: "Per chi scrive di AI e tecnologia, usare il modello più avanzato prima degli altri è già posizionamento. Fable eccelle su articoli lunghi che richiedono ricerca + struttura + voce coerente, senza degrado fino a 5.000+ parole.",
    also: "Sonnet per bozze veloci, LinkedIn posts corti, risposte ai commenti.",
  },
  {
    icon: BarChart3,
    name: "Fintech / analisi dati complessi",
    description: "Modelli finanziari, report, analisi multi-fonte, dashboard",
    recommended: "Fable 5",
    why: "IMC ha riportato che Fable ha superato i loro benchmark di trading analysis su tutti i fronti: factual lookup, reasoning concettuale, root-cause analysis. Hebbia Finance Benchmark vede Fable al top. Per tabelle, grafici e ragionamento numerico su documenti lunghi, non c'è alternativa.",
    also: "Opus 4.8 per analisi su documento singolo di media lunghezza.",
  },
  {
    icon: Cpu,
    name: "Sviluppo prodotto software",
    description: "Codebase esistente, refactor, nuove feature, bug fixing",
    recommended: "Fable 5 in Claude Code",
    why: "Il context da 1M token permette di caricare l'intera codebase senza finestra scorrevole. Fable mantiene il contesto architetturale attraverso sessioni lunghe e migliora autonomamente le proprie note interne. Su FrontierCode benchmark, Fable è al top tra i modelli frontier.",
    also: "Sonnet per debug veloci e domande puntuali.",
  },
];

const decisionSteps = [
  { q: "Task in volume (>100/giorno) e bassa complessità?", a: "Haiku 4.5", note: "Classificazione, routing, traduzioni bulk, notifiche." },
  { q: "Chat utente, bozze, workflow di automazione standard?", a: "Sonnet 4.6", note: "Il default quotidiano per la maggior parte dei casi." },
  { q: "Analisi profonda, strategia, ragionamento su un singolo documento?", a: "Opus 4.8", note: "Più economico di Fable quando il context è sotto 200K." },
  { q: "Codice lungo, multi-file, task agentic, più documenti in parallelo?", a: "Fable 5", note: "Il punto di forza reale — non sprecare Fable su task semplici." },
  { q: "Context > 200K token? Task che dura ore in autonomia?", a: "Fable 5 — obbligatorio", note: "Solo Fable ha 1M context e memoria file-based persistente." },
];

const tips = [
  {
    title: "Sfrutta il context da 1M token",
    desc: "Carica l'intera codebase o tutti i documenti rilevanti all'inizio della sessione. Fable non degrada su testi lunghi: con memoria file-based, le prestazioni migliorano nel tempo fino a 3x rispetto a sessioni senza memoria.",
  },
  {
    title: "Brief completo, non prompt frammentati",
    desc: "Invece di 10 prompt sequenziali, scrivi un brief unico con obiettivo, constraint e output atteso. L'autonomia è il punto di forza di Fable: lascia che lavori in modo esteso prima di intervenire.",
  },
  {
    title: "Vision per il workflow di sviluppo",
    desc: "Screenshot di UI → codice funzionante. Screenshot di errori → debug immediato. Fable può ricostruire il codice sorgente di un'intera web app partendo solo da uno screenshot, senza descrizioni aggiuntive.",
  },
  {
    title: "Calcolo ROI prima di usarlo in produzione",
    desc: "A $10/M input e $50/M output, un task da 10K token costa ~$0,10. Se quel task vale più di €0,10 di tempo umano risparmiato — Fable vince. Applicalo solo dove il delta qualitativo è reale, non come default per tutto.",
  },
  {
    title: "Attenzione ai safeguard automatici",
    desc: "Meno del 5% delle sessioni viene rediretto a Opus 4.8. Le aree protette includono cybersecurity avanzata, biologia e chimica avanzata. Per la stragrande maggioranza dei casi d'uso aziendali, questo limite non si incontra mai.",
  },
];

const businessStacks = [
  { type: "Startup / Agenzia AI", stack: "Fable 5 per dev e prototipazione · Sonnet in produzione · Haiku per volume" },
  { type: "SaaS con AI integrata", stack: "Sonnet come default utenti · Fable per feature premium · Haiku per routing" },
  { type: "Consulente / Freelance AI", stack: "Fable 5 per tutto il lavoro client-facing · Sonnet per admin e bozze veloci" },
  { type: "Enterprise / Processi interni", stack: "Opus o Fable per analisi strategica · Sonnet per produzione · Haiku per automazioni" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ value, barClass }: { value: number; barClass: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-gray-200">
      <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: `${value}%` }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function GuidaFable5Page() {
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
            <span className="text-gray-600">Claude Fable 5</span>
          </nav>

          {/* Badges */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="text-xs">Guida Gratuita</Badge>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary-800/20 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800">
              <Sparkles size={10} />
              Aggiornata giugno 2026
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl lg:text-6xl">
            Claude Fable 5:<br className="hidden sm:block" />
            <span className="text-primary-800">la guida pratica</span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-500">
            Rilasciato il 9 giugno 2026. Mythos-class, 1M token context, capacità agentiche al top dell&apos;industria.
            Cosa è, come si confronta con gli altri modelli Claude, quando usarlo e come sfruttarlo al massimo.
          </p>

          {/* Quick stats */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Context", value: "1M token" },
              { label: "Prezzo API", value: "$10/$50 per M" },
              { label: "Safeguard", value: "< 5% redirect" },
              { label: "Tier", value: "Mythos-class" },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm">
                <span className="text-gray-400">{label}: </span>
                <span className="font-semibold text-gray-900">{value}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">

        <div className="prose prose-slate prose-lg max-w-none
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-h2:text-gray-900 prose-h2:font-bold
          prose-strong:text-gray-900">

          <p>
            Fable 5 è il primo modello <strong>Mythos-class</strong> di Anthropic reso pubblico per uso generale.
            Non è un aggiornamento incrementale: è un salto di categoria. Anthropic ha impiegato circa due mesi dopo
            Mythos Preview per aggiungere safeguard sufficienti — e il risultato è un modello con capacità che,
            fino a qualche mese fa, sembravano impossibili per un sistema commerciale.
          </p>
          <p>
            La differenza chiave rispetto a Opus 4.8? Due cose: un context window di <strong>1 milione di token</strong>
            (contro 200K di tutti gli altri) e prestazioni agentiche che permettono di lavorare in autonomia
            per ore su task complessi. Stripe ha migrato una codebase Ruby da 50 milioni di righe in un solo giorno.
            IMC ha riportato risultati al top in trading analysis su tutti gli assi. Harvey
            lo ha adottato come modello principale per l&apos;analisi legale.
          </p>
          <p>
            Questa guida non è una raccolta di benchmark. È il distillato di quello che ho capito
            testando il modello: quando vale davvero il costo in più, come organizzare il workflow
            per sfruttarlo al massimo, e quale stack ha senso per ogni tipo di business.
          </p>
        </div>

        {/* Callout */}
        <div className="mt-8 rounded-2xl border border-primary-800/20 bg-primary-800/5 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-500" />
            <div>
              <p className="font-semibold text-gray-900 mb-1">Finestra di accesso incluso: fino al 22 giugno</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Fino al 22 giugno 2026, Fable 5 è incluso in tutti i piani a pagamento Claude senza costi aggiuntivi.
                Dopo passa a sistema a crediti. Se hai progetti con codebase lunghe, analisi multi-documento
                o prototipazione rapida — usalo subito.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* ── I 4 modelli ──────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">

          <Badge variant="accent" className="mb-3 text-xs">Panoramica</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">I 4 modelli Claude</h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            Quattro modelli, quattro tier. Ogni modello ha una nicchia precisa —
            la scelta giusta dipende dal task, non da quale è &quot;il migliore&quot;.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {models.map((m) => (
              <div key={m.key} className={`rounded-2xl border-2 bg-white p-6 shadow-sm ${m.colorClass}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${m.badgeClass}`}>
                      {m.tier}
                    </span>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">{m.name}</h3>
                    <p className="text-sm text-gray-500 italic">{m.tagline}</p>
                  </div>
                </div>

                <div className="mb-4 flex flex-wrap gap-3 text-sm">
                  <span className="text-gray-500">Costo: <span className="font-medium text-gray-800">{m.cost}</span></span>
                  <span className="text-gray-500">Context: <span className="font-medium text-gray-800">{m.context}</span></span>
                </div>

                {/* Score bars */}
                <div className="mb-5 space-y-2">
                  {Object.entries(m.scores).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-3">
                      <span className="w-24 text-xs text-gray-400 flex-shrink-0">{scoreLabels[key]}</span>
                      <ScoreBar value={val} barClass={m.barClass} />
                      <span className="w-6 text-right text-xs font-medium text-gray-500">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1">
                  {m.bestFor.slice(0, 3).map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-gray-600">
                      <Check size={12} className="mt-0.5 flex-shrink-0 text-green-500" />
                      {b}
                    </div>
                  ))}
                  {m.notFor.slice(0, 1).map((b) => (
                    <div key={b} className="flex items-start gap-2 text-xs text-gray-400">
                      <X size={12} className="mt-0.5 flex-shrink-0 text-red-400" />
                      {b}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Confronto capacità ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">

        <Badge variant="accent" className="mb-3 text-xs">Confronto</Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Capacità a confronto</h2>
        <p className="text-gray-500 mb-10">Tabella comparativa su tutti gli assi di performance.</p>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left font-semibold text-gray-600">Modello</th>
                {Object.values(scoreLabels).map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {models.map((m) => (
                <tr key={m.key} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${m.badgeClass}`}>
                      {m.name}
                    </span>
                  </td>
                  {Object.entries(m.scores).map(([key, val]) => (
                    <td key={key} className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 rounded-full bg-gray-200">
                          <div className={`h-1.5 rounded-full ${m.barClass}`} style={{ width: `${val}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{val}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Casi d'uso ───────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">

          <Badge variant="accent" className="mb-3 text-xs">Casi d&apos;uso</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quale modello per il tuo business</h2>
          <p className="text-gray-500 mb-10">
            Per settore e tipo di progetto. Clicca su ogni caso per vedere il ragionamento completo.
          </p>

          <div className="space-y-3">
            {useCases.map((uc) => {
              const Icon = uc.icon;
              return (
                <details
                  key={uc.name}
                  className="group rounded-2xl border border-gray-200 bg-white shadow-sm open:shadow-md transition-shadow"
                >
                  <summary className="flex cursor-pointer items-center gap-4 p-5 list-none">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary-800/8">
                      <Icon size={18} className="text-primary-800" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 leading-snug">{uc.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{uc.description}</p>
                    </div>
                    <span className="flex-shrink-0 inline-flex items-center rounded-full border border-primary-800/20 bg-primary-800/5 px-2.5 py-0.5 text-xs font-semibold text-primary-800 whitespace-nowrap">
                      {uc.recommended}
                    </span>
                    <span className="flex-shrink-0 ml-2 text-gray-300 group-open:rotate-180 transition-transform text-lg leading-none">
                      ↓
                    </span>
                  </summary>
                  <div className="border-t border-gray-100 px-5 pb-5 pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{uc.why}</p>
                    <p className="text-sm text-gray-400">
                      <span className="text-accent-600 font-medium">+ Anche: </span>
                      {uc.also}
                    </p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Decision tree ────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">

        <Badge variant="accent" className="mb-3 text-xs">Guida rapida</Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Come scegliere: 5 domande</h2>
        <p className="text-gray-500 mb-10">
          Rispondi in ordine. La prima risposta affermativa ti dà il modello giusto.
        </p>

        <div className="space-y-4">
          {decisionSteps.map((step, i) => (
            <div key={i} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-800/8 text-sm font-bold text-primary-800">
                {i + 1}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 leading-snug">{step.q}</p>
                <p className="mt-1.5 text-sm font-semibold text-primary-800">→ {step.a}</p>
                <p className="mt-1 text-xs text-gray-400">{step.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tips Fable 5 ─────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-16">
        <div className="container mx-auto max-w-4xl px-4">

          <Badge variant="accent" className="mb-3 text-xs">Best practice</Badge>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Come usare Fable 5 al massimo</h2>
          <p className="text-gray-500 mb-10">
            Cinque principi per sfruttare davvero il potenziale del modello.
          </p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {tips.map((tip, i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-primary-800/8 text-sm font-bold text-primary-800">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-900">{tip.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
            {/* Final recommendation card spanning full width */}
            <div className="md:col-span-2 rounded-2xl border border-primary-800/25 bg-primary-800/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-800 mb-2">Raccomandazione finale</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                Usa Fable 5 come default per tutto quello che oggi mandi a Opus. La differenza qualitativa è reale,
                specialmente su task lunghi e complessi — il vantaggio di Fable si allarga proporzionalmente
                alla durata e complessità del problema. Tieni Haiku per volume e Sonnet come default economico
                per tutto il resto. Il vero ROI emerge sui progetti dove comprimere mesi in giorni è possibile:
                lì il costo API diventa irrilevante.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stack per business ───────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-16">

        <Badge variant="accent" className="mb-3 text-xs">Stack</Badge>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stack consigliato per tipo di business</h2>
        <p className="text-gray-500 mb-10">La combinazione ottimale per ogni contesto.</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {businessStacks.map(({ type, stack }) => (
            <div key={type} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <Building2 size={18} className="mt-0.5 flex-shrink-0 text-primary-800" />
              <div>
                <p className="font-semibold text-gray-900">{type}</p>
                <p className="mt-1 text-sm text-gray-500 leading-relaxed">{stack}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA LinkedIn ─────────────────────────────────────────────────── */}
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
              <a
                href="https://linkedin.com/in/omarbortolato"
                target="_blank"
                rel="noopener noreferrer"
              >
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

      {/* ── Back link ────────────────────────────────────────────────────── */}
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
