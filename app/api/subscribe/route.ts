import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUBSCRIBERS_DB_ID = "c3a083f7da8340bd923d3e4312aafae2";
const NOTION_VERSION = "2022-06-28";
const DEFAULT_PDF_URL = "https://www.omarbortolato.it/downloads/guida-claude-code.pdf";

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      name,
      guide,
      source,
      marketingConsent,
      downloadUrl: clientDownloadUrl,
    } = await request.json() as {
      email?: string;
      name?: string;
      guide?: string;
      source?: string;
      marketingConsent?: boolean;
      downloadUrl?: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida." }, { status: 400 });
    }

    const isBook = (guide ?? "").startsWith("spremuta-");
    const finalDownloadUrl = clientDownloadUrl ?? DEFAULT_PDF_URL;

    // 1. Salva su Notion
    await saveToNotion({
      email,
      name: name ?? "",
      guide: guide ?? "come-ho-costruito-questo-sito",
      source: source ?? "sito",
      marketingConsent: marketingConsent === true,
    });

    // 2. Invia email con Resend
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.length > 0) {
      const resend = new Resend(resendKey);

      try {
        const { data, error } = await resend.emails.send({
          from: "Omar Bortolato <omar@omarbortolato.it>",
          to: [email],
          subject: isBook ? "🍊 La tua Spremuta è pronta!" : "Ecco la tua guida gratuita!",
          html: isBook
            ? buildBookEmail(name ?? "", finalDownloadUrl, guide ?? "")
            : buildGuideEmail(name ?? "", finalDownloadUrl),
        });
        if (error) {
          console.error("[subscribe] Resend error:", JSON.stringify(error));
        } else {
          console.log("[subscribe] Email sent, id:", data?.id);
          emailSent = true;
        }
      } catch (emailError) {
        console.error("[subscribe] Email sending failed:", emailError);
      }

      // 3. Notifica a Omar per ogni nuovo iscritto
      try {
        const { error: notifyError } = await resend.emails.send({
          from: "Omar Bortolato <omar@omarbortolato.it>",
          to: ["omarbortolato@gmail.com"],
          subject: isBook ? "🍊 Nuova Spremuta scaricata" : "📥 Nuovo iscritto guida",
          html: buildNotificationEmail(
            email,
            name ?? "",
            guide ?? "",
            isBook,
            source ?? "sito",
            marketingConsent === true
          ),
        });
        if (notifyError) {
          console.error("[subscribe] Notification email error:", JSON.stringify(notifyError));
        }
      } catch (notifyError) {
        console.error("[subscribe] Notification email failed:", notifyError);
      }
    } else {
      console.warn("[subscribe] RESEND_API_KEY not configured — skipping email");
    }

    return NextResponse.json({ success: true, emailSent, downloadUrl: finalDownloadUrl });
  } catch (error) {
    console.error("[subscribe] Unexpected error:", error);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}

// ─── Email templates ──────────────────────────────────────────────────────────

function buildGuideEmail(name: string, downloadUrl: string): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #1E3A8A;">Ciao${name ? " " + name : ""}!</h2>
      <p>Grazie per aver scaricato la guida <strong>"Come ho costruito questo sito con Claude Code"</strong>.</p>
      <p>Ecco il link diretto per scaricarla:</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${downloadUrl}"
           style="background-color: #1E3A8A; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;
                  display: inline-block;">
          Scarica la guida PDF →
        </a>
      </p>
      <p>Se hai domande o vuoi collaborare, scrivimi su
        <a href="https://www.omarbortolato.it/collabora">omarbortolato.it/collabora</a>.
      </p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #6B7280; font-size: 12px;">
        Omar Bortolato — omarbortolato.it<br/>
        AI pratica per chi vuole fare, non solo sapere.
      </p>
    </div>
  `;
}

function buildBookEmail(name: string, downloadUrl: string, guide: string): string {
  // Estrae il titolo dello slug (es. "spremuta-mastery-robert-greene" → "Mastery Robert Greene")
  const bookSlug = guide.replace("spremuta-", "");
  const bookTitle = bookSlug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #1E3A8A;">🍊 Ciao${name ? " " + name : ""}!</h2>
      <p>La tua Spremuta di <strong>${bookTitle}</strong> è pronta.</p>
      <p>Non è un riassunto — è quello che ho capito io, filtrato attraverso la mia esperienza. Leggila con spirito critico e trovaci la tua applicazione.</p>
      <p style="text-align: center; margin: 24px 0;">
        <a href="${downloadUrl}"
           style="background-color: #1E3A8A; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; font-weight: bold;
                  display: inline-block;">
          🍊 Scarica la Spremuta PDF →
        </a>
      </p>
      <p style="color: #6B7280; font-size: 14px;">
        Hai letto qualcosa che ti ha colpito in modo diverso da me? Scrivimi —
        le storie vere mi interessano più dei like.
      </p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
      <p style="color: #6B7280; font-size: 12px;">
        Omar Bortolato — omarbortolato.it<br/>
        AI pratica per chi vuole fare, non solo sapere.
      </p>
    </div>
  `;
}

function buildNotificationEmail(
  email: string,
  name: string,
  guide: string,
  isBook: boolean,
  source: string,
  marketingConsent: boolean
): string {
  const label = isBook ? "Spremuta" : "Guida";
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
      <h2 style="color: #1E3A8A;">📥 Nuovo iscritto</h2>
      <p><strong>Email:</strong> ${email}</p>
      ${name ? `<p><strong>Nome:</strong> ${name}</p>` : ""}
      <p><strong>${label}:</strong> ${guide || "—"}</p>
      <p><strong>Provenienza:</strong> ${source}</p>
      <p><strong>Consenso aggiornamenti:</strong> ${marketingConsent ? "sì" : "no"}</p>
      <p style="margin-top: 24px;">
        <a href="https://www.notion.so/quantum-wealth/c3a083f7da8340bd923d3e4312aafae2"
           style="color: #1E3A8A;">Vedi su Notion →</a>
      </p>
    </div>
  `;
}

// ─── Notion save ──────────────────────────────────────────────────────────────

/**
 * Salva l'iscritto su Notion.
 *
 * Oltre a email e nome registra ciò che serve per agganciare in futuro una sequenza
 * email senza dover rifare nulla:
 *   · Tag provenienza — da quale pagina è arrivata l'iscrizione
 *   · Consenso marketing — spunta separata e facoltativa, mai preselezionata
 *   · Data consenso — quando è stato dato: senza data il consenso non è dimostrabile
 *   · Sequenza / Stato sequenza — restano vuoti finché una sequenza non esiste
 *
 * Il consenso è distinto dalla consegna del file: chi non lo dà riceve comunque
 * il download e non entra in nessuna sequenza.
 */
async function saveToNotion(sub: {
  email: string;
  name: string;
  guide: string;
  source: string;
  marketingConsent: boolean;
}): Promise<void> {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) {
    console.warn("[subscribe] NOTION_API_KEY not configured — skipping Notion save");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionKey}`,
        "Content-Type": "application/json",
        "Notion-Version": NOTION_VERSION,
      },
      body: JSON.stringify({
        parent: { database_id: SUBSCRIBERS_DB_ID },
        properties: {
          Email: {
            title: [{ text: { content: sub.email } }],
          },
          Nome: {
            rich_text: [{ text: { content: sub.name } }],
          },
          Guida: {
            select: { name: sub.guide },
          },
          Data: {
            date: { start: today },
          },
          Source: {
            select: { name: "website" },
          },
          "Tag provenienza": {
            multi_select: [{ name: sub.source }],
          },
          "Consenso marketing": {
            checkbox: sub.marketingConsent,
          },
          ...(sub.marketingConsent
            ? { "Data consenso": { date: { start: today } } }
            : {}),
          "Stato sequenza": {
            select: { name: sub.marketingConsent ? "da agganciare" : "nessuna" },
          },
        },
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      console.error("[subscribe] Notion save error:", res.status, body);
    }
  } catch (error) {
    console.error("[subscribe] Notion save failed:", error);
  }
}
