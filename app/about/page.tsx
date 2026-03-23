import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Rocket,
  TrendingUp,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Chi sono — Omar Bortolato | AI Practitioner & Manager",
  description:
    "18 anni nell'IT, imprenditore seriale, CAIO. Scopri la mia storia e come l'AI ha trasformato il mio modo di lavorare e fare business.",
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const roles = [
  {
    icon: Building2,
    title: "CAIO @ Aspiag ICS",
    description:
      "Responsabile dei team AI e BI in una delle più grandi aziende della GDO. Porto innovazione di processo e mentalità: prototipazione veloce, cicli lean, coinvolgimento del business fin dal giorno zero.",
  },
  {
    icon: Rocket,
    title: "Co-founder @ Azoa Seed",
    description:
      "Startup factory AI-native. La visione: potenziare individui e piccoli team ad alto potenziale attraverso l'AI, trasformandoli in unità produttive autonome e ad alta leva cognitiva.",
  },
  {
    icon: TrendingUp,
    title: "Imprenditore AI-First",
    description:
      "Phoenix RE Capital, Herbalife ecommerce (6 paesi), Fastlien, FastLand, DocBit. Ogni business è un laboratorio dove l'AI viene testata in produzione, non in teoria.",
  },
  {
    icon: Mic2,
    title: "Speaker & Practitioner",
    description:
      "Main stage AI Week Milano 2026. Condivido su LinkedIn quello che imparo ogni giorno — senza filtri, senza jargon. AI pratica per chi vuole fare, non solo sapere.",
  },
];

const personalItems = [
  { emoji: "📍", text: "Padova, Italia" },
  { emoji: "👨‍👦", text: "Papà entusiasta" },
  { emoji: "🏐", text: "Pallavolo e sport" },
  { emoji: "🌍", text: "Viaggiatore curioso" },
  { emoji: "📚", text: "Lettore seriale — mattina saggistica, sera narrativa" },
  { emoji: "☀️", text: "Ottimista cronico" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <>
      {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <div className="flex flex-col-reverse md:flex-row md:items-center gap-10 md:gap-14">

            {/* ── Text ── */}
            <div className="flex-1 text-center md:text-left">
              <Badge variant="accent" className="mb-4 text-xs">Chi sono</Badge>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight md:text-5xl lg:text-6xl">
                Non sono un guru.{" "}
                <span className="text-primary-800">Sono uno che fa.</span>
              </h1>
              <p className="mt-5 max-w-xl mx-auto md:mx-0 text-lg leading-relaxed text-gray-600">
                18 anni nell&apos;IT, imprenditore seriale, CAIO in una multinazionale.
                L&apos;AI non l&apos;ho studiata sui libri — l&apos;ho testata sui miei business,
                ogni giorno, fin dal primo ChatGPT.
              </p>
            </div>

            {/* ── Hero image ── */}
            <div className="relative mx-auto md:mx-0 flex-shrink-0
                            w-full max-w-[280px] h-[340px]
                            md:w-[320px] md:h-[400px]
                            lg:w-[360px] lg:h-[440px]
                            rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/omar-speaking2.jpg"
                alt="Omar Bortolato — speaker e AI Practitioner"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 360px"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. LA MIA STORIA ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4">

          {/* Atto 1 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-20">
            Il DNA del risolutore
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed mb-12">
            <p>Ho sempre cercato modi migliori per fare le cose.</p>
            <p>
              Ancora prima dell&apos;AI, passavo le sere a costruire automatismi con Zapier, IFTTT,
              formule infinite su Google Sheets. Ho creato un P&amp;L automatico per la mia LLC
              americana usando solo Notion e fogli di calcolo. Non perché fossi un programmatore —
              non lo sono mai stato — ma perché odiavo ripetere le stesse operazioni due volte.
            </p>
            <p>
              Per 18 anni ho lavorato nell&apos;IT: prima nella consulenza come Project Manager, poi
              come BI Manager e infine AI Manager in una grande azienda della GDO. Ma la verità è
              che la mia formazione più importante è sempre avvenuta fuori dall&apos;ufficio — nelle
              mie side gigs, nei miei business, nei miei esperimenti.
            </p>
            <p>
              Siti e-commerce, investimenti immobiliari negli USA, software per nicchie specifiche.
              Ogni progetto era un laboratorio per testare processi, automazioni, e modi nuovi di
              creare valore.
            </p>
          </div>

          {/* Atto 2 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-20">
            Quando l&apos;AI ha connesso tutto
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed mb-12">
            <p>
              Quando è arrivato il primo ChatGPT, all&apos;inizio del 2023, ho sentito tutti i
              pezzi del puzzle connettersi.
            </p>
            <p>
              I miei studi in statistica. La passione per l&apos;innovazione. La mia incapacità di
              programmare ma la visione architetturale e di processo. La capacità di capire i
              problemi e pensare soluzioni non convenzionali. Improvvisamente, tutto questo si
              poteva accelerare.
            </p>
            <p>
              Non ho aspettato che qualcuno mi dicesse cosa fare. Sono entrato nel team GenAI Lab
              di gruppo, ho iniziato a collaborare con colleghi internazionali a Salisburgo e
              Seattle. Ma soprattutto, ho iniziato a testare l&apos;AI sui miei business — libero
              di sperimentare senza i vincoli del lavoro tradizionale.
            </p>
            <p>
              L&apos;ho usata come consigliere, come CTO, come marketing manager, come CFO.
              L&apos;ho sfidata, l&apos;ho fatta sbagliare, ho imparato cosa funziona davvero e
              cosa è solo hype.
            </p>
            <p>
              I risultati parlano da soli: un e-commerce in 6 paesi con +2000% di revenue e da
              2.000 a 20.000 visitatori mensili. Un fondo immobiliare USA avviato e gestito con
              l&apos;AI al posto di un team di avvocati. Un nuovo software (FastLand.co) creato in
              un solo giorno. E la certezza che siamo solo all&apos;inizio.
            </p>
          </div>

          {/* Atto 3 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4 scroll-mt-20">
            I fallimenti che mi hanno formato
          </h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Non tutto è andato liscio. Ho provato l&apos;affiliate marketing: corsi, siti, tempo
              e soldi investiti. Poi il dropshipping dalla Cina agli USA. Poi le opzioni americane —
              sembravano perfette per la mia formazione statistica. Nessuno di questi esperimenti ha
              funzionato come speravo.
            </p>
            <p>
              Ma ogni fallimento mi ha insegnato qualcosa di fondamentale: il valore del focus.
              L&apos;importanza di misurare il tempo come un costo reale — a volte ce lo scordiamo.
              E soprattutto, che le persone migliori le incontri proprio mentre sbagli. Alcuni dei
              miei soci attuali li ho conosciuti in quei periodi.
            </p>
            <p>
              Fallire senza farsi male è il modo migliore per progredire, aprire la mente e
              accedere a un mondo di opportunità.
            </p>
          </div>

        </div>
      </section>

      {/* ── 3. COSA FACCIO OGGI ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Oggi</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-10">
            Cosa faccio oggi
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {roles.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-primary-800/10">
                  <Icon size={20} className="text-primary-800" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. IL MIO "PERCHÉ" ───────────────────────────────────────────────── */}
      <section className="bg-blue-50/50 py-16 md:py-24">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <Badge variant="accent" className="mb-6 text-xs">Il mio perché</Badge>
          <div className="space-y-5 text-lg leading-relaxed text-gray-700">
            <p>Sono un ottimista. Credo che la vita vada vissuta al 110%.</p>
            <p>
              Credo che l&apos;innovazione ci darà più tempo per goderci la natura, la famiglia,
              gli amici. Per creare cose belle. Un vero Rinascimento digitale.
            </p>
            <p>
              Non sono un workaholic. Credo che il vero talento sia gestire il proprio tempo
              massimizzando il risultato. L&apos;AI è lo strumento perfetto per questo.
            </p>
            <p className="font-medium text-gray-900">
              Vorrei condividere questa mentalità per aiutare le persone — specialmente i giovani —
              a costruire un futuro migliore.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. TOCCO PERSONALE ───────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          <Badge variant="accent" className="mb-3 text-xs">Dietro le quinte</Badge>
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl mb-10">
            Dietro le quinte
          </h2>

          <div className="flex flex-wrap gap-3">
            {personalItems.map(({ emoji, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-700"
              >
                <span>{emoji}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Speaking photo */}
          <div className="mt-12 relative w-full h-56 md:h-72 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src="/images/omar-speaking3.jpg"
              alt="Omar Bortolato sul palco"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 960px"
            />
          </div>
        </div>
      </section>

      {/* ── 6. CTA FINALE ────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Vuoi parlare di AI pratica?
          </h2>
          <p className="mt-4 mb-10 max-w-lg mx-auto text-lg text-primary-200">
            Consulenze, speaking, partnership. Lavoriamo insieme su progetti concreti.
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
