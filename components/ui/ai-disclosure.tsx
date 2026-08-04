import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * Informativa sull'uso di AI nella produzione di un contenuto.
 *
 * Regolamento (UE) 2024/1689 (AI Act), art. 50 par. 4: chi pubblica testo generato o
 * manipolato da un sistema di AI per informare il pubblico su questioni di interesse
 * pubblico deve dichiararlo. L'obbligo non si applica quando il contenuto è stato
 * sottoposto a revisione umana e una persona ne assume la responsabilità editoriale:
 * qui siamo in quel caso, e lo dichiariamo comunque perché la trasparenza costa poco
 * e il beneficio di dirlo è maggiore del beneficio di tacerlo.
 *
 * L'articolo 50 si applica dal 2 agosto 2026.
 */

type Variant = "inline" | "card";

export function AiDisclosure({
  variant = "inline",
  text,
}: {
  variant?: Variant;
  text?: string;
}) {
  const body =
    text ??
    "Questo contenuto è stato prodotto con l'assistenza di sistemi di intelligenza artificiale e revisionato da Omar Bortolato, che ne assume la responsabilità editoriale.";

  if (variant === "card") {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
        <Sparkles size={14} className="mt-0.5 flex-shrink-0 text-gray-400" />
        <p className="text-xs leading-relaxed text-gray-500">
          {body}{" "}
          <Link
            href="/trasparenza-ai"
            className="font-medium text-gray-600 underline decoration-gray-300 underline-offset-2 hover:text-primary-800"
          >
            Come uso l&apos;AI su questo sito
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-400">
      <Sparkles size={12} className="mt-0.5 flex-shrink-0" />
      <span>
        {body}{" "}
        <Link
          href="/trasparenza-ai"
          className="underline decoration-gray-300 underline-offset-2 hover:text-primary-800"
        >
          Dettagli
        </Link>
        .
      </span>
    </p>
  );
}
