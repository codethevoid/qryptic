import { Tag } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const TagsSkeleton = () => {
  return (
    <div className="h-[530px]">
      <div className="rounded-lg border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            className={`${i !== 4 ? "border-b" : undefined} flex items-center justify-between space-x-2.5 px-3 py-2.5 transition-all`}
            key={i}
          >
            <div className="flex items-center space-x-2.5">
              <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
                <Tag size={13} />
              </div>
              <Skeleton className="h-[22px] w-20 rounded-full" />
            </div>
            <div className="flex items-center space-x-2.5">
              <Skeleton className="h-[22px] w-20 rounded-full" />
              <Skeleton className="h-[22px] w-24 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
