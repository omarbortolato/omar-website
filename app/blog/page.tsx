import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/lib/notion";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Blog — Omar Bortolato | AI, Automazione, Imprenditoria",
  description:
    "Riflessioni, esperimenti e casi reali su AI, automazione e imprenditoria. Idee che diventano pratica.",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function truncate(str: string, max = 160): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-20 text-center">
      <p className="text-lg font-medium text-gray-400">Nessun articolo pubblicato.</p>
      <p className="mt-2 text-sm text-gray-400">
        I prossimi contenuti arriveranno presto — seguimi su LinkedIn per non perderli.
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
          <Badge variant="accent" className="mb-4 text-xs">Blog</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            Idee che diventano pratica.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-gray-600">
            Riflessioni, esperimenti e casi reali su AI, automazione e imprenditoria.
          </p>
        </div>
      </section>

      {/* ── ARTICOLI ─────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20">
        <div className="container mx-auto max-w-5xl px-4">
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-primary-800/15 bg-primary-800/5 px-2.5 py-0.5 text-xs font-medium text-primary-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Title */}
                  <Link href={`/blog/${post.slug}`} className="flex-1">
                    <h2 className="mb-2 text-lg font-bold text-gray-900 leading-snug group-hover:text-primary-800 transition-colors">
                      {post.title}
                    </h2>
                    {post.abstract && (
                      <p className="text-sm leading-relaxed text-gray-500">
                        {truncate(post.abstract)}
                      </p>
                    )}
                  </Link>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between">
                    {post.publishedDate && (
                      <span className="text-xs text-gray-400">
                        {formatDate(post.publishedDate)}
                      </span>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary-800 transition-colors hover:text-primary-700"
                    >
                      Leggi
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINALE ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-20 text-center md:py-28">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Vuoi applicare queste idee al tuo business?
          </h2>
          <p className="mt-4 mb-10 max-w-lg mx-auto text-lg text-primary-200">
            Consulenze, partnership, co-building. Parliamone.
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
