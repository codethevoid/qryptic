import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const TeamSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="space-y-5 p-4 shadow-sm">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-transparent">
                  <Skeleton className="h-full w-full rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex h-10 flex-col justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
            <Skeleton className="h-[22px] w-20 self-start rounded-full" />
          </div>
          <Skeleton className="h-[27.5px] max-w-[170px] rounded-full" />
          <div className="flex h-5 space-x-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </Card>
      ))}
    </div>
  );
};
