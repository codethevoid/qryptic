import { ReactNode } from "react";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { AccountNav } from "@/app/app.qryptic.io/(dashboard)/account/nav";

const AccountSettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* <div className="relative left-1/2 z-0 -mt-8 mb-8 w-screen -translate-x-1/2 border-b border-border/70 px-4 py-6 max-[768px]:-mt-4">
        <MaxWidthWrapper>
          <p className="text-xl font-bold">Account settings</p>
        </MaxWidthWrapper>
      </div> */}
      <div className="flex space-x-10">
        <AccountNav />
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default AccountSettingsLayout;
