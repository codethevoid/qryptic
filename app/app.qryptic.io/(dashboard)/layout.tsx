import { ReactNode } from "react";
import { AppNav } from "@/components/layout/navigation/app-nav";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AppNav />
      <div className="px-4 py-8">
        <MaxWidthWrapper>{children}</MaxWidthWrapper>
      </div>
    </>
  );
};

export default DashboardLayout;
