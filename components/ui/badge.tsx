import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "border-transparent bg-blue-500/10 text-blue-600 dark:text-blue-500 font-normal",
        warning:
          "border-transparent bg-amber-500/10 text-amber-600 dark:text-amber-500 font-normal",
        error: "border-transparent bg-red-500/10 text-red-600 dark:text-red-500 font-normal",
        success:
          "border-transparent bg-green-500/15 dark:bg-green-500/10 text-green-600 dark:text-green-500 font-normal",
        neutral:
          "border-transparent bg-zinc-500/10 dark:bg-zinc-500/15 text-foreground/80 font-normal",
        colorful: "border-transparent bg-teal-500/10 text-teal-600 dark:text-teal-500 font-normal",
        default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
