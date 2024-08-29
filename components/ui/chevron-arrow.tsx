import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ChevronArrowProps = {
  className?: string;
};

export const ChevronArrow = ({ className }: ChevronArrowProps) => {
  return (
    <span className="relatve flex items-center">
      <span
        className={cn(
          `absolute h-[1.5px] w-[5px] translate-x-1 rounded-full opacity-0 transition-all group-hover:w-[10px] group-hover:opacity-100`,
          className,
        )}
      ></span>
      <ChevronRight size={16} className="transition-all group-hover:translate-x-1" />
    </span>
  );
};
