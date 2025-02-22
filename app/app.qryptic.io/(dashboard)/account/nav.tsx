"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useUserSettings } from "@/lib/hooks/swr/use-user-settings";
import { useUser } from "@/lib/hooks/swr/use-user";

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

export const AccountNav = () => {
  const path = usePathname();
  const { user, isLoading } = useUser();

  return (
    <div className="flex min-w-[200px] max-w-[200px] flex-col max-lg:min-w-[180px] max-md:hidden">
      <div className="mb-3 flex items-center space-x-2">
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
      {linkItems.map((item, i) => (
        <Button
          className={`justify-start transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 ${path.endsWith(item.href) ? "text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
          variant="ghost"
          size="sm"
          asChild
          key={item.href}
        >
          <NextLink href={`${item.href}`}>{item.name}</NextLink>
        </Button>
      ))}
    </div>
  );
};
