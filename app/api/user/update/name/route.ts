import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { z } from "zod";

const schema = z.object({
  name: z.string().max(50).optional(),
});

export const PATCH = withSession(async ({ user, req }) => {
  try {
    const body = await req.json();
    const { name } = body;

    const isValidName = schema.safeParse({ name });
    if (!isValidName.success) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim() },
    });

    return NextResponse.json({ message: "User name has been updated" });
  } catch (e) {
    console.error("Error updating user name: ", e);
    return NextResponse.json({ error: "Error updating user name" }, { status: 500 });
  }
});
