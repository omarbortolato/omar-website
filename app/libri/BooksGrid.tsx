"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/books";

type Filter =
  | { type: "all" }
  | { type: "spremuta" }
  | { type: "category"; value: string }
  | { type: "rating"; value: string };

const RATINGS = ["😍 TOP", "🙂 buono"];
const DEFAULT_FILTER: Filter = { type: "rating", value: "😍 TOP" };

// Serializza/deserializza il filtro in un singolo query param "filtro" per
// far sì che il back/forward del browser e il refresh mantengano la selezione.
function filterToParam(f: Filter): string {
  if (f.type === "all") return "tutti";
  if (f.type === "spremuta") return "spremuta";
  if (f.type === "rating") return `voto:${f.value}`;
  return `categoria:${f.value}`;
}

function paramToFilter(param: string | null): Filter {
  if (!param) return DEFAULT_FILTER;
  if (param === "tutti") return { type: "all" };
  if (param === "spremuta") return { type: "spremuta" };
  if (param.startsWith("voto:")) return { type: "rating", value: param.slice(5) };
  if (param.startsWith("categoria:")) return { type: "category", value: param.slice(10) };
  return DEFAULT_FILTER;
}

export function BooksGrid({ books }: { books: Book[] }) {
  const categories = Array.from(
    new Set(books.map((b) => b.category).filter(Boolean))
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = paramToFilter(searchParams.get("filtro"));

  const setFilter = (f: Filter) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filtro", filterToParam(f));
    router.push(`/libri?${params.toString()}`, { scroll: false });
  };

  const filtered = books.filter((b) => {
    if (filter.type === "all") return true;
    if (filter.type === "spremuta") return !!b.pdfUrl;
    if (filter.type === "rating") return b.rating === filter.value;
    return b.category === filter.value;
  });

  const isActive = (f: Filter) => JSON.stringify(filter) === JSON.stringify(f);

  const pillClass = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
      active
        ? "border-primary-800 bg-primary-800 text-white"
        : "border-gray-200 bg-white text-gray-600 hover:border-primary-800/40 hover:text-primary-800"
    }`;

  return (
    <>
      {/* Filtri */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Voto</span>
          <button onClick={() => setFilter({ type: "all" })} className={pillClass(isActive({ type: "all" }))}>
            Tutti
          </button>
          <button onClick={() => setFilter({ type: "spremuta" })} className={pillClass(isActive({ type: "spremuta" }))}>
            🍊 Con Spremuta
          </button>
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() => setFilter({ type: "rating", value: rating })}
              className={pillClass(isActive({ type: "rating", value: rating }))}
            >
              {rating}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Genere</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter({ type: "category", value: cat })}
              className={pillClass(isActive({ type: "category", value: cat }))}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-500">Nessun libro in questa categoria.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} filterParam={filterToParam(filter)} />
          ))}
        </div>
      )}
    </>
  );
}

function BookCover({ book }: { book: Book }) {
  if (!book.coverImage) return null;

  const img = (
    <Image
      src={book.coverImage}
      alt={`Copertina di ${book.title}`}
      width={80}
      height={120}
      className="h-[120px] w-[80px] flex-shrink-0 rounded-lg border border-gray-100 object-cover shadow-sm"
    />
  );

  if (!book.amazonLink) return img;

  return (
    <a
      href={book.amazonLink}
      target="_blank"
      rel="noopener noreferrer"
      title={`Trova "${book.title}" su Amazon`}
    >
      {img}
    </a>
  );
}

function BookCard({ book, filterParam }: { book: Book; filterParam: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-1 gap-3">
          <BookCover book={book} />
          <div className="flex-1">
            <h2 className="text-lg font-bold leading-snug text-gray-900">
              {book.title}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">{book.author}</p>
          </div>
        </div>
        {book.rating && (
          <span className="flex-shrink-0 rounded-full border border-accent-500/30 bg-accent-500/10 px-2.5 py-1 text-xs font-semibold text-accent-600">
            {book.rating}
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {book.category && (
          <span className="rounded-full border border-primary-800/15 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800">
            {book.category}
          </span>
        )}
        {book.year && (
          <span className="text-xs text-gray-400">Letto nel {book.year}</span>
        )}
      </div>

      {/* Descrizione */}
      {book.description && (
        <p className="mb-5 text-sm leading-relaxed text-gray-500 line-clamp-3">
          {book.description}
        </p>
      )}

      {/* CTA */}
      <div className="mt-auto">
        {book.pdfUrl ? (
          <Button asChild size="sm" variant="default">
            <Link href={`/libri/${book.slug}?filtro=${encodeURIComponent(filterParam)}`} className="inline-flex items-center gap-1.5">
              🍊 Scarica Spremuta
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
