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
    slug: "governare-swarm-agenti",
    title: "Governare uno swarm di agenti",
    description:
      "Le decisioni architetturali che contano prima del codice. 41 pagine su rank, DAG di delega, control-plane, gating e controllo della spesa, con le fonti e i trade-off dichiarati.",
    type: "free",
    ctaText: "Scarica gratis",
    available: true,
  },
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

/* ─── Promozione della guida in fondo agli articoli ──────────────────────────
   Mappa slug dell'articolo → blocco da mostrare a fine lettura. Sta qui e non
   su Notion perché il testo del richiamo dipende dalla guida, non dall'articolo:
   se cambia la guida si aggiorna un posto solo.                              */

export interface GuidePromo {
  slug: string;
  heading: string;
  body: string;
  cta: string;
  micro: string;
}

const SWARM_PROMO: GuidePromo = {
  slug: "governare-swarm-agenti",
  heading: "Governare uno swarm di agenti",
  body:
    "Se questo articolo ti ha lasciato la domanda «e adesso come li tengo insieme», la risposta lunga è in una guida di 41 pagine: i livelli di delega e perché rendono i cicli impossibili invece che da controllare, il punto unico da cui si entra, cosa si deduce e cosa si blocca all'ingresso, e un capitolo intero su cosa si paga scegliendo così.",
  cta: "Scarica la guida gratuita",
  micro: "PDF, 41 pagine, con fonti e date di consultazione. Basta l'email, niente spam.",
};

const PROMO_BY_POST: Record<string, GuidePromo> = {
  "da-utente-ad-architetto-costruire-la-piattaforma-prima-delle-idee": SWARM_PROMO,
  "come-ho-costruito-un-sistema-quasi-automatico-per-trasformare-unidea-in-un-articolo": SWARM_PROMO,
  "stiamo-costruendo-cose-bellissime-per-risolvere-il-problema-sbagliato": SWARM_PROMO,
};

export function guidePromoForPost(slug: string): GuidePromo | null {
  return PROMO_BY_POST[slug] ?? null;
}
