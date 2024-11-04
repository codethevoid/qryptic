import { NextResponse } from "next/server";
import { withTeamOwner } from "@/lib/auth/with-team-owner";
import prisma from "@/db/prisma";
import { z } from "zod";
import { stripe } from "@/utils/stripe";

const companySchema = z.object({
  company: z.string().max(50),
});

export const PATCH = withTeamOwner(async ({ team, req }) => {
  try {
    const body = await req.json();
    const { company } = body;

    const isCompanyValid = companySchema.safeParse({ company });
    if (!isCompanyValid.success) {
      return NextResponse.json({ error: "Invalid company name" }, { status: 400 });
    }

    const teamData = await prisma.team.findUnique({
      where: { id: team.id },
      select: { stripeCustomerId: true },
    });

    if (!teamData) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    await prisma.team.update({
      where: { id: team.id },
      data: { company },
    });

    // update company name in stripe
    await stripe.customers.update(teamData.stripeCustomerId, {
      name: company,
    });

    return NextResponse.json({ message: "Company name has been updated" });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error updating company" }, { status: 500 });
  }
});
