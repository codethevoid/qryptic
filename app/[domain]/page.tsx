import { Metadata } from "next";
import { constructMetadata } from "@/utils/construct-metadata";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { GodRays } from "@/components/layout/god-rays";

export const generateMetadata = async ({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> => {
  const domain = params.domain;
  return constructMetadata({
    title: `Qryptic | ${domain}`,
    description: `${domain} is a custom domain on ${process.env.NEXT_PUBLIC_APP_NAME}`,
  });
};

const RootDomainPage = ({ params }: { params: { domain: string } }) => {
  return (
    <>
      <GodRays />
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border bg-background">
            <QrypticIcon className="h-[18px]" />
          </div>
          <div className="mb-8 mt-6 flex flex-col space-y-2">
            <p className="text-center text-3xl font-bold tracking-tight">
              You&apos;ve arrived at Qryptic
            </p>
            <p className="text-center text-muted-foreground">
              <span className="text-teal-500">{params.domain} </span>
              is a custom domain on {process.env.NEXT_PUBLIC_APP_NAME}
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

export default RootDomainPage;
