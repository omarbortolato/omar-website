import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { getBooks } from "@/lib/books";
import { BooksGrid } from "./BooksGrid";

export const metadata: Metadata = {
  title: "Libri — Omar Bortolato | Spremute di lettura",
  description:
    "Non riassunti. Rielaborazioni. Quello che ho capito, applicato e trasformato in azione da ogni libro che leggo. Scaricabili gratis.",
};

export const revalidate = 3600;

export default async function LibriPage() {
  const books = await getBooks();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <Badge variant="accent" className="mb-4 text-xs">Libri</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            🍊 Spremute di libri.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-gray-600">
            Prendo i libri migliori che ho letto, li spreme fino all&apos;ultima goccia
            e ti do quello che conta davvero — non il riassunto, ma la rielaborazione.
            Cosa ho capito, cosa ho applicato, cosa cambia se ci pensi nel 2026.
            Gratis, con la tua email.
          </p>
        </div>
      </section>

      {/* ── LIBRI ─────────────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {books.length === 0 ? (
          <p className="text-gray-500">Nessun libro trovato. Torna presto.</p>
        ) : (
          <BooksGrid books={books} />
        )}
      </section>
    </>
  );
}
