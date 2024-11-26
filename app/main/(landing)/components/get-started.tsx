import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronArrow } from "@/components/ui/chevron-arrow";
import NextLink from "next/link";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Infinity,
  Fingerprint,
  Sparkles,
  ShieldCheck,
  Link2,
  QrCode,
  Globe,
  ChartArea,
} from "lucide-react";
import { appDomain, protocol } from "@/utils/qryptic/domains";

export const GetStarted = () => {
  return (
    <div className="px-4">
      <MaxWidthWrapper>
        <Card className="col-span-3 rounded-xl border shadow-sm">
          <div className="grid grid-cols-2 gap-6 p-12 max-md:grid-cols-1 max-md:p-6">
            <div>
              <p className="text-2xl font-extrabold tracking-tight max-sm:text-xl">
                Qryptic{" "}
                <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                  free plan
                </span>
              </p>
              <p className="mt-6 max-w-[370px] text-sm max-md:mt-2 max-sm:text-[13px] max-sm:text-muted-foreground">
                Get started with all the essentials included in your free plan and upgrade anytime.
              </p>
              <Button
                className="group mt-8 flex h-10 w-full max-w-[300px] justify-between rounded-full max-md:mt-4 max-sm:max-w-none"
                asChild
              >
                <a href={`${protocol}${appDomain}/register`}>
                  <span>Start for free</span>
                  <ChevronArrow className="bg-white dark:bg-black" />
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-x-4 gap-y-8 max-sm:grid-cols-1 max-sm:grid-rows-4 max-sm:gap-y-6">
              <div className="flex flex-col space-y-2 max-sm:space-y-1.5">
                <Feature
                  icon={<Link2 size={16} />}
                  feature="20 links per month"
                  className="font-medium text-foreground"
                />
                <p className="text-[13px] text-muted-foreground max-sm:max-w-[240px]">
                  Effortlessly generate personalized links for your needs.
                </p>
              </div>
              <div className="flex flex-col space-y-2 max-sm:space-y-1.5">
                <Feature
                  icon={<QrCode size={16} />}
                  feature="20 QR codes per month"
                  className="font-medium text-foreground"
                />
                <p className="text-[13px] text-muted-foreground max-sm:max-w-[240px]">
                  Instantly create QR codes for each of your short links.
                </p>
              </div>
              <div className="flex flex-col space-y-2 max-sm:space-y-1.5">
                <Feature
                  icon={<Globe size={16} />}
                  feature="1 custom domain"
                  className="font-medium text-foreground"
                />
                <p className="text-[13px] text-muted-foreground max-sm:max-w-[240px]">
                  Enhance your brand by using your own domain for all links.
                </p>
              </div>
              <div className="flex flex-col space-y-2 max-sm:space-y-1.5">
                <Feature
                  icon={<ChartArea size={16} />}
                  feature="30 days of analytics"
                  className="font-medium text-foreground"
                />
                <p className="text-[13px] text-muted-foreground max-sm:max-w-[240px]">
                  Track your link performance with up to 30 days of insights.
                </p>
              </div>
            </div>
            {/* <Button
              className="group hidden h-10 w-full max-w-[300px] justify-between rounded-full max-sm:flex max-sm:max-w-none"
              asChild
            >
              <a href={`${protocol}${appDomain}/register`}>
                <span>Start for free</span>
                <ChevronArrow className="bg-white dark:bg-black" />
              </a>
            </Button> */}
          </div>
        </Card>
      </MaxWidthWrapper>
    </div>
  );
};

type FeatureProps = {
  icon: ReactNode;
  feature: string | ReactNode;
  className?: string;
};

const Feature = ({ icon, feature, className }: FeatureProps) => {
  return (
    <div className="flex items-center space-x-2.5">
      {icon}
      <p className={cn("text-[13px] text-muted-foreground", className)}>{feature}</p>
    </div>
  );
};
