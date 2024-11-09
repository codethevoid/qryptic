import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { z } from "zod";
import bcrypt from "bcrypt";

const schema = z.object({
  newPassword: z.string().min(8),
});

export const PATCH = withSession(async ({ req, user }) => {
  try {
    const body = await req.json();
    const { password, newPassword } = body;

    console.log(password, newPassword);

    // check if user currently has a password
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { hashedPassword: true },
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // if user does not have a password, set one for them from the newPassword
    if (!userData.hashedPassword) {
      const isValidPassword = schema.safeParse({ newPassword });
      if (!isValidPassword.success) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { hashedPassword: passwordHash, credentialsAuth: true },
      });

      return NextResponse.json({ message: "Password has been set" });
    }

    // if user has a password, update it
    // But first we need to check if the current password is correct
    const isValid = await bcrypt.compare(password, userData.hashedPassword);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    // update password
    const isValidPassword = schema.safeParse({ newPassword });
    if (!isValidPassword.success) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword: passwordHash, credentialsAuth: true },
    });

    return NextResponse.json({ message: "Password has been updated" });
  } catch (e) {
    console.error("Error updating user password: ", e);
    return NextResponse.json({ error: "Error updating user password" }, { status: 500 });
  }
});
