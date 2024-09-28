import { type Plan } from "@prisma/client";
import { type Price } from "@prisma/client";

type CustomPrice = Omit<Price, "id" | "createdAt" | "planId" | "isActive">;

type CustomPlan = Omit<Plan, "id" | "createdAt" | "isLegacy" | "isCustom" | "slaContract">;

export const proPrices: CustomPrice[] = [
  {
    interval: "month",
    price: 10,
    stripePriceId: "price_1PrrWt08CDYCFGXEtIFBCgNS",
    stripeProductId: "prod_QjKBDVIxzwFecw",
  },
  {
    interval: "year",
    price: 96,
    stripePriceId: "price_1PrrXP08CDYCFGXEGhyydBJQ",
    stripeProductId: "prod_QjKBDVIxzwFecw",
  },
];

export const businessPrices: CustomPrice[] = [
  {
    interval: "month",
    price: 30,
    stripePriceId: "price_1Prrag08CDYCFGXEPugGOvU7",
    stripeProductId: "prod_QjKFGI4YnmOPAJ",
  },
  {
    interval: "year",
    price: 288,
    stripePriceId: "price_1PrrbG08CDYCFGXEjwW8nVQT",
    stripeProductId: "prod_QjKFGI4YnmOPAJ",
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
    analytics: 30, // days
    ai: false,
    apiAccess: false,
    bulk: false,
    redirects: false,
    qrCustomization: false,
    domainRedirector: false,
    linkPreviews: false,
    smartRules: false,
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Basic",
  },
  {
    name: "Pro",
    description: "For startups and small teams",
    isFree: false,
    links: 1000,
    seats: 5,
    domains: 3,
    analytics: 366, // days
    apiAccess: true,
    bulk: true,
    ai: true,
    redirects: true,
    qrCustomization: true,
    domainRedirector: true,
    linkPreviews: true,
    smartRules: true,
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Enhanced",
  },
  {
    name: "Business",
    description: "For growing businesses",
    isFree: false,
    links: 5000,
    seats: 20,
    domains: 10,
    analytics: 1096, // days
    ai: true,
    apiAccess: true,
    bulk: true,
    redirects: true,
    qrCustomization: true,
    domainRedirector: true,
    linkPreviews: true,
    smartRules: true,
    sso: false,
    rbac: false,
    sla: false,
    supportLevel: "Priority",
  },
];
