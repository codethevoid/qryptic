import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";
import { addMonths, startOfMonth } from "date-fns";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { slug } = params;

  const team = await prisma.team.findUnique({
    where: { slug },
    include: {
      plan: true,
      price: true,
      members: true,
      invoices: true,
      _count: {
        select: {
          domains: true,
          links: {
            where: {
              createdAt: {
                gte: startOfMonth(new Date()),
              },
            },
          },
        },
      },
    },
  });

  if (!team) return NextResponse.json({ message: "Team not found" }, { status: 404 });

  // verify user is part of team and is owner or super admin
  const teamMember = team.members.find((member) => member.userId === token.userId);
  if (!teamMember) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  if (!["owner", "super_admin"].includes(teamMember.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: team.id,
    name: team.name,
    slug: team.slug,
    image: team.image,
    company: team.company,
    plan: team.plan,
    price: team.price,
    members: team.members,
    invoices: team.invoices,
    trialEndsAt: team.trialEndsAt,
    subscriptionStatus: team.subscriptionStatus,
    subscriptionStart: team.subscriptionStart,
    subscriptionEnd: team.subscriptionEnd,
    cancelAtPeriodEnd: team.cancelAtPeriodEnd,
    paymentMethod: team.paymentMethodId
      ? {
          type: team.paymentMethodType,
          brand: team.paymentMethodBrand,
          last4: team.paymentMethodLast4,
          expMonth: team.paymentMethodExpMonth,
          expYear: team.paymentMethodExpYear,
        }
      : null,
    usage: {
      links: team._count.links,
      domains: team._count.domains,
      members: team.members.length,
    },
  });
};
