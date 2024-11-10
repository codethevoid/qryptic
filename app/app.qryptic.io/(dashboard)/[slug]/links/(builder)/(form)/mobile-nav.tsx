"use client";

import { linkItems } from "./nav";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLinkForm } from "./context";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export const LinkMobileNav = () => {
  const { team } = useTeam();
  const { tab, setTab } = useLinkForm();

  return (
    <div className="mb-6 hidden space-y-3 max-lg:block">
      <div className="flex items-center space-x-2">
        <Avatar className="h-4 w-4 border">
          <AvatarImage src={team?.image} alt={team?.name} />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <p className="max-w-[176px] truncate text-xs font-medium text-muted-foreground">
          Link details
        </p>
      </div>
      <div className="mb-4 flex gap-1.5 overflow-x-auto scrollbar-hide">
        {linkItems.map((item, i) => (
          <Button
            size="sm"
            variant="outline"
            key={item.value}
            onClick={() => setTab(item.value)}
            // className={cn(
            //   "h-7 space-x-2 text-muted-foreground hover:bg-zinc-100 hover:text-muted-foreground dark:hover:bg-zinc-900",
            //   tab === item.value &&
            //     "bg-zinc-100 text-foreground hover:text-foreground dark:bg-zinc-900",
            // )}
            className={cn("h-7 space-x-2", tab === item.value && "bg-accent/60")}
          >
            {item.icon}
            <span>{item.name}</span>
            {item.isPro && team?.plan.isFree && (
              <Badge variant="neutral" className="px-1.5 py-0 text-[11px]">
                Pro
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};
