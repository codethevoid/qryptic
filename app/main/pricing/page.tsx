import prisma from "@/db/prisma";
import { Plan, Price } from "@prisma/client";
import { PricingTiers } from "@/app/main/pricing/components/tiers";
import { Compare } from "@/app/main/pricing/components/compare";
import { PricingFaq } from "./components/faq";
import { constructMetadata } from "@/utils/construct-metadata";
import { GetStarted } from "../(landing)/components/get-started";

export const metadata = constructMetadata({
  title: "Qryptic | Pricing",
});

type CustomPlan = Plan & {
  prices: Price[];
};

const PricingPage = async () => {
  const plans: CustomPlan[] = await prisma.plan.findMany({
    where: { isCustom: false, isLegacy: false },
    include: { prices: { where: { isActive: true } } },
    orderBy: { links: "asc" },
  });

  return (
    <div className="space-y-20 py-20 max-sm:py-16">
      <PricingTiers plans={plans} />
      <Compare plans={plans} />
      <PricingFaq />
      {/* <StartNow /> */}
      <GetStarted />
    </div>
  );
};

export default PricingPage;
