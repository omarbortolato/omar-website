import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "Guide Pratiche AI — Omar Bortolato",
  description:
    "Risorse gratuite e premium per costruire con l'AI. Guide step-by-step da chi lo fa davvero.",
};

export default function GuidePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/40">
        <div className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
              Guide Pratiche
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-500">
              Risorse gratuite e premium per chi vuole costruire con l&apos;AI.
              Zero teoria, solo risultati.
            </p>
          </div>
        </div>
      </section>

      {/* ── Grid guide ───────────────────────────────────────────────────── */}
      <section className="container mx-auto max-w-5xl px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <div
              key={guide.slug}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Visual placeholder */}
              <div className="mb-5 flex h-40 items-center justify-center rounded-xl bg-gradient-to-br from-primary-800/8 to-indigo-100/60">
                <div className="relative">
                  <div className="absolute -right-2 -top-2 h-20 w-14 rounded-lg bg-primary-800/10 border border-primary-800/15" />
                  <div className="absolute -right-1 -top-1 h-20 w-14 rounded-lg bg-primary-800/15 border border-primary-800/20" />
                  <div className="relative h-20 w-14 rounded-lg bg-white shadow-md border border-gray-200 flex flex-col p-2 gap-1">
                    <div className="h-1.5 w-6 rounded bg-accent-500" />
                    <div className="h-1 w-full rounded bg-gray-100" />
                    <div className="h-1 w-4/5 rounded bg-gray-100" />
                    <div className="h-1 w-full rounded bg-gray-50 mt-1" />
                    <div className="h-1 w-full rounded bg-gray-50" />
                    <div className="h-1 w-3/4 rounded bg-gray-50" />
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="mb-3">
                {guide.type === "free" ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    <BookOpen size={10} />
                    Gratuita
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <Lock size={10} />
                    Premium
                  </span>
                )}
              </div>

              <h2 className="mb-2 text-xl font-bold text-gray-900 leading-snug">
                {guide.title}
              </h2>
              <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-500 line-clamp-2">
                {guide.description}
              </p>

              {guide.available ? (
                <Button asChild variant="default" className="w-full sm:w-auto">
                  <Link href={`/guide/${guide.slug}`}>
                    {guide.ctaText}
                    <ArrowRight size={15} />
                  </Link>
                </Button>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-400">
                  <Lock size={13} />
                  In arrivo
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
