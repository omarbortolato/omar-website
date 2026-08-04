import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  GitBranch,
  ShieldCheck,
  Layers,
  Workflow,
  Coins,
  Scale,
} from "lucide-react";
import { SubscribeForm } from "@/components/guide/subscribe-form";
import { AiDisclosure } from "@/components/ui/ai-disclosure";

export const metadata: Metadata = {
  title: "Governare uno swarm di agenti — Guida gratuita",
  description:
    "Le decisioni architetturali che contano prima del codice: rank e DAG di delega, control-plane, gating, ciclo di una richiesta, agenti contro capacità, controllo della spesa. 41 pagine, con fonti e trade-off dichiarati.",
};

const learnings = [
  {
    icon: GitBranch,
    title: "Perché i cicli diventano impossibili",
    desc: "Un ordine stretto sui livelli di delega rende un ciclo non rappresentabile, invece che da rilevare a runtime. È lo stesso meccanismo con cui si previene il deadlock ordinando le risorse.",
  },
  {
    icon: ShieldCheck,
    title: "Cosa possiede il punto di ingresso",
    desc: "Le quattro responsabilità che non sono delegabili al singolo agente, e le tre cose che nessun agente deve avere dentro: credenziali, accesso diretto al provider, giudizio su chi può chiamarlo.",
  },
  {
    icon: Layers,
    title: "Il contratto minimo di un agente",
    desc: "Perché un agente è una cartella e non una riga in un registro, cosa è obbligatorio, cosa viene dedotto, e perché la persona sta scritta in un posto solo.",
  },
  {
    icon: Workflow,
    title: "Il gating e il ciclo di una richiesta",
    desc: "Tre esiti e nessun quarto. I sei controlli in sequenza, il ragionamento dietro l'ordine, e perché l'autorizzazione sta prima della cache.",
  },
  {
    icon: Coins,
    title: "La spesa come vincolo di governance",
    desc: "Due livelli di cache, cosa entra nella chiave e perché, e la regola che nessuno dei due può violare: un risultato dalla cache costa zero, ma un agente bloccato resta bloccato.",
  },
  {
    icon: Scale,
    title: "Cosa costa scegliere così",
    desc: "Un capitolo intero sui limiti, con riportato per intero l'argomento pubblico di chi sostiene che i sistemi multi-agente andrebbero evitati.",
  },
];

const forWho = [
  "Hai più di un agente in produzione e non hai ancora deciso come li tieni insieme",
  "Stai valutando se dividere un sistema in più agenti, o se è una complicazione inutile",
  "Devi spiegare a qualcuno perché una certa scelta architetturale non si tocca",
  "Cerchi criteri applicabili al tuo stack, non un tutorial su un framework",
];

export default function GuidaSwarmPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/guide" className="hover:text-primary-800 transition-colors">Guide</Link>
            <span>/</span>
            <span className="text-gray-600 truncate max-w-[200px]">Governare uno swarm di agenti</span>
          </nav>

          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14">
            <div className="flex-1">
              <span className="mb-4 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Guida gratuita · 41 pagine
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
                Governare uno swarm di agenti
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                Le decisioni architetturali che contano prima del codice.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Perché un ordine sui livelli di delega rende i cicli impossibili invece che da controllare",
                  "Cosa deve possedere il punto di ingresso, e cosa non deve possedere nessun agente",
                  "Cosa costa questa architettura, e quando conviene sceglierne un'altra",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary-800/10">
                      <Check size={11} className="text-primary-800" />
                    </div>
                    <span className="text-[15px] leading-relaxed text-gray-700">{b}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-7 rounded-xl border border-primary-800/15 bg-primary-800/5 px-4 py-3 text-sm leading-relaxed text-primary-800">
                Ogni sezione dice qual è il problema, quale decisione lo risolve e{" "}
                <strong>cosa costa quella decisione</strong>. Il terzo punto non è opzionale: senza,
                sarebbe una brochure.
              </p>
            </div>

            {/* Anteprima */}
            <div className="flex-shrink-0">
              <div className="relative w-[260px]">
                <div className="absolute -right-3 top-3 hidden w-[240px] rotate-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:block">
                  <Image
                    src="/images/guide/anteprima-2.png"
                    alt="Anteprima di una pagina interna della guida"
                    width={794}
                    height={1123}
                    className="h-auto w-full"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
                  <Image
                    src="/images/guide/anteprima-1.png"
                    alt="Copertina della guida Governare uno swarm di agenti"
                    width={794}
                    height={1123}
                    className="h-auto w-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cosa trovi ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
          Cosa trovi nella guida
        </h2>
        <p className="mb-10 text-gray-500">
          Undici capitoli, nove infografiche, diciannove fonti con data di consultazione.
        </p>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {learnings.map(({ icon: Icon, title, desc }) => (
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

      {/* ── Per chi è ────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-14 md:py-20">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Per chi è questa guida
          </h2>
          <p className="mb-8 text-gray-500">
            Serve sapere cos&apos;è un&apos;API. Non serve saper programmare.
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {forWho.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
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

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-4xl px-4 py-14 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl">
            Scarica la guida gratis
          </h2>
          <p className="mb-8 text-gray-500">
            Inserisci la tua email e ricevi il link di download immediato.
          </p>
          <SubscribeForm
            guide="governare-swarm-agenti"
            source="landing-guida-swarm"
            overrideDownloadUrl="https://www.omarbortolato.it/downloads/governare-swarm-agenti.pdf"
          />

          <div className="mt-10">
            <AiDisclosure
              variant="card"
              text="Ricerca, struttura e stesura di questa guida sono state assistite da sistemi di intelligenza artificiale. Le fonti citate sono state verificate una a una e riportano la data di consultazione. La responsabilità editoriale è di Omar Bortolato."
            />
          </div>
        </div>
      </section>

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
