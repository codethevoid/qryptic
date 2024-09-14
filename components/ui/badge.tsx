import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-deepBlue-500/15 text-deepBlue-500 dark:text-deepBlue-400 font-medium",
        warning:
          "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-500 font-medium",
        error: "border-transparent bg-red-500/15 text-red-600 dark:text-red-500 font-medium",
        success:
          "border-transparent bg-green-500/15 text-green-600 dark:text-green-500 font-medium",
        neutral:
          "border-transparent bg-zinc-500/10 dark:bg-zinc-500/15 text-foreground/80 font-medium",
        colorful: "border-transparent bg-teal-500/15 text-teal-600 dark:text-teal-500 font-medium",
        pretty:
          "border-transparent bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-500 font-medium",
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
