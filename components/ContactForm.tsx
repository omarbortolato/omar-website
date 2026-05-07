"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [fields, setFields] = useState({
    nome: "",
    email: "",
    tipo: "",
    messaggio: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Qualcosa è andato storto. Riprova.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Errore di rete. Controlla la connessione e riprova.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10";

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-10 text-center">
        <CheckCircle size={40} className="mx-auto mb-4 text-green-500" />
        <h3 className="mb-2 text-xl font-bold text-gray-900">Messaggio inviato!</h3>
        <p className="text-gray-600">
          Grazie {fields.nome}, ti rispondo entro 48 ore.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-gray-700">
            Nome <span className="text-accent-500">*</span>
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            placeholder="Il tuo nome"
            value={fields.nome}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
            Email <span className="text-accent-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="tua@email.com"
            value={fields.email}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="tipo" className="mb-1.5 block text-sm font-medium text-gray-700">
          Tipo di collaborazione
        </label>
        <select
          id="tipo"
          name="tipo"
          value={fields.tipo}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="">Seleziona...</option>
          <option value="Consulenza AI">Consulenza AI</option>
          <option value="Speaking & Workshop">Speaking &amp; Workshop</option>
          <option value="Partnership">Partnership</option>
          <option value="Altro">Altro</option>
        </select>
      </div>

      <div>
        <label htmlFor="messaggio" className="mb-1.5 block text-sm font-medium text-gray-700">
          Messaggio <span className="text-accent-500">*</span>
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          required
          rows={5}
          placeholder="Raccontami il tuo progetto o la tua idea..."
          value={fields.messaggio}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMsg}</p>
      )}

      <Button
        type="submit"
        disabled={status === "loading"}
        variant="accent"
        size="lg"
        className="w-full sm:w-auto px-8"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Invio in corso...
          </>
        ) : (
          <>
            Invia messaggio
            <ArrowRight size={16} />
          </>
        )}
      </Button>
    </form>
  );
}
