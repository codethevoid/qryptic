import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { withTeam } from "@/lib/auth/with-team";

export const GET = withTeam(async ({ team: teamInfo, user }) => {
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamInfo.id },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        company: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        paymentMethodId: true,
        plan: {
          select: {
            id: true,
            name: true,
            isFree: true,
            analytics: true,
            seats: true,
            links: true,
            domains: true,
          },
        },
        _count: {
          select: {
            members: true,
            domains: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    // const allowedSeats = team.plan.seats;
    // const currentSeats = team._count.members as number;
    // const isFreePlan = team.plan.isFree;

    // if plan is free and current seats is greater than allowed seats, we will not allow
    // any member to view the team other than super admin bc there can only be 1 seat on free plan
    // if (isFreePlan) {
    //   if (user.role !== "super_admin") {
    //     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    //   }
    // } else if (currentSeats > allowedSeats && !adminRoles.includes(user.role)) {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    // if (currentSeats > allowedSeats && user.role !== "owner") {
    //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    // }

    const { paymentMethodId, ...rest } = team;

    const teamData = {
      ...rest,
      hasPaymentMethod: !!paymentMethodId,
      user: { role: user.role },
    };

    return NextResponse.json(teamData);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
});
