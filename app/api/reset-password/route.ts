import { NextResponse, NextRequest } from "next/server";
import prisma from "@/db/prisma";
import bcrypt from "bcrypt";
import { ipAddress } from "@vercel/functions";
import { ratelimit } from "@/lib/upstash/rate-limit";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(8),
  token: z.string().min(1),
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { token, password } = body;

    // check ratelimit
    const isAllowed = await checkRatelimit(req);
    if (!isAllowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const isValid = schema.safeParse({ token, password });
    if (!isValid.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // check if token is valid
    const user = await prisma.user.findFirst({ where: { resetPasswordToken: token } });
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    // update user password
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: passwordHash, resetPasswordToken: null, credentialsAuth: true },
    });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (e) {
    console.error("Error resetting password", e);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
};

async function checkRatelimit(req: NextRequest) {
  const ip = ipAddress(req);
  const identifier = `reset-password:${ip}`;
  const { success, remaining } = await ratelimit().limit(identifier);
  console.log("Ratelimit remaining", remaining);
  return success;
}
