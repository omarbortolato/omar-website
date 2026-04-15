"use client";

import { useState } from "react";
import { ArrowRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscribeFormProps {
  guide: string;
}

export function SubscribeForm({ guide }: SubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, guide }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Qualcosa è andato storto. Riprova.");
        return;
      }

      setDownloadUrl(data.downloadUrl ?? null);
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
        <h3 className="mb-2 text-xl font-bold text-gray-900">Perfetto, ci siamo!</h3>
        <p className="mb-6 text-gray-600">
          Ti abbiamo inviato un&apos;email con il link di download.
          Puoi anche scaricare la guida direttamente qui sotto.
        </p>
        {downloadUrl && (
          <Button asChild variant="default" size="lg" className="px-8">
            <a href={downloadUrl} download>
              Scarica la guida
              <Download size={16} />
            </a>
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="La tua email"
          required
          className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/20"
        />
        <Button
          type="submit"
          disabled={status === "loading"}
          variant="default"
          size="lg"
          className="whitespace-nowrap"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Invio...
            </>
          ) : (
            <>
              Scarica la guida gratuita
              <ArrowRight size={16} />
            </>
          )}
        </Button>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <p className="text-xs text-gray-400">
        Zero spam. Solo risorse utili. Puoi cancellarti quando vuoi.
      </p>
    </form>
  );
}
