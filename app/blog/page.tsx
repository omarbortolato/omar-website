import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description: "Pensieri, guide e riflessioni su sviluppo, design e prodotto.",
};

const posts = [
  {
    slug: "primo-articolo",
    title: "Come strutturare un progetto Next.js scalabile",
    excerpt: "Una guida pratica per organizzare le cartelle, i componenti e la logica in un progetto Next.js che cresce nel tempo.",
    date: "2024-03-01",
    tags: ["Next.js", "Architettura"],
    readTime: "5 min",
  },
  {
    slug: "secondo-articolo",
    title: "Design system con Tailwind CSS e shadcn/ui",
    excerpt: "Come costruire un design system coerente e mantenibile usando Tailwind CSS e i componenti di shadcn/ui.",
    date: "2024-02-15",
    tags: ["Design System", "Tailwind"],
    readTime: "7 min",
  },
];

export default function BlogPage() {
  return (
    <section className="container mx-auto max-w-3xl px-4 py-20">
      <Badge variant="accent" className="mb-4">Blog</Badge>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">Articoli</h1>
      <p className="text-gray-500 mb-12">
        Pensieri su sviluppo, design e tutto quello che trovo interessante.
      </p>

      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group border-b border-border/40 pb-8 last:border-0">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-xl font-semibold text-gray-900 group-hover:text-primary-800 transition-colors mb-2">
                {post.title}
              </h2>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{new Date(post.date).toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })}</span>
              <div className="flex items-center gap-1">
                <span>{post.readTime} di lettura</span>
                <Link href={`/blog/${post.slug}`} className="ml-2 flex items-center gap-1 text-primary-800 hover:text-primary-700 font-medium">
                  Leggi <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
