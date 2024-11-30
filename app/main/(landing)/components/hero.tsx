import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import NextLink from "next/link";
import { LinkBadge } from "@/components/ui/custom/link-badge";
import { RainbowButton } from "@/components/ui/rainbow-button";
import FlickeringGrid from "@/components/ui/flickering-grid";

export const Hero = () => {
  return (
    <div>
      {/* <ParticlesBg /> */}
      <div className="-mb-6 flex flex-col items-center justify-center px-4">
        <MaxWidthWrapper className="space-y-8">
          <div className="space-y-6">
            <LinkBadge
              href="/blog/company-news/new-exclusive-short-domain-qx-one"
              label="Introducing our premium domain"
            />
            <div className="space-y-2">
              <h1 className="text-center text-4xl font-bold tracking-tight max-md:text-3xl max-[500px]:mx-auto max-[500px]:max-w-[340px]">
                {/* Your{" "}
                <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                  complete{" "}
                </span> */}
                Your complete link management platform
              </h1>
              <p className="mx-auto max-w-xl text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
                Qryptic gives you the tools to create and track your links and QR codes. Manage your
                links, engage your audience, and track your success.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 max-sm:flex-col max-sm:space-x-0 max-sm:space-y-4">
              {/* <div className="flex w-full max-w-md items-center rounded-full border p-2 shadow-lg backdrop-blur-sm">
              <Input
                className="rounded-full border-none bg-transparent shadow-none focus-visible:ring-0"
                placeholder="https://example.com/my-long-link"
                /> */}
              <a
                className="w-full max-w-[200px] max-sm:max-w-none"
                href={`${protocol}${appDomain}/register`}
              >
                <RainbowButton className="w-full rounded-full text-sm">
                  Start generating
                </RainbowButton>
              </a>
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
          {/* <div className="mx-auto h-40 w-full max-w-md space-y-2 rounded-xl border bg-background p-2.5 shadow-sm">
            <Input placeholder="https://example.com/my-long-link" className="bg-background" />
            <div className="relative z-10 h-20 w-full overflow-hidden rounded-lg border shadow-sm">
              <FlickeringGrid
                className="absolute inset-0 top-0 z-[-1] hidden size-full w-full dark:block"
                color="#fff"
                height={300}
                width={600}
                squareSize={3}
              />

              <FlickeringGrid
                className="absolute inset-0 z-[-1] size-full w-full dark:hidden"
                color="#000"
                height={300}
                width={600}
                squareSize={3}
              />
            </div>
          </div> */}
          {/* <div className="grid grid-cols-3 gap-2">
            <div className="flex h-40 items-center justify-center rounded-l-2xl rounded-r-md border bg-background p-4 shadow-sm">
              <div className="space-y-2">
                <h3 className="text-center text-lg font-semibold">Link management</h3>
                <p className="text-center text-sm text-muted-foreground">
                  Create and manage your links with ease.
                </p>
                <Button variant="outline" size="sm">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="h-40 rounded-md rounded-l-md border bg-background p-4 shadow-sm"></div>
            <div className="h-40 rounded-l-md rounded-r-2xl border bg-background p-4 shadow-sm"></div>
          </div> */}
          <div className="relative min-w-[580px] pb-6 max-[400px]:min-w-[500px]">
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
