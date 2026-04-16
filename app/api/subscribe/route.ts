import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const SUBSCRIBERS_DB_ID = "c3a083f7da8340bd923d3e4312aafae2";
const NOTION_VERSION = "2022-06-28";
const PDF_URL = "https://www.omarbortolato.it/downloads/guida-claude-code.pdf";

export async function POST(request: NextRequest) {
  try {
    const { email, name, guide } = await request.json() as {
      email?: string;
      name?: string;
      guide?: string;
    };

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email non valida." }, { status: 400 });
    }

    // 1. Salva su Notion (non blocca il flusso se fallisce)
    await saveToNotion(email, name ?? "", guide ?? "come-ho-costruito-questo-sito");

    // 2. Invia email con Resend (non blocca il flusso se fallisce)
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey && resendKey.length > 0) {
      try {
        const resend = new Resend(resendKey);
        const { error } = await resend.emails.send({
          from: "Omar Bortolato <onboarding@resend.dev>",
          to: [email],
          subject: "Ecco la tua guida gratuita!",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
              <h2 style="color: #1E3A8A;">Ciao${name ? " " + name : ""}!</h2>
              <p>Grazie per aver scaricato la guida <strong>"Come ho costruito questo sito con Claude Code"</strong>.</p>
              <p>Ecco il link diretto per scaricarla:</p>
              <p style="text-align: center; margin: 24px 0;">
                <a href="${PDF_URL}"
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
          `,
        });
        if (error) {
          console.error("[subscribe] Resend error:", error);
        } else {
          emailSent = true;
        }
      } catch (emailError) {
        console.error("[subscribe] Email sending failed:", emailError);
      }
    } else {
      console.warn("[subscribe] RESEND_API_KEY not configured — skipping email");
    }

    return NextResponse.json({ success: true, emailSent, downloadUrl: PDF_URL });
  } catch (error) {
    console.error("[subscribe] Unexpected error:", error);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}

async function saveToNotion(email: string, name: string, guide: string): Promise<void> {
  const notionKey = process.env.NOTION_API_KEY;
  if (!notionKey) {
    console.warn("[subscribe] NOTION_API_KEY not configured — skipping Notion save");
    return;
  }

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
            title: [{ text: { content: email } }],
          },
          Nome: {
            rich_text: [{ text: { content: name } }],
          },
          Guida: {
            select: { name: guide },
          },
          Data: {
            date: { start: new Date().toISOString().split("T")[0] },
          },
          Source: {
            select: { name: "website" },
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
