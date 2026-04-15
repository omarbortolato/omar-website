import { NextRequest, NextResponse } from "next/server";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const SUBSCRIBERS_PARENT_ID = "343ef582-d259-8101-a1c5-dcadf5dca686";
const NOTION_VERSION = "2022-06-28";
const PDF_URL = "https://www.omarbortolato.it/downloads/guida-claude-code.pdf";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function saveToNotion(email: string, guide: string): Promise<void> {
  if (!NOTION_API_KEY) {
    console.warn("[subscribe] NOTION_API_KEY not set — skipping Notion save");
    return;
  }

  const date = new Date().toISOString().split("T")[0];

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { page_id: SUBSCRIBERS_PARENT_ID },
      properties: {
        title: {
          title: [{ text: { content: email } }],
        },
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: {
                  content: `Guida: ${guide} | Data: ${date} | Source: website`,
                },
              },
            ],
          },
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[subscribe] Notion error:", res.status, body);
    throw new Error("Notion save failed");
  }
}

async function sendConfirmationEmail(email: string): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("[subscribe] RESEND_API_KEY not set — skipping email send");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Omar Bortolato <onboarding@resend.dev>",
      to: [email],
      subject: "Ecco la tua guida gratuita!",
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111827;">
          <p style="font-size: 16px; line-height: 1.7;">Ciao,</p>
          <p style="font-size: 16px; line-height: 1.7;">
            Grazie per aver scaricato la guida
            <strong>"Come ho costruito questo sito con Claude Code"</strong>.
          </p>
          <p style="margin: 28px 0;">
            <a href="${PDF_URL}"
               style="background: #1E3A8A; color: white; padding: 14px 28px;
                      text-decoration: none; font-weight: 600; border-radius: 6px;
                      display: inline-block;">
              Scarica la guida →
            </a>
          </p>
          <p style="font-size: 14px; color: #6B7280; line-height: 1.6;">
            Se hai domande o vuoi parlare di AI pratica, rispondi pure a questa email.
          </p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 32px 0;" />
          <p style="font-size: 12px; color: #9CA3AF;">
            Omar Bortolato — AI Practitioner &amp; Manager<br/>
            <a href="https://www.omarbortolato.it" style="color: #9CA3AF;">omarbortolato.it</a>
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[subscribe] Resend error:", res.status, body);
    // Don't throw — email failure shouldn't block the subscribe flow
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, guide } = body as { email?: string; guide?: string };

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Inserisci un'email valida." },
        { status: 400 }
      );
    }

    const guideName = guide ?? "unknown";

    // Save to Notion — if it fails, log and continue (don't block download)
    try {
      await saveToNotion(email, guideName);
    } catch {
      console.error("[subscribe] Notion save failed — proceeding anyway");
    }

    // Send confirmation email — failure is non-blocking
    await sendConfirmationEmail(email);

    return NextResponse.json({
      ok: true,
      downloadUrl: PDF_URL,
    });
  } catch {
    console.error("[subscribe] Unexpected error");
    return NextResponse.json(
      { error: "Qualcosa è andato storto. Riprova." },
      { status: 500 }
    );
  }
}
