"use client";

// Data di nascita: 17 Settembre 1978
const BIRTH_DATE = new Date(1978, 8, 17); // mesi 0-indexed → 8 = Settembre

function computeAge(): number {
  const today = new Date();
  let age = today.getFullYear() - BIRTH_DATE.getFullYear();
  const monthDiff = today.getMonth() - BIRTH_DATE.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < BIRTH_DATE.getDate())) {
    age--; // compleanno non ancora passato quest'anno
  }
  return age;
}

/**
 * Mostra l'età corrente calcolata client-side dalla data di nascita.
 * suppressHydrationWarning evita warning React se il valore del build
 * (server, statico) differisce da quello calcolato nel browser al momento
 * della visita — caso tipico: visita dopo il compleanno, build prima.
 */
export function DynamicAge() {
  return <span suppressHydrationWarning>{computeAge()}</span>;
}
