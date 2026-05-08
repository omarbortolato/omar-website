"use client";

import { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/books";

export function BooksGrid({ books }: { books: Book[] }) {
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );
  const [selected, setSelected] = useState("Tutti");

  const filtered =
    selected === "Tutti" ? books : books.filter((b) => b.category === selected);

  return (
    <>
      {/* Filtro categorie */}
      {categories.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["Tutti", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelected(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                selected === cat
                  ? "border-primary-800 bg-primary-800 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-primary-800/40 hover:text-primary-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Nessun libro in questa categoria.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex-1">
          <h2 className="text-lg font-bold leading-snug text-gray-900">
            {book.title}
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">{book.author}</p>
        </div>
        {book.rating === "😍 TOP" && (
          <span className="flex-shrink-0 rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-1 text-xs font-semibold text-accent-600">
            😍 TOP
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {book.category && (
          <span className="rounded-full border border-primary-800/15 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            {book.category}
          </span>
        )}
        {book.year && (
          <span className="text-xs text-gray-400">Letto nel {book.year}</span>
        )}
      </div>

      {/* CTA */}
      <div className="mt-auto">
        {book.pdfUrl ? (
          <Button asChild size="sm" variant="default">
            <Link href={`/libri/${book.slug}`} className="inline-flex items-center gap-1.5">
              Scarica Spremuta
              <Download size={14} />
            </Link>
          </Button>
        ) : (
          <p className="text-sm italic text-gray-400">Spremuta in arrivo</p>
        )}
      </div>
    </div>
  );
}
