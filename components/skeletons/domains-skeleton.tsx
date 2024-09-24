"use client";

import { CornerDownRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const DomainsSkeleton = () => {
  return (
    <div className="space-y-5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-[18px] w-24" />
              </div>
              <div className="flex items-center space-x-3.5 pl-3.5">
                <CornerDownRight size={14} className="text-muted-foreground" />
                <div className="flex h-[19.5px] items-center">
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>
            <div className="flex h-8 items-center space-x-2.5 self-start">
              <Skeleton className="h-[22px] w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
