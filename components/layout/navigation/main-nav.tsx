"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { appDomain, protocol } from "@/lib/domains";
import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";

export const MainNav = () => {
  const { setTheme, resolvedTheme } = useTheme();
  return (
    <div className="sticky top-0 z-50 border-b bg-background/85 px-4 py-2 backdrop-blur">
      <MaxWidthWrapper className="flex items-center justify-between">
        <Link href="/" passHref>
          <QrypticLogo />
        </Link>
        <div></div>
        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <Sun size={16} className="absolute opacity-0 transition-all dark:opacity-100" />
            <MoonStar size={16} className="absolute opacity-100 transition-all dark:opacity-0" />
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
