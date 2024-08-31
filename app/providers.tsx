"use client";

import { TooltipProvider } from "@/components/providers/tooltip-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider defaultTheme="dark" attribute="class" enableSystem disableTransitionOnChange>
      <TooltipProvider>{children}</TooltipProvider>
    </ThemeProvider>
  );
};
