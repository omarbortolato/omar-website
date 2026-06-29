import type { Metadata } from "next";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { getBooks } from "@/lib/books";
import { BooksGrid } from "./BooksGrid";

export const metadata: Metadata = {
  title: "Libri — Omar Bortolato | Spremute di lettura",
  description:
    "Non riassunti. Rielaborazioni. Quello che ho capito, applicato e trasformato in azione da ogni libro che leggo. Scaricabili gratis.",
};

export const revalidate = 300;

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
          <p className="mt-5 text-lg leading-relaxed text-gray-600">
            Mi piace leggere. Soprattutto la mattina presto, quando la casa dorme ancora
            e ho il tempo di godermi un caffè in pace. Il problema è che il tempo è poco
            e sprecarlo con un libro sbagliato fa davvero male.
          </p>
          <p className="mt-3 text-lg leading-relaxed text-gray-600">
            Qui metto solo quelli che mi hanno colpito davvero. Quando riesco, ci faccio
            una Spremuta: non un riassunto, ma quello che ho portato a casa io — i concetti
            che ho applicato, le connessioni con l&apos;AI, le cose che avrei voluto sapere prima.
            Spero serva anche a te.
          </p>
        </div>
      </section>

      {/* ── LIBRI ─────────────────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        {books.length === 0 ? (
          <p className="text-gray-500">Nessun libro trovato. Torna presto.</p>
        ) : (
          <Suspense>
            <BooksGrid books={books} />
          </Suspense>
        )}
      </section>
    </>
  );
}
