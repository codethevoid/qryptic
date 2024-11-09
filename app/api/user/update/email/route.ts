import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { z } from "zod";
import { nanoid } from "@/utils/nanoid";

const schema = z.object({
  email: z.string().email(),
});

export const PATCH = withSession(async ({ req, user }) => {
  try {
    const body = await req.json();
    const { email } = body;

    const isValid = schema.safeParse({ email });
    if (!isValid.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      const isCurrentUser = existingUser.id === user.id;
      const message = isCurrentUser
        ? "You are already using this email"
        : "Email is already in use";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const token = nanoid(32);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email.toLowerCase().trim(),
        isEmailVerified: false,
        emailToken: token,
      },
    });

    return NextResponse.json({ message: "Email has been updated" });
  } catch (e) {
    console.error("Error updating email: ", e);
    return NextResponse.json({ error: "Error updating email" }, { status: 500 });
  }
});
