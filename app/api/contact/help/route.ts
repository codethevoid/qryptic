import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import { sendEmail } from "@/utils/send-email";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";

const schema = z.object({
  help: z.string().min(1),
});

export const POST = withSession(async ({ req, user }) => {
  try {
    const body = await req.json();
    const { help } = body;

    const isMessageValid = schema.safeParse(body);
    if (!isMessageValid.success) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }

    waitUntil(
      sendEmail({
        from: "Qryptic <support@mailer.qryptic.io>",
        to: "rmthomas@qryptic.io",
        subject: `Qryptic Help Requested from ${user?.name ?? user?.email}`,
        text: `New help request from ${user?.email} - ${user?.name ?? "No name"}: ${help}`,
      }),
    );

    return NextResponse.json({ message: "Help request submitted" });
  } catch (e) {
    console.error("Error submitting help request: ", e);
    return NextResponse.json({ error: "Error submitting help request" }, { status: 500 });
  }
});
