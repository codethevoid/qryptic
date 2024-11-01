import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { startOfMonth } from "date-fns";
import { withTeamOwner } from "@/lib/auth/with-team-owner";

export const GET = withTeamOwner(async ({ team: teamInfo }) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamInfo.id },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        company: true,
        emailInvoiceTo: true,
        subscriptionStatus: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        cancelAtPeriodEnd: true,
        paymentMethodType: true,
        paymentMethodBrand: true,
        paymentMethodLast4: true,
        paymentMethodExpMonth: true,
        paymentMethodExpYear: true,
        trialEndsAt: true,
        inviteToken: true,
        invoices: {
          where: { status: { not: "uncollectible" } },
          select: {
            id: true,
            amount: true,
            status: true,
            date: true,
            number: true,
            invoicePdf: true,
          },
          orderBy: { date: "desc" },
        },
        plan: {
          select: {
            id: true,
            isLegacy: true,
            name: true,
            links: true,
            domains: true,
            seats: true,
            isFree: true,
          },
        },
        price: { select: { id: true, price: true, interval: true } },
        members: {
          select: {
            id: true,
            role: true,
            user: { select: { id: true, email: true, name: true, image: true } },
          },
        },
        invites: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        _count: {
          select: {
            domains: true,
            members: true,
            links: { where: { createdAt: { gte: startOfMonth(new Date()) } } },
          },
        },
      },
    });

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    return NextResponse.json({
      id: team.id,
      name: team.name,
      slug: team.slug,
      image: team.image,
      company: team.company || "",
      emailInvoiceTo: team.emailInvoiceTo || "",
      plan: team.plan,
      price: team.price,
      members: team.members,
      invites: team.invites,
      invoices: team.invoices,
      subscriptionStatus: team.subscriptionStatus,
      subscriptionStart: team.subscriptionStart,
      subscriptionEnd: team.subscriptionEnd,
      cancelAtPeriodEnd: team.cancelAtPeriodEnd,
      trialEndsAt: team.trialEndsAt,
      inviteToken: team.inviteToken,
      paymentMethod: team.paymentMethodType
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
        members: team._count.members,
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
