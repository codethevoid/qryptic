import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { AreaChart, Globe, Link2, QrCode } from "lucide-react";

export const Trust = () => {
  return (
    <div className="border-b border-t bg-background/60 px-4 py-6">
      <MaxWidthWrapper className="space-y-6">
        <div>
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
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
