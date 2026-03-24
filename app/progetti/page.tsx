import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Progetti — Omar Bortolato | AI in Produzione",
  description:
    "7 progetti reali dove l'AI viene applicata ogni giorno: e-commerce, real estate, startup, software. Numeri concreti, non teoria.",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Metric {
  value: string;
  label: string;
}

interface Project {
  id: string;
  status: { label: string; classes: string };
  title: string;
  subtitle: string;
  description: string[];
  metrics: Metric[];
  tags: string[];
  image: string | null;
  imageAlt: string;
  href?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATUS = {
  active:     "bg-green-100 text-green-700 border border-green-200",
  dev:        "bg-blue-100 text-blue-700 border border-blue-200",
  founding:   "bg-amber-100 text-amber-700 border border-amber-200",
  new:        "bg-purple-100 text-purple-700 border border-purple-200",
};

const projects: Project[] = [
  {
    id: "herbalife",
    status: { label: "Active", classes: STATUS.active },
    title: "E-commerce Multi-Paese",
    subtitle: "6 siti automatizzati in IT, FR, DE, UK, US, ES — costruiti, ottimizzati e scalati con l'AI.",
    description: [
      "Un ecosistema e-commerce che copre 6 paesi, costruito su una rete di network marketing Herbalife. L'AI ha trasformato quello che era un business manuale in una macchina quasi autonoma: dalla creazione dei siti alla gestione degli ordini, dal marketing alla SEO.",
      "Non abbiamo solo aggiunto l'AI ai processi esistenti — abbiamo ripensato tutto il flusso: PIM centralizzato per i prodotti, OMS per il tracciamento ordini, email marketing automatico, e SEO programmatica su scala. In corso: agentificazione di parti del business.",
    ],
    metrics: [
      { value: "+2000%", label: "revenue in 2 anni" },
      { value: "10×", label: "visitatori mensili" },
      { value: "+600%", label: "margine" },
      { value: "100s h", label: "risparmiate con automazioni" },
    ],
    tags: ["ChatGPT", "n8n", "WordPress", "Google Ads", "SEO Automation"],
    image: "/images/herbalife-screenshot.png",
    imageAlt: "Herbalife Multi-Country E-commerce",
  },
  {
    id: "phoenix-re",
    status: { label: "Active", classes: STATUS.active },
    title: "Phoenix RE Capital",
    subtitle: "Fondo immobiliare USA per investitori italiani — avviato e gestito con l'AI al posto di un team di avvocati.",
    description: [
      "Un fondo di investimento immobiliare focalizzato sul mercato USA, pensato per investitori italiani. L'AI ha reso possibile ciò che normalmente richiederebbe un team di avvocati e consulenti finanziari con costi proibitivi.",
      "Dalla redazione dei contratti alla comprensione delle normative americane, dalla creazione di template amministrativi ai calcolatori ROI per valutare ogni deal — l'AI è stata il mio co-pilot in ogni fase. Primo deal in chiusura Q2 2026.",
    ],
    metrics: [
      { value: "Q2 2026", label: "primo deal in chiusura" },
      { value: "€0", label: "costi legali esterni" },
      { value: "Custom", label: "calcolatori ROI con AI" },
      { value: "100%", label: "procedure automatizzate" },
    ],
    tags: ["ChatGPT", "Claude", "Google Sheets", "Notion", "Document AI"],
    image: "/images/phoenixre-screenshot.png",
    imageAlt: "Phoenix RE Capital",
    href: "https://phoenixrecapital.com",
  },
  {
    id: "fastlien",
    status: { label: "In Development", classes: STATUS.dev },
    title: "Fastlien",
    subtitle: "Software per investimenti in tax lien e tax deed — analisi aste e scoring delle opportunità.",
    description: [
      "Una piattaforma SaaS per una nicchia specifica del real estate americano: i tax lien e tax deed. Combinando la mia conoscenza dell'argomento con capacità analitiche e l'AI, abbiamo creato algoritmi di scoring e una UX ottimizzata per trovare le migliori opportunità d'asta.",
      "Grazie all'AI abbiamo rinnovato backend e frontend, migliorato la UX e introdotto nuove features. In corso: ricerca partner commerciali per scalare con un modello B2B — trainer e coach RE con audience propria, dove noi siamo il partner tecnologico.",
    ],
    metrics: [
      { value: "New UX", label: "rinnovata con AI" },
      { value: "B2B", label: "modello in sviluppo" },
      { value: "Scoring", label: "algoritmi proprietari" },
      { value: "SaaS", label: "partnership strategiche" },
    ],
    tags: ["Claude", "Python", "Data Analysis", "React", "Scoring Algorithms"],
    image: "/images/fastlien-screenshot.png",
    imageAlt: "Fastlien — Tax Lien Software",
    href: "https://fastlien.co",
  },
  {
    id: "fastland",
    status: { label: "New", classes: STATUS.new },
    title: "FastLand",
    subtitle: "Da idea a prodotto in un giorno. La prova che con l'AI un'idea può prendere vita immediatamente.",
    description: [
      "FastLand è la dimostrazione concreta di cosa significa \"velocità AI\". Un nuovo prodotto nato dall'ecosistema Fastlien, creato da zero in un solo giorno — dall'idea al prodotto funzionante.",
      "È la proof più tangibile della mia filosofia: con gli strumenti giusti e la mentalità giusta, il tempo tra l'intuizione e il mercato si è compresso drasticamente. Attualmente in fase di commercializzazione.",
    ],
    metrics: [
      { value: "1 giorno", label: "da idea a prodotto live" },
      { value: "€0", label: "costi di sviluppo esterni" },
      { value: "Live", label: "in fase di commercializzazione" },
      { value: "AI-first", label: "architettura nativa" },
    ],
    tags: ["Claude Code", "Full Stack AI", "Rapid Prototyping"],
    image: "/images/fastland-screenshot.png",
    imageAlt: "FastLand",
    href: "https://fastland.co",
  },
  {
    id: "docbit",
    status: { label: "Active", classes: STATUS.active },
    title: "DocBit",
    subtitle: "L'assistente AI che protegge i tuoi dati — intelligenza aziendale facile, sicura e conforme.",
    description: [
      "DocBit è un framework RAG per assistenti virtuali aziendali, sviluppato con Jera Solutions. Non un chatbot generico: un assistente che parla il linguaggio della TUA azienda, usa esclusivamente i TUOI documenti, e risponde ai TUOI clienti 24/7 in totale sicurezza.",
      "Questo è il progetto su cui sto puntando di più come \"AI pragmatica\" — quella che funziona davvero. Casi pratici, facili da capire, vicini al cliente. Italiana, sicura, conforme GDPR e AI Act. Multi-canale: sito web, WhatsApp, Telegram, Messenger.",
    ],
    metrics: [
      { value: "0", label: "allucinazioni con LLM privato" },
      { value: "GDPR", label: "e AI Act compliant" },
      { value: "Giorni", label: "setup, zero coding" },
      { value: "4+", label: "canali (web, WhatsApp, TG…)" },
    ],
    tags: ["RAG Framework", "LLM Privato", "API Integration", "Multi-channel"],
    image: "/images/docbit-screenshot.png",
    imageAlt: "DocBit AI Assistant",
    href: "https://www.docbit.ai",
  },
  {
    id: "azoa",
    status: { label: "Founding", classes: STATUS.founding },
    title: "Azoa Seed",
    subtitle: "AI-native startup factory — potenziare individui ad alta leva cognitiva per creare il futuro.",
    description: [
      "Azoa Seed è il progetto più ambizioso: una startup factory costruita nativamente sull'AI, co-fondata con Nicola Brisotto e Gianpaolo Greco.",
      "La visione: in un mondo dove il valore non è più prodotto da grandi strutture ma da individui aumentati, Azoa Seed è la piattaforma che abilita questa transizione. Sistemi componibili, agenti AI specializzati, riduzione delle dipendenze strutturali. Un ecosistema di SPV dove ogni startup nasce AI-first. Non è una scommessa su un prodotto. È una scommessa su un nuovo tipo di individuo.",
    ],
    metrics: [
      { value: "3", label: "co-founders" },
      { value: "AI+", label: "amplification platform" },
      { value: "SPV", label: "ecosistema di startup" },
      { value: "AI-first", label: "ogni prodotto nasce così" },
    ],
    tags: ["Claude Code", "Cowork", "Full Stack AI", "DAO Governance"],
    image: null,
    imageAlt: "Azoa Seed",
  },
  {
    id: "wahooapp",
    status: { label: "Active", classes: STATUS.active },
    title: "Wahooapp",
    subtitle: "Piattaforma di business messaging su WhatsApp — comunicazione professionale su scala.",
    description: [
      "Wahooapp è una piattaforma per la messaggistica business su WhatsApp, con pricing tiers e programma affiliati. Un tool che permette alle aziende di gestire la comunicazione con i clienti in modo professionale e scalabile.",
    ],
    metrics: [
      { value: "SaaS", label: "piattaforma live" },
      { value: "Tiers", label: "pricing attivi" },
      { value: "Affiliati", label: "programma attivo" },
      { value: "WA API", label: "integrazione nativa" },
    ],
    tags: ["WhatsApp Business API", "SaaS", "Automation"],
    image: "/images/wahooapp-screenshot.png",
    imageAlt: "Wahooapp — WhatsApp Business Platform",
    href: "https://wahooapp.io",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProjectImage({ src, alt }: { src: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex h-full min-h-[220px] w-full items-center justify-center rounded-2xl bg-gray-100">
        <div className="text-center text-gray-400">
          <ImageIcon size={40} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">Coming soon</p>
        </div>
      </div>
    );
  }
  return (
    <div className="relative w-full min-h-[220px] md:min-h-[300px] overflow-hidden rounded-2xl shadow-md">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, 45vw"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProgettiPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <Badge variant="accent" className="mb-4 text-xs">Progetti</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Cose che funzionano.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Non showcase, non demo. Progetti reali dove l&apos;AI viene testata in produzione
            ogni giorno — con numeri, risultati e lezioni apprese.
          </p>
        </div>
      </section>

      {/* ── PROGETTI ─────────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="divide-y divide-gray-100">
            {projects.map((project, index) => {
              const isEven = index % 2 === 1;
              return (
                <div
                  key={project.id}
                  id={project.id}
                  className="scroll-mt-20 py-16 md:py-20 first:pt-0"
                >
                  <div
                    className={`flex flex-col gap-10 md:gap-14 md:items-center ${
                      isEven ? "md:flex-row-reverse" : "md:flex-row"
                    }`}
                  >
                    {/* Image */}
                    <div className="w-full md:w-[45%] flex-shrink-0">
                      <ProjectImage src={project.image} alt={project.imageAlt} />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      {/* Status + link */}
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${project.status.classes}`}
                        >
                          {project.status.label}
                        </span>
                        {project.href && (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-primary-800 transition-colors"
                          >
                            {project.href.replace(/^https?:\/\//, "")}
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl mb-2">
                        {project.title}
                      </h2>
                      <p className="text-base font-medium text-primary-800 mb-4 leading-snug">
                        {project.subtitle}
                      </p>

                      <div className="space-y-3 text-gray-600 leading-relaxed text-sm mb-6">
                        {project.description.map((para, i) => (
                          <p key={i}>{para}</p>
                        ))}
                      </div>

                      {/* Metrics */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {project.metrics.map(({ value, label }) => (
                          <div
                            key={label}
                            className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
                          >
                            <p className="text-xl font-bold text-primary-800 leading-none mb-1">
                              {value}
                            </p>
                            <p className="text-xs text-gray-500">{label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
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
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA FINALE ───────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Hai un&apos;idea o un progetto dove l&apos;AI può fare la differenza?
          </h2>
          <p className="mt-4 mb-10 max-w-lg mx-auto text-lg text-primary-200">
            Consulenze, partnership, co-building. Parliamone.
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
