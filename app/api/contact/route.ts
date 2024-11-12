import { NextRequest, NextResponse } from "next/server";
import { ratelimit } from "@/lib/upstash/rate-limit";
import { sendEmail } from "@/utils/send-email";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { ipAddress } from "@vercel/functions";

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(1),
});

export const POST = async (req: NextRequest) => {
  try {
    const ip = ipAddress(req);
    const identifier = `contact:${ip}`;
    const { success } = await ratelimit().limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const body = await req.json();
    const { email, message } = body;

    const isValid = schema.safeParse(body);
    if (!isValid.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // send email
    waitUntil(
      sendEmail({
        from: "Qryptic <support@mailer.qryptic.io>",
        to: "rmthomas@qryptic.io",
        subject: `Qryptic Contact Form Submission from ${email}`,
        text: `New contact form submission from ${email}: ${message}`,
      }),
    );

    return NextResponse.json({ message: "Message sent successfully" });
  } catch (e) {
    console.error("Error sending contact message: ", e);
    return NextResponse.json({ error: "Error sending contact message" }, { status: 500 });
  }
};
