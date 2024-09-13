import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        red: "border-transparent bg-red-500/15 text-red-600 dark:text-red-500 font-medium",
        orange:
          "border-transparent bg-orange-500/15 text-orange-600 dark:text-orange-500 font-medium",
        amber: "border-transparent bg-amber-500/15 text-amber-600 dark:text-amber-500 font-medium",
        yellow:
          "border-transparent bg-yellow-500/15 text-yellow-600 dark:text-yellow-500 font-medium",
        lime: "border-transparent bg-lime-500/15 text-lime-600 dark:text-lime-500 font-medium",
        green: "border-transparent bg-green-500/15 text-green-600 dark:text-green-500 font-medium",
        emerald:
          "border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-500 font-medium",
        teal: "border-transparent bg-teal-500/15 text-teal-600 dark:text-teal-500 font-medium",
        cyan: "border-transparent bg-cyan-500/15 text-cyan-600 dark:text-cyan-500 font-medium",
        sky: "border-transparent bg-sky-500/15 text-sky-600 dark:text-sky-500 font-medium",
        blue: "border-transparent bg-blue-500/15 text-blue-600 dark:text-blue-500 font-medium",
        indigo:
          "border-transparent bg-indigo-500/15 text-indigo-600 dark:text-indigo-500 font-medium",
        violet:
          "border-transparent bg-violet-500/15 text-violet-600 dark:text-violet-500 font-medium",
        purple:
          "border-transparent bg-purple-500/15 text-purple-600 dark:text-purple-500 font-medium",
        fuchsia:
          "border-transparent bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-500 font-medium",
        pink: "border-transparent bg-pink-500/15 text-pink-600 dark:text-pink-500 font-medium",
        rose: "border-transparent bg-rose-500/15 text-rose-600 dark:text-rose-500 font-medium",
      },
    },
  },
);

export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  variant: NonNullable<VariantProps<typeof tagVariants>["variant"]>;
}

function Tag({ className, variant, ...props }: TagProps) {
  return <div className={cn(tagVariants({ variant }), className)} {...props} />;
}

export { Tag, tagVariants };
