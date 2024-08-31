"use client";

import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { appDomain, protocol } from "@/lib/domains";
import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { useScrollPosition } from "@/components/hooks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { Card } from "@/components/ui/card";

const products = [];

export const MainNav = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const scrollPos = useScrollPosition();

  return (
    <div
      className={`sticky top-0 z-50 border-b border-transparent px-4 py-2 ${scrollPos > 50 ? "border-border bg-background/85 backdrop-blur" : undefined}`}
    >
      <MaxWidthWrapper className="flex items-center justify-between">
        <Link href="/" passHref>
          <QrypticLogo />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <NavigationMenu delayDuration={100}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="cursor-auto">Product</NavigationMenuTrigger>
                <NavigationMenuContent></NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="cursor-auto">Solutions</NavigationMenuTrigger>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/pricing" passHref legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Pricing
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="cursor-auto">Resources</NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <Sun size={16} className="absolute opacity-0 dark:opacity-100" />
            <MoonStar size={16} className="absolute opacity-100 dark:opacity-0" />
          </Button>

          <Button size="sm" variant="ghost" className="ml-1 rounded-full" asChild>
            <Link href={`${protocol}${appDomain}/login`} passHref>
              Log in
            </Link>
          </Button>
          <Button size="sm" className="to cyan-500 group ml-3 rounded-full" asChild>
            <Link href="/pricing" passHref>
              Get started
            </Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
