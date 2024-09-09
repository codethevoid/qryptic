import { Plan, Price } from "@prisma/client";

export type PlanWithPrices = Plan & { prices: Price[] };

export type PlanName = "Free" | "Pro" | "Business" | "Enterprise";
