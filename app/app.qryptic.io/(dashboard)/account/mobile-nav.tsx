"use client";

import { useUser } from "@/lib/hooks/swr/use-user";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { cn } from "@/lib/utils";

const linkItems = [
  {
    name: "General",
    href: "/account",
  },
  {
    name: "Security",
    href: "/account/security",
  },
  {
    name: "Teams",
    href: "/account/teams",
  },
];

export const AccountMobileNav = () => {
  const { user, isLoading } = useUser();
  const path = usePathname();

  return (
    <div className="mb-6 hidden space-y-3 max-md:block">
      <div className="flex items-center space-x-2">
        <Avatar className="h-4 w-4 border">
          <AvatarImage src={user?.image as string} alt={user?.name as string} />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        {isLoading ? (
          <Skeleton className="h-3.5 w-20" />
        ) : (
          <p className="max-w-[176px] truncate text-xs font-medium text-muted-foreground">
            {user?.name || user?.email}
          </p>
        )}
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
            <NextLink href={`${item.href}`}>{item.name}</NextLink>
          </Button>
        ))}
      </div>
    </div>
  );
};
