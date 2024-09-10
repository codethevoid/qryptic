import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/db/prisma";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
  const token = await auth();
  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { slug } = params;

  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();

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
                gte: new Date(`${year}-${month}-01`),
                lte: new Date(`${year}-${month + 1}-01`),
              },
            },
          },
        },
      },
    },
  });

  if (!team) return NextResponse.json({ message: "Team not found" }, { status: 404 });
  if (!team.members.find((member) => member.userId === token.userId)) {
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
          type: team.type,
          last4: team.last4,
          expMonth: team.expMonth,
          expYear: team.expYear,
        }
      : null,
    usage: {
      links: team._count.links,
      domains: team._count.domains,
      members: team.members.length,
    },
  });
};
