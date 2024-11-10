"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { linkItems } from "./team-settings-nav";
import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useTeam } from "@/lib/hooks/swr/use-team";

export const TeamSettingsMobileNav = () => {
  const { slug } = useParams();
  const { team } = useTeam();
  const path = usePathname();

  return (
    <div className="mb-6 hidden space-y-3 max-md:block">
      <div className="flex items-center space-x-2">
        <Avatar className="h-4 w-4 border">
          <AvatarImage src={team?.image} alt={team?.name} />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <p className="max-w-[176px] truncate text-xs font-medium text-muted-foreground">
          {team?.name}
        </p>
      </div>
      <div className="mb-4 flex overflow-x-auto scrollbar-hide">
        {linkItems.map((item, i) => (
          <Button
            className={cn(
              "h-7 space-x-2 text-muted-foreground",
              path.endsWith(item.href) &&
                "bg-zinc-100 text-foreground hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-900",
            )}
            variant="ghost"
            size="sm"
            asChild
            key={item.href}
          >
            <NextLink href={`/${slug}${item.href}`}>{item.name}</NextLink>
          </Button>
        ))}
      </div>
    </div>
  );
};
