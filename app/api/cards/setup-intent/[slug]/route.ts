import { NextResponse } from "next/server";
import { stripe } from "@/utils/stripe";
import { withTeam } from "@/lib/auth/with-team";
import { adminRoles } from "@/lib/constants/roles";
import prisma from "@/db/prisma";

export const GET = withTeam(async ({ team, user }) => {
  try {
    if (!adminRoles.includes(user.role)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.team.findUnique({
      where: { id: team.id },
      select: { stripeCustomerId: true },
    });

    // generate setupintent
    const setupIntent = await stripe.setupIntents.create({
      customer: customer?.stripeCustomerId,
      payment_method_types: ["card"],
    });

    if (!setupIntent) {
      return NextResponse.json({ message: "Failed to create setup intent" }, { status: 500 });
    }

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create setup intent" }, { status: 500 });
  }
});
