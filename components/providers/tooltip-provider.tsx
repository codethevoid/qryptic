"use client";

import { TooltipProvider as ShadTooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";

type TooltipProviderProps = {
  children: ReactNode;
};

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <ShadTooltipProvider delayDuration={100}>{children}</ShadTooltipProvider>;
};
