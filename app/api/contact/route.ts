import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { nome, email, tipo, messaggio } = await request.json() as {
      nome?: string;
      email?: string;
      tipo?: string;
      messaggio?: string;
    };

    if (!nome || !email || !messaggio) {
      return NextResponse.json({ error: "Campi obbligatori mancanti." }, { status: 400 });
    }
    if (!email.includes("@")) {
      return NextResponse.json({ error: "Email non valida." }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.warn("[contact] RESEND_API_KEY not configured");
      return NextResponse.json({ error: "Servizio email non configurato." }, { status: 500 });
    }

    const resend = new Resend(resendKey);
    const subject = tipo
      ? `[${tipo}] da ${nome} — omarbortolato.it`
      : `Messaggio da ${nome} — omarbortolato.it`;

    const { error } = await resend.emails.send({
      from: "Sito Omar Bortolato <onboarding@resend.dev>",
      to: ["omarbortolato@gmail.com"],
      replyTo: email,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111827;">
          <h2 style="color: #1E3A8A; margin-bottom: 4px;">Nuovo messaggio dal sito</h2>
          <p style="color: #6B7280; font-size: 13px; margin-top: 0;">${subject}</p>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6B7280; width: 120px;">Nome</td>
              <td style="padding: 8px 0; font-weight: 600;">${nome}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B7280;">Email</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #1E3A8A;">${email}</a></td>
            </tr>
            ${tipo ? `<tr>
              <td style="padding: 8px 0; color: #6B7280;">Tipo</td>
              <td style="padding: 8px 0;">${tipo}</td>
            </tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <div style="background: #F9FAFB; border-radius: 8px; padding: 16px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${messaggio}</div>
          <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 20px 0;" />
          <p style="color: #9CA3AF; font-size: 12px;">Rispondi a questa email per rispondere direttamente a ${nome}.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json({ error: "Errore nell'invio. Riprova." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Errore interno." }, { status: 500 });
  }
}
