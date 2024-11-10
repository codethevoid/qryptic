import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import { sendEmail } from "@/utils/send-email";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";

const schema = z.object({
  feedback: z.string().min(1),
});

export const POST = withSession(async ({ req, user }) => {
  try {
    const body = await req.json();
    const { feedback } = body;

    const isFeedbackValid = schema.safeParse(body);
    if (!isFeedbackValid.success) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    waitUntil(
      sendEmail({
        from: "Qryptic <support@mailer.qryptic.io>",
        to: "rmthomas@qryptic.io",
        subject: `Qryptic Feedback from ${user?.name ?? user?.email}`,
        text: `New feedback from ${user?.email} - ${user?.name ?? "No name"}: ${feedback}`,
      }),
    );

    return NextResponse.json({ message: "Feedback submitted" });
  } catch (e) {
    console.error("Error submitting feedback: ", e);
    return NextResponse.json({ error: "Error submitting feedback" }, { status: 500 });
  }
});
