import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import { sendEmail } from "@/utils/send-email";
import { nanoid } from "nanoid";
import { waitUntil } from "@vercel/functions";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import { ResetPasswordEmail } from "@/emails/reset-password";
import { ratelimit } from "@/lib/upstash/rate-limit";
import { ipAddress } from "@vercel/functions";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { email } = body;

    // check ratelimit
    const isAllowed = await checkRatelimit(req);
    if (!isAllowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // check if user exists
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    // still should act as success so no one can enumerate users
    if (!user) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // create reset password token
    const token = nanoid(32);
    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token },
    });

    // send forgot password email
    waitUntil(
      sendEmail({
        from: "Qryptic <support@mailer.qryptic.io>",
        to: email,
        replyTo: "support@qryptic.io",
        subject: "Reset your password",
        react: ResetPasswordEmail(token),
        text: `Reset your password by clicking this link ${protocol}${appDomain}/reset-password?token=${token}`,
      }),
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error sending forgot password email", e);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
};

async function checkRatelimit(req: NextRequest) {
  const ip = ipAddress(req);
  const identifier = `forgot-password:${ip}`;
  const { success } = await ratelimit.limit(identifier);
  return success;
}
