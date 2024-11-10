import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const LinksSkeleton = () => {
  return (
    <div className="rounded-lg border">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          className={cn("flex justify-between space-x-2.5 px-3 py-2.5", i !== 0 && "border-t")}
          key={i}
        >
          <div className="flex items-center space-x-2.5">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[14px] w-32" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
};
