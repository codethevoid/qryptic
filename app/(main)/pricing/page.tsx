import prisma from "@/db/prisma";
import { Plan, Price } from "@prisma/client";
import { PricingTiers } from "@/app/(main)/pricing/components/tiers";
import { Compare } from "@/app/(main)/pricing/components/compare";

type CustomPlan = Plan & {
  prices: Price[];
};

const PricingPage = async () => {
  const plans: CustomPlan[] = await prisma.plan.findMany({
    where: { isCustom: false, isLegacy: false },
    include: { prices: true },
    orderBy: { links: "asc" },
  });

  return (
    <div className="flex flex-col space-y-24 py-16">
      <PricingTiers plans={plans} />
      <Compare plans={plans} />
    </div>
  );
};

export default PricingPage;
