"use client";

import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { protocol, rootDomain } from "@/utils/qryptic/domains";

export const SecurityClient = () => {
  return (
    <div className="flex h-60 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white shadow-sm dark:from-accent/10 dark:to-accent">
          <Key size={15} />
        </div>
        <div className="space-y-0.5">
          <p className="text-center text-sm font-medium">Single Sign-on</p>
          <p className="text-center text-[13px] text-muted-foreground">
            Configure single sign-on for your team
          </p>
        </div>
        <Button size="sm" className="w-full max-w-[200px]" asChild>
          <NextLink href={`${protocol}${rootDomain}/contact`} passHref target="_blank">
            Contact sales
          </NextLink>
        </Button>
      </div>
    </div>
  );
};
