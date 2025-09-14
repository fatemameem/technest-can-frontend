import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional().default(''),
  subject: z.string().min(1),
  message: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = ContactSchema.parse(body);

    const { error } = await resend.emails.send({
      from: process.env.FROM_EMAIL || "contact@your-domain.com",
      to: process.env.TO_EMAIL || "hello@your-domain.com",
      replyTo: data.email, // so you can reply directly
      subject: `Technest: ${data.subject}`,
      text: `From: ${data.name} <${data.email}>${data.organization ? `\nOrganization: ${data.organization}` : ''}\n\n${data.message}`,
      // You can also send HTML if you prefer
      // html: `<p><b>From:</b> ${data.name} (${data.email})</p><p>${data.message}</p>`
    });

    if (error) {
      console.error(error);
      return NextResponse.json({ ok: false, error: "Email send failed" }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    const msg = err?.message || "Invalid request";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}