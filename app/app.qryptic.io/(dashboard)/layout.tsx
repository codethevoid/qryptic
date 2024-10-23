import { ReactNode } from "react";
import { AppNav } from "@/components/layout/navigation/app-nav";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({});

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AppNav />
      <div className="overflow-x-hidden px-4 pb-24 pt-8">
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </div>
    </>
  );
};

export default DashboardLayout;
