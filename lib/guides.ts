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
  {
    slug: "claude-fable-5",
    title: "Claude Fable 5: la guida pratica",
    description:
      "Cosa è il primo modello Mythos-class, come si confronta con Haiku/Sonnet/Opus, quando usarlo e come sfruttarlo al massimo. Aggiornata giugno 2026.",
    type: "free",
    ctaText: "Leggi la guida",
    available: true,
  },
];
