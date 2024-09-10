import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/utils/stripe";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { slug } = params;

  const team = await prisma.team.findUnique({ where: { slug }, include: { members: true } });
  if (!team) return NextResponse.json({ message: "No team found" }, { status: 404 });

  // make sure user is part of team and is owner or super admin
  const user = team.members.find((member) => member.userId === token.userId);
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!["owner", "super_admin"].includes(user.role))
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // generate setup intent
  const setupIntent = await stripe.setupIntents.create({
    customer: team.stripeCustomerId,
    payment_method_types: ["card"],
  });
  if (!setupIntent)
    return NextResponse.json({ message: "Failed to create setup intent" }, { status: 500 });

  return NextResponse.json({ clientSecret: setupIntent.client_secret });
};
