"use client";

import { useEffect } from "react";

// Il corpo degli articoli arriva da Notion come HTML già pronto: il pulsante
// "Copia" si innesta sui <pre> dopo il montaggio invece di passare dal renderer.
export function CopyCodeButtons({ selector }: { selector: string }) {
  useEffect(() => {
    const blocks = Array.from(
      document.querySelectorAll<HTMLPreElement>(`${selector} pre`)
    );

    const buttons = blocks.map((pre) => {
      pre.classList.add("relative", "pt-12");
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = "Copia";
      button.className =
        "absolute right-3 top-3 rounded-md border border-slate-200 bg-white px-2.5 py-1 font-sans text-xs font-medium text-slate-600 shadow-sm transition-colors hover:border-primary-800/30 hover:text-primary-800";
      button.addEventListener("click", async () => {
        const text = pre.querySelector("code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          button.textContent = "Copiato";
        } catch {
          button.textContent = "Selezionalo e copia";
        }
        window.setTimeout(() => (button.textContent = "Copia"), 2000);
      });
      pre.appendChild(button);
      return button;
    });

    return () => {
      buttons.forEach((b) => b.remove());
      blocks.forEach((pre) => pre.classList.remove("relative", "pt-12"));
    };
  }, [selector]);

  return null;
}
