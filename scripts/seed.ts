import prisma from "@/db/prisma";
import { plans, proPrices, businessPrices } from "@/prisma/data";

const main = async () => {
  // need to create plans first and then prices for each plan besides the free plan
  for (const plan of plans) {
    const createdPlan = await prisma.plan.create({ data: plan });
    if (plan.name === "Pro") {
      for (const price of proPrices) {
        await prisma.price.create({
          data: {
            ...price,
            planId: createdPlan.id,
          },
        });
      }
    }

    if (plan.name === "Business") {
      for (const price of businessPrices) {
        await prisma.price.create({
          data: {
            ...price,
            planId: createdPlan.id,
          },
        });
      }
    }
  }

  // create default domain
  await prisma.domain.create({
    data: {
      name: "qrypt.co",
      isDefault: true,
      isSubdomain: false,
      isVerified: true,
    },
  });

  console.log("Plans and prices created successfully");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
  });
