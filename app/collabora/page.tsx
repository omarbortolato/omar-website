import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Mic, Handshake, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/ContactForm";

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

          <ContactForm />
        </div>
      </section>

      {/* ── 4. CAL.COM PLACEHOLDER ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Calendario</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-8">
            Oppure prenota direttamente
          </h2>
          <iframe
            src="https://cal.eu/omarbortolato?embed=true"
            className="w-full rounded-2xl border border-gray-100"
            style={{ height: "700px" }}
            frameBorder="0"
            title="Prenota una call con Omar Bortolato"
          />
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
