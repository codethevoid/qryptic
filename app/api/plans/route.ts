import { NextResponse } from "next/server";
import prisma from "@/db/prisma";
import { Plan, Price } from "@prisma/client";

type CustomPlan = Plan & { prices: Price[] };

export const GET = async () => {
  const plans: CustomPlan[] = await prisma.plan.findMany({
    where: { isFree: false, isLegacy: false, isCustom: false },
    include: { prices: { where: { isActive: true } } },
    orderBy: { links: "asc" },
  });

  return NextResponse.json(plans);
};
