"use client";

import type { Plan, Price } from "@prisma/client";
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";

type CustomPlan = Plan & {
  prices: Price[];
};

type Props = {
  plans: CustomPlan[];
};

export const MobileCompare = ({ plans }: Props) => {
  return <div className="hidden max-md:block">MobileCompare</div>;
};
