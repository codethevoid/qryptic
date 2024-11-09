import { Skeleton } from "@/components/ui/skeleton";

export const TagsSkeleton = () => {
  return (
    <div>
      <div className="rounded-lg border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            className={`${i !== 4 ? "border-b" : undefined} flex items-center justify-between space-x-2.5 px-3 py-2.5 transition-all`}
            key={i}
          >
            <div className="flex items-center space-x-2.5">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-[22px] w-20 rounded-full" />
            </div>
            <div className="flex items-center space-x-2.5">
              {/* <Skeleton className="h-[22px] w-20 rounded-full" /> */}
              {/* <Skeleton className="h-[22px] w-24 rounded-full" /> */}
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
