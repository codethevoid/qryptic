import { constructMetadata } from "@/utils/construct-metadata";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { GodRays } from "@/components/layout/god-rays";
export const metadata = constructMetadata({
  title: `Qryptic | Link banned`,
  description: "The link you are trying to reach has been banned",
  noIndex: true,
});

const LinkBannedPage = () => {
  return (
    <>
      <GodRays />
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-background">
            <QrypticIcon className="h-[18px]" />
          </div>
          <div className="mb-8 mt-6 flex flex-col space-y-2">
            <p className="text-center text-3xl font-bold tracking-tight">Link banned</p>
            <p className="text-center text-muted-foreground">
              The link you are trying to reach has been banned
            </p>
          </div>
          <Button className="w-[200px]" asChild>
            <NextLink href={`${protocol}${rootDomain}`}>Go to Qryptic</NextLink>
          </Button>
        </div>
      </div>
    </>
  );
};

export default LinkBannedPage;
