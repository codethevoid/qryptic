import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type MaxWidthProps = {
  children: ReactNode;
  className?: string;
};

export const MaxWidthWrapper = ({ children, className }: MaxWidthProps) => {
  return <div className={cn("mx-auto w-full max-w-screen-lg", className)}>{children}</div>;
};
