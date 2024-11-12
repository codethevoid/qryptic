"use client";

import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

import { appDomain, protocol } from "@/utils/qryptic/domains";

export const StartNow = () => {
  return (
    <div className="px-4">
      <MaxWidthWrapper className="flex flex-col">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-background max-md:h-[52px] max-md:w-[52px]">
          <QrypticIcon className="h-[18px] max-md:h-[16px]" />
        </div>
        <div className="mb-8 mt-6 flex flex-col space-y-2 max-sm:mb-6">
          <p className="text-center text-3xl font-bold tracking-tight max-md:text-2xl max-sm:text-xl">
            Take your brand to the next level
            {/*<span className="background-animate bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">*/}
            {/*  brand*/}
            {/*</span>{" "}*/}
            {/*to the next level*/}
          </p>
          <p className="text-center text-muted-foreground max-md:text-sm max-sm:mx-auto max-sm:max-w-[320px] max-sm:text-[13px]">
            Give Qryptic a try and see why it's a favorite among teams and enterprises alike.
          </p>
        </div>
        <div className="flex items-center justify-center max-sm:flex-col max-sm:space-y-4">
          {/* <DarkButton />
          <LightButton /> */}
          <Button size="lg" className="w-full max-w-[200px] rounded-full max-sm:max-w-none" asChild>
            <a href={`${protocol}${appDomain}/register`}>Start for free</a>
          </Button>
          <Button
            size="lg"
            className="ml-4 w-full max-w-[200px] rounded-full border backdrop-blur dark:hover:bg-accent/5 max-sm:ml-0 max-sm:max-w-none"
            variant="outline"
            asChild
          >
            <Link href="/contact">Contact sales</Link>
          </Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

const DarkButton = () => {
  return (
    <div className="background-animate hidden w-full max-w-[200px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 p-[1px] dark:inline-flex max-sm:max-w-none">
      <Button
        className="animate-shadow-dark h-[34px] w-full rounded-full bg-background/90 text-foreground hover:bg-transparent hover:text-white"
        asChild
      >
        <Link href={`${protocol}${appDomain}/login`}>Start for free</Link>
      </Button>
    </div>
  );
};

const LightButton = () => {
  return (
    <div className="background-animate w-full max-w-[200px] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 p-[1px] dark:hidden max-sm:max-w-none">
      <Button
        className="animate-shadow h-[34px] w-full rounded-full bg-background/90 text-foreground hover:bg-transparent hover:text-white"
        asChild
      >
        <Link href={`${protocol}${appDomain}/login`}>Start for free</Link>
      </Button>
    </div>
  );
};
