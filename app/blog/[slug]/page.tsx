import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoverImage } from "@/components/ui/cover-image";
import { AiDisclosure } from "@/components/ui/ai-disclosure";
import { getBlogPost, getBlogPosts } from "@/lib/notion";
import { guidePromoForPost } from "@/lib/guides";

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  if (!post) return { title: "Articolo non trovato" };
  return {
    title: post.metaTitle,
    description: post.metaDescription,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const LOCAL_IMAGE_EXTENSIONS = /\.(jpg|jpeg|png|webp|gif)$/i;

function resolveCoverImage(value: string | null): string | null {
  if (!value || value.trim() === "") return null;
  const v = value.trim();
  if (v.startsWith("http")) {
    // External URL: accept as-is (remotePatterns in next.config allows all https)
    return v;
  }
  // Local filename: must have a valid image extension
  if (!LOCAL_IMAGE_EXTENSIONS.test(v)) return null;
  return `/post-images/${v}`;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage(
  { params }: { params: { slug: string } }
) {
  const post = await getBlogPost(params.slug);
  if (!post) notFound();

  const hasContent = post.content && post.content.trim().length > 0;
  const coverSrc = resolveCoverImage(post.coverImage ?? null);
  const guidePromo = guidePromoForPost(post.slug);

  return (
    <>
      <article className="bg-white">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
          <div className="container mx-auto max-w-3xl px-4 py-14 md:py-20">

            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-primary-800 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
            </nav>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-1.5">
                <Tag size={12} className="text-gray-400" />
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

            <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-tight md:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            {post.abstract && (
              <p className="mt-4 text-lg leading-relaxed text-gray-500">
                {post.abstract}
              </p>
            )}

            {post.publishedDate && (
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-400">
                <Calendar size={14} />
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              </div>
            )}
          </div>
        </header>

        {/* ── Cover Image ────────────────────────────────────────────────── */}
        {coverSrc && (
          <div className="container mx-auto max-w-3xl px-4 pt-8">
            <CoverImage src={coverSrc} alt={post.title} />
          </div>
        )}

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className="container mx-auto max-w-3xl px-4 py-12 md:py-16">
          {hasContent ? (
            <div
              className="prose prose-slate prose-lg max-w-none
                prose-headings:font-bold prose-headings:text-gray-900
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-a:text-primary-800 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-gray-900
                prose-li:text-gray-600
                prose-h2:mt-10 prose-h2:mb-4
                prose-h3:mt-8 prose-h3:mb-3"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
              <p className="text-gray-400">Il contenuto completo arriverà presto.</p>
              <p className="mt-2 text-sm text-gray-400">{post.abstract}</p>
            </div>
          )}

          {/* Guida collegata all'articolo, se ce n'è una */}
          {guidePromo && (
            <div className="mt-14 rounded-2xl border border-primary-800/15 bg-primary-800/5 p-6 md:p-8">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                <BookOpen size={10} />
                Guida gratuita
              </span>
              <h2 className="mt-4 text-xl font-bold leading-snug text-gray-900 md:text-2xl">
                {guidePromo.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-600">{guidePromo.body}</p>
              <Button asChild variant="default" size="lg" className="mt-6">
                <Link href={`/guide/${guidePromo.slug}`}>
                  {guidePromo.cta}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <p className="mt-3 text-xs text-gray-400">{guidePromo.micro}</p>
            </div>
          )}

          {/* Informativa AI — art. 50 par. 4 AI Act */}
          <div className="mt-10">
            <AiDisclosure variant="card" />
          </div>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-primary-800"
            >
              <ArrowLeft size={14} />
              Tutti gli articoli
            </Link>
          </div>
        </div>
      </article>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary-800 to-primary-900">
        <div className="container mx-auto max-w-5xl px-4 py-16 text-center md:py-20">
          <h2 className="text-2xl font-bold text-white md:text-3xl">
            Vuoi applicare queste idee al tuo business?
          </h2>
          <p className="mt-3 mb-8 text-primary-200">
            Consulenze, partnership, co-building. Parliamone.
          </p>
          <Button asChild variant="accent" size="lg" className="px-8">
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
