import { NextResponse, NextRequest } from "next/server";
import { stripe } from "@/utils/stripe";
import { auth } from "@/auth";
import { verifyOwnership } from "@/lib/auth/verify-ownership";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { slug } = params;

  const { isAuthorized, team } = await verifyOwnership(slug, token.userId);
  if (!isAuthorized) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  // generate setup intent
  const setupIntent = await stripe.setupIntents.create({
    customer: team?.stripeCustomerId,
    payment_method_types: ["card"],
  });
  if (!setupIntent) {
    return NextResponse.json({ message: "Failed to create setup intent" }, { status: 500 });
  }

  return NextResponse.json({ clientSecret: setupIntent.client_secret });
};
