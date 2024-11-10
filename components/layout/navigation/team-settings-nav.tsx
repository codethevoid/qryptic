"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeam } from "@/lib/hooks/swr/use-team";
export const linkItems = [
  {
    name: "General",
    href: "/settings",
  },
  {
    name: "Members",
    href: "/settings/members",
  },
  {
    name: "Billing",
    href: "/settings/billing",
  },
  {
    name: "Invoices",
    href: "/settings/invoices",
  },
  {
    name: "Usage",
    href: "/settings/usage",
  },
  {
    name: "Security",
    href: "/settings/security",
  },
];

export const TeamSettingsNav = () => {
  const path = usePathname();
  const { slug } = useParams();
  const { team } = useTeam();

  return (
    <div className="flex min-w-[200px] max-w-[200px] flex-col max-lg:min-w-[180px] max-md:hidden">
      <div className="mb-3 flex items-center space-x-2">
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
      {linkItems.map((item, i) => (
        <Button
          className={`justify-start transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 ${path.endsWith(item.href) ? "text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
          variant="ghost"
          size="sm"
          asChild
          key={item.href}
        >
          <NextLink href={`/${slug}${item.href}`}>{item.name}</NextLink>
        </Button>
      ))}
    </div>
  );
};
