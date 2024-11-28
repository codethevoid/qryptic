import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import NextLink from "next/link";
import { LinkBadge } from "@/components/ui/custom/link-badge";

export const Hero = () => {
  return (
    <div>
      <div className="-mb-6 flex flex-col items-center justify-center overflow-x-hidden px-4">
        <MaxWidthWrapper className="space-y-8">
          <div className="space-y-6">
            <LinkBadge
              href="/blog/company-news/new-exclusive-short-domain-qx-one"
              label="Exlusive short domain is now live"
            />
            <div className="space-y-2">
              <h1 className="text-center text-4xl font-bold tracking-tight max-md:text-3xl max-[500px]:mx-auto max-[500px]:max-w-[340px]">
                Your{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                  complete{" "}
                </span>
                link management platform
              </h1>
              <p className="mx-auto max-w-xl text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
                Qryptic gives you with the tools to create and track your links and QR codes.
                Enhance your brand, engage your audience, and measure your success.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-4">
              {/* <div className="flex w-full max-w-md items-center rounded-full border p-2 shadow-lg backdrop-blur-sm">
              <Input
                className="rounded-full border-none bg-transparent shadow-none focus-visible:ring-0"
                placeholder="https://example.com/my-long-link"
                /> */}
              <Button
                className="w-full max-w-[200px] rounded-full max-sm:max-w-none"
                size="lg"
                asChild
              >
                <a href={`${protocol}${appDomain}/register`}>Start generating</a>
              </Button>
              <Button
                variant="outline"
                className="w-full max-w-[200px] rounded-full backdrop-blur max-sm:max-w-none"
                size="lg"
                asChild
              >
                <NextLink href="/pricing">View pricing</NextLink>
              </Button>
              {/* </div> */}
              {/* <Button variant="outline" className="rounded-full" size="lg">
              View pricing
              </Button> */}
            </div>
          </div>
          <div className="min-w-[580px] pb-6 max-[400px]:min-w-[500px]">
            <NextImage
              src="https://cdn.qryptic.io/main/landing/hero-dark.png"
              alt="Qryptic analytics dashboard"
              priority
              height={1308}
              width={2318}
              quality={100}
              className="transform:perspective(4101px)_rotateX(51deg)_rotateY(-13deg)_rotateZ(40deg)] hidden w-full rounded-xl border shadow-lg dark:block"
            />
            <NextImage
              src="https://cdn.qryptic.io/main/landing/hero-light.png"
              alt="Qryptic analytics dashboard"
              priority
              height={1314}
              width={2302}
              quality={100}
              className="w-full rounded-xl border shadow-lg dark:hidden"
            />
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
};
