import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Mic, Handshake, Calendar, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Collabora — Omar Bortolato",
  description:
    "Consulenza AI, speaking e partnership. Scelgo con cura con chi lavorare — scrivimi.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const percorsi = [
  {
    icon: Brain,
    title: "Consulenza AI",
    description:
      "Vuoi portare l'AI nella tua azienda o nel tuo business ma non sai da dove iniziare? Lavoriamo insieme per trovare i quick win concreti.",
    cta: "Prenota una call",
  },
  {
    icon: Mic,
    title: "Speaking & Workshop",
    description:
      "Cerchi un relatore pratico per il tuo evento, team o azienda? Porto casi reali, zero slide generiche.",
    cta: "Scrivimi",
  },
  {
    icon: Handshake,
    title: "Partnership",
    description:
      "Hai un'idea o un progetto dove l'AI può fare la differenza? Possiamo costruirla insieme.",
    cta: "Parliamo",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CollaboraPage() {
  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <Badge variant="accent" className="mb-4 text-xs">Collabora</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Costruiamo qualcosa insieme.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Che tu abbia un progetto, un&apos;idea o una domanda — sono curioso di sentire.
            Scelgo con cura con chi lavorare, proprio per questo rispondo sempre.
          </p>
        </div>
      </section>

      {/* ── 2. TRE PERCORSI ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {percorsi.map(({ icon: Icon, title, description, cta }) => (
              <div
                key={title}
                className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-800/10">
                  <Icon size={22} className="text-primary-800" />
                </div>
                <h2 className="mb-2 text-lg font-bold text-gray-900">{title}</h2>
                <p className="flex-1 text-sm leading-relaxed text-gray-600">{description}</p>
                <a
                  href="#form"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
                >
                  {cta}
                  <ArrowRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. FORM ───────────────────────────────────────────────────────────── */}
      <section id="form" className="bg-gray-50 py-16 md:py-20 scroll-mt-20">
        <div className="container mx-auto max-w-2xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Contatto</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-2">
            Scrivimi direttamente
          </h2>
          <p className="text-gray-500 mb-10">
            Rispondo entro 48 ore. Niente spam, niente newsletter automatiche.
          </p>

          <form
            action="mailto:hello@omarbortolato.it"
            method="get"
            encType="text/plain"
            className="space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nome <span className="text-accent-500">*</span>
                </label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  required
                  placeholder="Il tuo nome"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email <span className="text-accent-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="tua@email.com"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="tipo" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tipo di collaborazione
              </label>
              <select
                id="tipo"
                name="tipo"
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10"
              >
                <option value="">Seleziona...</option>
                <option value="Consulenza AI">Consulenza AI</option>
                <option value="Speaking & Workshop">Speaking &amp; Workshop</option>
                <option value="Partnership">Partnership</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            <div>
              <label htmlFor="messaggio" className="mb-1.5 block text-sm font-medium text-gray-700">
                Messaggio <span className="text-accent-500">*</span>
              </label>
              <textarea
                id="messaggio"
                name="messaggio"
                required
                rows={5}
                placeholder="Raccontami il tuo progetto o la tua idea..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 resize-none"
              />
            </div>

            <Button type="submit" variant="accent" size="lg" className="w-full sm:w-auto px-8">
              Invia messaggio
              <ArrowRight size={16} />
            </Button>
          </form>
        </div>
      </section>

      {/* ── 4. CAL.COM PLACEHOLDER ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Calendario</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8">
            Oppure prenota direttamente
          </h2>
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
            <div>
              <Calendar size={36} className="mx-auto mb-4 text-gray-300" />
              <p className="font-medium text-gray-500">Calendario disponibile a breve</p>
              <p className="mt-1 text-sm text-gray-400">
                Nel frattempo usa il form qui sopra — rispondo entro 48 ore.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CTA FINALE ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Non hai trovato quello che cercavi?
          </h2>
          <p className="mt-4 mb-10 max-w-lg mx-auto text-lg text-primary-200">
            Scrivimi comunque. La cosa peggiore che può succedere è che ti rispondo.
          </p>
          <Button asChild variant="accent" size="lg" className="px-8 text-base">
            <a
              href="https://linkedin.com/in/omarbortolato"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
              Scrivimi su LinkedIn
              <ArrowRight size={18} />
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
