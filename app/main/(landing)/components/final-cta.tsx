import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import NextImage from "next/image";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { protocol, appDomain } from "@/utils/qryptic/domains";

export const FinalCta = () => {
  return (
    <div className="px-4 max-sm:overflow-x-hidden">
      <MaxWidthWrapper className="max-sm:-pb-6 -mb-40 space-y-8 max-md:-mb-[136px] max-sm:-mb-0">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-center text-3xl font-bold tracking-tight max-md:text-2xl">
              <span className="bg-gradient-to-r from-emerald-500 to-lime-500 bg-clip-text text-transparent">
                Amplify
              </span>{" "}
              every link you create
            </h2>
            <p className="mx-auto max-w-xl text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
              Understanding how your links perform should feel effortless. Gain insights, analyze
              trends, and optimize your connections all in one place.
            </p>
          </div>
          <div className="mx-auto max-w-[240px] max-sm:max-w-none">
            <a className="w-full" href={`${protocol}${appDomain}/register`}>
              <RainbowButton className="w-full rounded-full text-sm transition-all hover:scale-[103%]">
                Start creating for free
              </RainbowButton>
            </a>
          </div>
        </div>
        <div className="relative z-[-1] min-w-[580px] max-sm:pb-1 max-[400px]:min-w-[500px]">
          <NextImage
            src="https://cdn.qryptic.io/main/landing/hero-dark.png"
            alt="Qryptic analytics dashboard"
            height={1308}
            width={2318}
            quality={100}
            className="mx-auto hidden w-full max-w-[900px] rounded-xl border shadow-sm dark:block"
          />
          <NextImage
            src="https://cdn.qryptic.io/main/landing/hero-light.png"
            alt="Qryptic analytics dashboard"
            height={1314}
            width={2302}
            quality={100}
            className="mx-auto w-full max-w-[900px] rounded-xl border shadow-sm dark:hidden"
          />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
