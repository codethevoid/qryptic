import { type Plan } from "@prisma/client";
import { type Price } from "@prisma/client";

type CustomPrice = Omit<Price, "id" | "createdAt" | "planId" | "isActive">;

type CustomPlan = Omit<Plan, "id" | "createdAt" | "isLegacy" | "isCustom" | "slaContract">;

export const proPrices: CustomPrice[] = [
  {
    interval: "month",
    price: 15,
    stripePriceId: "price_1QKO8XKyK48kAwp61uIn0Jl4",
    stripeProductId: "prod_RCnkKOF2IN3Xqg",
  },
  {
    interval: "year",
    price: 144,
    stripePriceId: "price_1QKO91KyK48kAwp6Ly9656HI",
    stripeProductId: "prod_RCnkKOF2IN3Xqg",
  },
];

export const businessPrices: CustomPrice[] = [
  {
    interval: "month",
    price: 40,
    stripePriceId: "price_1QKOARKyK48kAwp6YwPhALYJ",
    stripeProductId: "prod_RCnlnMU9KnR0TM",
  },
  {
    interval: "year",
    price: 384,
    stripePriceId: "price_1QKOAqKyK48kAwp6RuQ352C8",
    stripeProductId: "prod_RCnlnMU9KnR0TM",
  },
];

export const plans: CustomPlan[] = [
  {
    name: "Free",
    description: "For getting started",
    isFree: true,
    links: 20,
    seats: 1,
    domains: 1,
    analytics: 30, // 1 month
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Basic",
  },
  {
    name: "Pro",
    description: "For startups and small teams",
    isFree: false,
    links: 3000,
    seats: 5,
    domains: 3,
    analytics: 366, // 1 year
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Enhanced",
  },
  {
    name: "Business",
    description: "For growing businesses",
    isFree: false,
    links: 10000,
    seats: 20,
    domains: 10,
    analytics: 1096, // 3 years
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Priority",
  },
];
