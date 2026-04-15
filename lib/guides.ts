export interface Guide {
  slug: string;
  title: string;
  description: string;
  type: "free" | "premium";
  image?: string;
  ctaText: string;
  available: boolean;
}

export const guides: Guide[] = [
  {
    slug: "come-ho-costruito-questo-sito",
    title: "Come ho costruito questo sito con Claude Code",
    description:
      "Da zero a sito professionale in 2 settimane, senza scrivere una riga di codice. Stack gratuito, processo documentato passo passo.",
    type: "free",
    ctaText: "Scarica gratis",
    available: true,
  },
];
