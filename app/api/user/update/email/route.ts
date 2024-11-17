import { NextResponse } from "next/server";
import { withSession } from "@/lib/auth/with-session";
import prisma from "@/db/prisma";
import { z } from "zod";
import { nanoid } from "@/utils/nanoid";
import { stripe } from "@/utils/stripe";

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

    // get teams user is a part of
    const teams = await prisma.teamMember.findMany({
      where: { userId: user.id, role: "owner" },
      include: { team: true },
    });

    for (const team of teams) {
      const { createdBy, stripeCustomerId } = team.team;
      // if the user is the creator of the team and the team does not have an email invoice to set, update the stripe customer email
      if (createdBy === user.id && !team.team.emailInvoiceTo) {
        // update stripe customer email
        await stripe.customers.update(stripeCustomerId, {
          email: email.toLowerCase().trim(),
        });
      }
    }

    return NextResponse.json({ message: "Email has been updated" });
  } catch (e) {
    console.error("Error updating email: ", e);
    return NextResponse.json({ error: "Error updating email" }, { status: 500 });
  }
});
