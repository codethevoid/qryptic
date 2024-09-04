"use client";

import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { Suspense, useEffect, useRef, useState } from "react";
import { CSSProperties } from "react";
import { usePathname, useParams } from "next/navigation";
import { Bell, MoonStar, Sun } from "lucide-react";
import { ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/lib/hooks/swr/use-user";
import NextLink from "next/link";
import { AccountDropdown } from "@/components/layout/navigation/account-dropdown";

const linkItems = [
  { title: "Home", href: "/" },
  { title: "Links", href: "/links" },
  { title: "Analytics", href: "/analytics" },
  { title: "Domains", href: "/domains" },
  { title: "Tags", href: "/tags" },
  { title: "Team", href: "/team" },
  // { title: "Usage", href: "/usage" },
  { title: "Settings", href: "/settings" },
];

export const AppNav = () => {
  const path = usePathname();
  const { slug } = useParams();
  const { user } = useUser();
  const navRef = useRef<HTMLDivElement>(null);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({
    width: "0%",
    left: "0%",
  });

  const updateIndicatorStyle = (index: number) => {
    const navbarElement = navRef.current as HTMLDivElement;
    const targetElement = navbarElement.children[index + 1] as HTMLButtonElement;
    const width = targetElement.offsetWidth;
    const left = targetElement.offsetLeft;

    setIndicatorStyle({
      width: `${width}px`,
      transform: `translateX(${left}px)`,
    });
  };

  useEffect(() => {
    if (path === "/teams") return;
    // get the index of current path
    // will be /[slug]/[path] we need to match only [path]
    // need to get value of
    const definedPath = path.split("/")[2]?.toLowerCase();
    if (!definedPath) {
      setActiveIndex(0);
      updateIndicatorStyle(0);
      return;
    }

    const index = linkItems.findIndex((item) => item.href === `/${definedPath}`);

    setActiveIndex(index);
    updateIndicatorStyle(index);
  }, [path]);

  return (
    <div className="sticky top-0">
      <div className="border-b border-border/70 bg-zinc-50 px-4 py-2.5 dark:bg-zinc-950">
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <QrypticLogo />
            <div className="h-[20px] w-[1px] rotate-[30deg] border-r border-dashed border-zinc-400 dark:border-zinc-600"></div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-5 w-5 border">
                <AvatarFallback className="h-full w-full bg-gradient-to-r from-green-400 to-blue-400"></AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-2">
                <p className="truncate text-[13px] font-medium">Pryzma</p>
                <Badge variant="primary">Free</Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-5 text-muted-foreground hover:bg-accent"
              >
                <ChevronsUpDown size={14} />
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="outline" className="rounded-full shadow-none">
              <Bell size={14} />
            </Button>
            {/*<Avatar className="h-8 w-8 border">*/}
            {/*  <AvatarImage src={user?.image as string} alt={user?.name as string | undefined} />*/}
            {/*  <AvatarFallback className="bg-transparent">*/}
            {/*    <Skeleton className="h-full w-full rounded-full" />*/}
            {/*  </AvatarFallback>*/}
            {/*</Avatar>*/}
            <AccountDropdown user={user} />
          </div>
        </MaxWidthWrapper>
      </div>
      {path !== "/teams" && (
        <div className="border-b border-border/70 px-4 py-1.5">
          <MaxWidthWrapper>
            <div ref={navRef} className="relative flex items-center">
              <div
                className="absolute z-0 h-7 rounded-full bg-zinc-100 transition-all duration-300 ease-in-out dark:bg-zinc-900"
                style={indicatorStyle}
              ></div>
              {linkItems.map((item, index) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={`relative z-10 h-7 text-[13px] duration-200 hover:bg-transparent hover:text-foreground ${activeIndex === index ? "text-foreground" : "text-muted-foreground"}`}
                  onMouseEnter={() => updateIndicatorStyle(index)}
                  onMouseLeave={() => updateIndicatorStyle(activeIndex as number)}
                  onClick={() => {
                    setActiveIndex(index);
                    updateIndicatorStyle(index);
                  }}
                  asChild
                >
                  <NextLink href={`/${slug}${item.href}`}>{item.title}</NextLink>
                </Button>
              ))}
            </div>
          </MaxWidthWrapper>
        </div>
      )}
    </div>
  );
};
