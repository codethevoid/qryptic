import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { AreaChart, Globe, Leaf, Link, Link2, QrCode, Triangle, Zap } from "lucide-react";

export const Highlights = () => {
  return (
    <div className="border-b border-t bg-background/60 px-4 py-8">
      <MaxWidthWrapper className="space-y-6">
        {/* <div>
          <p className="text-center text-lg font-bold">Free plan</p>
          <p className="text-center text-sm text-muted-foreground">
            Get started with our free plan and upgrade anytime, no credit card required. Our free
            plan includes:
          </p>
        </div>
        <div className="mx-auto flex max-w-3xl items-center space-x-4">
          <div className="flex w-full items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
              <Link2 className="h-[14px] w-[14px]" />
            </div>
            <p className="text-[13px] font-medium">20 branded links</p>
          </div>
          <div className="flex w-full items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
              <QrCode className="h-[14px] w-[14px]" />
            </div>
            <p className="text-[13px] font-medium">20 QR codes</p>
          </div>
          <div className="flex w-full items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
              <Globe className="h-[14px] w-[14px]" />
            </div>
            <p className="text-[13px] font-medium">1 Custom domain</p>
          </div>
          <div className="flex w-full items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
              <AreaChart className="h-[14px] w-[14px]" />
            </div>
            <p className="text-[13px] font-medium">30-day analytics</p>
          </div>
        </div> */}
        <div className="space-y-4">
          {/* <div>
            <p className="text-center text-xs font-medium uppercase text-muted-foreground">
              Pick up the pace with Qryptic
            </p>
          </div> */}
          <div className="grid grid-cols-3 gap-20 max-md:grid-cols-1 max-md:gap-10">
            <div className="space-y-2.5">
              <Leaf size={16} className="mx-auto" />
              <div>
                <p className="text-center text-[13px] font-medium">Super lightweight</p>
                <p className="text-center text-xs text-muted-foreground max-md:mx-auto max-md:max-w-[300px]">
                  All the essentials you need without the unnecessary feature bloat weighing you
                  down.
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <Zap size={16} className="mx-auto" />
              <div>
                <p className="text-center text-[13px] font-medium">Lightning fast</p>
                <p className="text-center text-xs text-muted-foreground max-md:mx-auto max-md:max-w-[300px]">
                  Get users to their destination quickly. Qryptic ensures that every redirect is
                  optimized for speed.
                </p>
              </div>
            </div>
            <div className="space-y-2.5">
              <Triangle size={16} className="mx-auto" />
              <div>
                <p className="text-center text-[13px] font-medium">Modern interface</p>
                <p className="text-center text-xs text-muted-foreground max-md:mx-auto max-md:max-w-[300px]">
                  Enjoy an interface that&apos;s crafted to make navigation and usage
                  straightforward and visually appealing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
