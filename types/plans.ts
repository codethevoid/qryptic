import { Plan, Price } from "@prisma/client";

export type PlanWithPrices = Plan & { prices: Price[] };
