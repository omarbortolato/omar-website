import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Lightbulb, Wrench, Target, Star, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBook, getBooks } from "@/lib/books";
import { SubscribeForm } from "@/components/guide/subscribe-form";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const books = await getBooks();
  return books
    .filter((b) => b.pdfUrl)
    .map((b) => ({ slug: b.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const book = await getBook(params.slug);
  if (!book) return {};
  return {
    title: `Spremuta: ${book.title} — Omar Bortolato`,
    description: `La mia rielaborazione di "${book.title}" di ${book.author}. Cosa ho capito, applicato e trasformato in azione. Scaricabile gratis.`,
  };
}

// ─── Sezioni teaser (statiche — struttura di ogni Spremuta) ──────────────────

const SECTIONS = [
  { icon: Lightbulb, label: "L'idea principale" },
  { icon: BookOpen,  label: "Il percorso" },
  { icon: Wrench,    label: "Cosa ho applicato" },
  { icon: Target,    label: "I 3 takeaway" },
  { icon: Star,      label: "Vale la pena leggerlo?" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SpremutaPage({
  params,
}: {
  params: { slug: string };
}) {
  const book = await getBook(params.slug);
  if (!book || !book.pdfUrl) notFound();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
          {/* Breadcrumb */}
          <Link
            href="/libri"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-800 transition-colors"
          >
            <ArrowLeft size={14} />
            Tutti i libri
          </Link>

          <Badge variant="accent" className="mb-4 text-xs">Spremuta</Badge>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl leading-tight">
            {book.title}
          </h1>
          <p className="mt-2 text-lg text-gray-500">{book.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {book.category && (
              <span className="rounded-full border border-primary-800/15 bg-primary-800/5 px-3 py-1 text-sm font-medium text-primary-800">
                {book.category}
              </span>
            )}
            {book.year && (
              <span className="text-sm text-gray-400">Letto nel {book.year}</span>
            )}
            {book.rating === "😍 TOP" && (
              <span className="rounded-full border border-accent-500/30 bg-accent-500/10 px-3 py-1 text-sm font-semibold text-accent-600">
                😍 TOP
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── TEASER SEZIONI ───────────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-gray-400">
            Cosa trovi nella Spremuta
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
            {SECTIONS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary-800/10">
                  <Icon size={15} className="text-primary-800" />
                </div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL GATE ───────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-3xl px-4 py-14 md:py-20">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Scarica la Spremuta gratis
          </h2>
          <p className="mt-2 text-gray-500">
            Inserisci la tua email e ti invio il PDF direttamente.
            Zero spam — solo risorse utili quando le pubblico.
          </p>
        </div>

        <SubscribeForm
          guide={`spremuta-${book.slug}`}
          overrideDownloadUrl={book.pdfUrl}
        />
      </section>
    </>
  );
}
