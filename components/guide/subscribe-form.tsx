"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscribeFormProps {
  guide: string;
  overrideDownloadUrl?: string;
  /** Punto esatto di raccolta: serve a distinguere la stessa email presa da
   *  landing diverse, e a poter agganciare in futuro sequenze diverse. */
  source?: string;
}

export function SubscribeForm({ guide, overrideDownloadUrl, source }: SubscribeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const isBook = guide.startsWith("spremuta-");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          guide,
          source: source ?? "sito",
          // consenso al marketing: separato dalla richiesta del file e mai preselezionato
          marketingConsent: consent,
          downloadUrl: overrideDownloadUrl ?? undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Qualcosa è andato storto. Riprova.");
        return;
      }

      setDownloadUrl(overrideDownloadUrl ?? data.downloadUrl ?? null);
      setEmailSent(data.emailSent === true);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Errore di rete. Controlla la connessione e riprova.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Download size={24} className="text-green-600" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {name ? `Grazie ${name}!` : "Perfetto, ci siamo!"}
        </h3>
        <p className="mb-6 text-gray-600">
          {emailSent
            ? isBook
              ? "Ti abbiamo inviato un'email con il link. Puoi anche scaricarla direttamente qui sotto."
              : "Ti abbiamo inviato un'email con il link di download. Puoi anche scaricare la guida direttamente qui sotto."
            : isBook
              ? "La tua Spremuta è pronta."
              : "Scarica la guida qui sotto. Il tuo posto è riservato."}
        </p>
        {downloadUrl && (
          <Button asChild variant="default" size="lg" className="px-8">
            <a href={downloadUrl} download>
              {isBook ? "🍊 Scarica la Spremuta" : "Scarica la guida"}
              <Download size={16} />
            </a>
          </Button>
        )}
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/20";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Il tuo nome (opzionale)"
          className={inputClass}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          required
          className={inputClass}
        />
      </div>

      <Button
        type="submit"
        disabled={status === "loading"}
        variant="default"
        size="lg"
        className="w-full sm:w-auto sm:self-start"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Invio...
          </>
        ) : isBook ? (
          <>
            🍊 Scarica la Spremuta gratis
            <ArrowRight size={16} />
          </>
        ) : (
          <>
            Scarica la guida gratuita
            <ArrowRight size={16} />
          </>
        )}
      </Button>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      {/* Consenso separato e facoltativo: il file arriva comunque.
          Art. 6 par. 1 lett. a GDPR — mai preselezionato, mai in bundle col download. */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-gray-300 text-primary-800 focus:ring-primary-800/30"
        />
        <span className="text-xs leading-relaxed text-gray-500">
          Voglio ricevere anche gli aggiornamenti su nuove guide e contenuti.{" "}
          <span className="text-gray-400">
            Facoltativo: senza questa spunta ricevi comunque il file e nient&apos;altro.
          </span>
        </span>
      </label>

      <p className="text-xs leading-relaxed text-gray-400">
        Uso la tua email solo per mandarti quello che hai chiesto. Puoi cancellarti quando vuoi.
        Dettagli su come tratto i dati nella{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-primary-800">
          privacy
        </Link>
        .
      </p>
    </form>
  );
}
