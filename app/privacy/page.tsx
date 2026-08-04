import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy — Omar Bortolato",
  description:
    "Quali dati raccoglie questo sito, perché, per quanto tempo, a chi vengono comunicati e come esercitare i tuoi diritti.",
};

const CONTACT_EMAIL = "omarbortolato@gmail.com";
const UPDATED = "4 agosto 2026";

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-3xl px-4 py-14 md:py-20">
          <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-600">Privacy</span>
          </nav>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl">
            Privacy
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-gray-500">
            Quali dati raccolgo, perché, per quanto tempo li tengo e come puoi farmeli cancellare.
            Informativa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679.
          </p>
          <p className="mt-4 text-sm text-gray-400">Ultimo aggiornamento: {UPDATED}</p>
        </div>
      </section>

      <section className="container mx-auto max-w-3xl px-4 py-14 md:py-16">
        <div
          className="prose prose-slate max-w-none
            prose-headings:font-bold prose-headings:text-gray-900
            prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-3
            prose-h3:text-base prose-h3:mt-6 prose-h3:mb-2
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-li:text-gray-600
            prose-a:text-primary-800 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900"
        >
          <h2>Chi tratta i tuoi dati</h2>
          <p>
            Il titolare del trattamento è <strong>Omar Bortolato</strong>, raggiungibile
            all&apos;indirizzo <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Non è
            designato un responsabile della protezione dei dati, perché non ricorrono i presupposti
            dell&apos;articolo 37 del Regolamento.
          </p>

          <h2>Quali dati raccolgo e perché</h2>

          <h3>Quando scarichi una guida o una Spremuta</h3>
          <p>
            Raccolgo il tuo <strong>indirizzo email</strong>, il <strong>nome</strong> se decidi di
            inserirlo, il <strong>contenuto richiesto</strong>, la <strong>pagina di provenienza</strong> e
            la <strong>data</strong>. Servono a mandarti il file che hai chiesto e a sapere quale
            contenuto è stato utile.
          </p>
          <p>
            La base giuridica è l&apos;esecuzione di una tua richiesta, ai sensi
            dell&apos;articolo 6, paragrafo 1, lettera b del Regolamento. Senza email non posso
            mandarti il file.
          </p>

          <h3>Se acconsenti agli aggiornamenti</h3>
          <p>
            Il modulo di download contiene una casella separata e facoltativa per ricevere
            aggiornamenti su nuovi contenuti. Se la spunti, conservo anche il fatto che hai dato il
            consenso e la data in cui l&apos;hai dato. La base giuridica in quel caso è il tuo
            consenso, ai sensi dell&apos;articolo 6, paragrafo 1, lettera a.
          </p>
          <p>
            Il consenso è facoltativo: se non lo dai, scarichi comunque il file e non ricevi
            nient&apos;altro. Puoi revocarlo quando vuoi, scrivendo a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> o usando il link di
            cancellazione presente in ogni comunicazione. La revoca non pregiudica la liceità del
            trattamento fatto prima.
          </p>

          <h3>Quando mi scrivi dal modulo contatti</h3>
          <p>
            Raccolgo <strong>nome</strong>, <strong>email</strong>, <strong>tipo di richiesta</strong> e{" "}
            <strong>messaggio</strong>. Servono solo a risponderti. Base giuridica: riscontro a una
            tua richiesta.
          </p>

          <h3>Quando prenoti una call</h3>
          <p>
            La prenotazione avviene tramite Cal.com, che raccoglie per mio conto i dati necessari a
            fissare l&apos;appuntamento: nome, email e orario scelto.
          </p>

          <h2>Cosa non faccio</h2>
          <ul>
            <li>Non uso cookie di profilazione né strumenti di tracciamento pubblicitario.</li>
            <li>Non vendo, cedo o scambio i tuoi dati con nessuno.</li>
            <li>Non prendo decisioni automatizzate che producano effetti giuridici su di te.</li>
            <li>Non uso i tuoi dati per addestrare modelli di intelligenza artificiale.</li>
          </ul>

          <h2>A chi vengono comunicati</h2>
          <p>
            Per far funzionare il sito mi appoggio a fornitori che trattano i dati per mio conto,
            come responsabili del trattamento:
          </p>
          <ul>
            <li><strong>Vercel</strong>, per l&apos;hosting del sito.</li>
            <li><strong>Notion</strong>, dove sono archiviati gli iscritti alle guide.</li>
            <li><strong>Resend</strong>, per l&apos;invio delle email.</li>
            <li><strong>Cal.com</strong>, per le prenotazioni delle call.</li>
          </ul>
          <p>
            Con ciascuno di loro il trattamento è regolato dalle condizioni contrattuali che
            accetto usando il servizio, che includono le clausole sul trattamento dei dati per conto
            del titolare previste dall&apos;articolo 28 del Regolamento.
          </p>
          <p>
            Alcuni di questi fornitori hanno sede negli Stati Uniti. Il trasferimento avviene sulla
            base delle garanzie previste dal capo V del Regolamento, in particolare le clausole
            contrattuali tipo adottate dalla Commissione europea o l&apos;adesione al quadro
            UE-USA sulla protezione dei dati.
          </p>

          <h2>Per quanto tempo li tengo</h2>
          <ul>
            <li>
              <strong>Richieste di download:</strong> finché sono utili a capire quali contenuti
              funzionano, e comunque non oltre 24 mesi dall&apos;ultimo contatto.
            </li>
            <li>
              <strong>Consenso agli aggiornamenti:</strong> fino a revoca. Se revochi, cancello
              l&apos;indirizzo e conservo solo la prova della revoca.
            </li>
            <li>
              <strong>Messaggi dal modulo contatti:</strong> per il tempo necessario a gestire la
              conversazione e le eventuali attività che ne derivano.
            </li>
          </ul>

          <h2>I tuoi diritti</h2>
          <p>
            Puoi chiedermi in qualsiasi momento di accedere ai tuoi dati, correggerli, cancellarli,
            limitarne il trattamento, riceverli in formato leggibile da una macchina, oppure opporti
            al trattamento. Sono gli articoli da 15 a 22 del Regolamento.
          </p>
          <p>
            Per esercitarli basta una email a{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Rispondo entro un mese. Non
            serve un modulo e non serve motivare la richiesta.
          </p>
          <p>
            Se ritieni che il trattamento violi il Regolamento puoi proporre reclamo al{" "}
            <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
              Garante per la protezione dei dati personali
            </a>
            .
          </p>

          <h2>Intelligenza artificiale</h2>
          <p>
            Questo sito pubblica contenuti prodotti con l&apos;assistenza di sistemi di AI, sempre
            sotto revisione umana. Non è un trattamento dei tuoi dati, ma è un&apos;informazione che
            ti serve per valutare quello che leggi:{" "}
            <Link href="/trasparenza-ai">trovi il dettaglio qui</Link>.
          </p>

          <h2>Modifiche</h2>
          <p>
            Se cambio il modo in cui tratto i dati aggiorno questa pagina e la data in cima. Le
            versioni precedenti sono ricostruibili dalla cronologia pubblica del repository del
            sito.
          </p>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition-colors hover:text-primary-800"
          >
            <ArrowLeft size={14} />
            Torna alla home
          </Link>
        </div>
      </section>
    </>
  );
}
