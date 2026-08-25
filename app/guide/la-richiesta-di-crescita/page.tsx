import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Coins,
  Lightbulb,
  Users,
  CalendarClock,
  FileSearch,
  MessageSquare,
} from "lucide-react";
import { SubscribeForm } from "@/components/guide/subscribe-form";
import { AiDisclosure } from "@/components/ui/ai-disclosure";

export const metadata: Metadata = {
  title: "La Richiesta di Crescita — Guida gratuita",
  description:
    "Il metodo in sei passi per costruire valore in azienda e farlo riconoscere: creare il bisogno, coinvolgere le persone giuste, preparare la richiesta con l'AI. 20 pagine, con cinque prompt pronti all'uso.",
};

const learnings = [
  {
    icon: Coins,
    title: "Prima il capitale, poi la richiesta",
    desc: "Perché la maggior parte delle richieste di aumento fallisce non per il valore della persona, ma perché arriva a mani vuote. Il principio del capitale di carriera applicato dentro un'azienda.",
  },
  {
    icon: Lightbulb,
    title: "Creare il bisogno che ancora non esiste",
    desc: "Nessuno ti promuove per un ruolo che non esiste. Come usare una fonte esterna e il contesto aziendale per far esistere il bisogno prima della richiesta.",
  },
  {
    icon: Users,
    title: "Le persone giuste, non le persone potenti",
    desc: "Perché un'idea portata al vertice troppo presto muore, e come si costruisce in orizzontale un progetto che ai dirigenti arriva da più direzioni contemporaneamente.",
  },
  {
    icon: CalendarClock,
    title: "Dove muore quasi tutto: il follow-up",
    desc: "L'entusiasmo ha una scadenza di due settimane. Le tre regole di un formato ricorrente che trasforma un evento in un track record misurabile.",
  },
  {
    icon: FileSearch,
    title: "Preparare il dossier con l'AI",
    desc: "Cosa dare in pasto al modello, come impostare la deep research sul benchmark retributivo, e l'errore più fatale: chiedere una cosa che il tuo capo non ha il potere di darti.",
  },
  {
    icon: MessageSquare,
    title: "La conversazione, e cosa fare se è no",
    desc: "L'ordine degli argomenti conta più del contenuto. E le tre cose da portare a casa prima di uscire dalla stanza, anche dopo un rifiuto secco.",
  },
];

const forWho = [
  "Hai ottenuto risultati che nessuno ha ancora messo a fuoco, e non sai come farli vedere",
  "Vuoi chiedere un aumento o un ruolo nuovo e non sai da dove si comincia",
  "Stai portando avanti un progetto che nessuno ti ha chiesto, e vuoi che diventi il tuo ruolo",
  "Usi l'AI per sbrigare task e sospetti che si possa usarla per qualcosa di più",
];

export default function GuidaRichiestaCrescitaPage() {
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
            <span className="text-gray-600 truncate max-w-[200px]">La Richiesta di Crescita</span>
          </nav>

          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-14">
            <div className="flex-1">
              <span className="mb-4 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                Guida gratuita · 20 pagine
              </span>
              <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
                La Richiesta di Crescita
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-gray-500">
                Come costruire valore reale in azienda e farlo riconoscere.
              </p>

              <ul className="mt-8 space-y-3">
                {[
                  "Perché chi performa bene e non chiede niente diventa invisibile, e cosa fare al riguardo",
                  "I cinque prompt che ho usato davvero, con i campi da compilare",
                  "La presentazione slide per slide, e l'ordine degli argomenti che decide l'esito",
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
                Ogni passo dice cosa fare, perché funziona e dove si rompe se lo fai nell&apos;ordine
                sbagliato. Il metodo è quello che ho seguito io:{" "}
                <strong>sei mesi di lavoro, non un trucco da riunione</strong>.
              </p>
            </div>

            {/* Anteprima */}
            <div className="flex-shrink-0">
              <div className="relative w-[260px]">
                <div className="absolute -right-3 top-3 hidden w-[240px] rotate-3 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg sm:block">
                  <Image
                    src="/images/guide/richiesta-crescita-anteprima-2.png"
                    alt="Anteprima di una pagina interna della guida"
                    width={794}
                    height={1123}
                    className="h-auto w-full"
                  />
                </div>
                <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
                  <Image
                    src="/images/guide/richiesta-crescita-anteprima-1.png"
                    alt="Copertina della guida La Richiesta di Crescita"
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
          Sei passi, cinque prompt completi, una checklist e un capitolo su cosa fare se la
          risposta è no.
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
            Non serve essere manager. Serve avere qualcosa da costruire.
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
            guide="la-richiesta-di-crescita"
            source="landing-guida-crescita"
            overrideDownloadUrl="https://www.omarbortolato.it/downloads/la-richiesta-di-crescita.pdf"
          />

          <div className="mt-10">
            <AiDisclosure variant="card" />
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
