import { ReactNode } from "react";
import { TeamSettingsNav } from "@/components/layout/navigation/team-settings-nav";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {/* <div className="relative left-1/2 z-0 -mt-8 mb-8 w-screen -translate-x-1/2 border-b border-border/70 bg-zinc-50 dark:bg-zinc-950 max-[768px]:-mt-4">
        <MaxWidthWrapper>
          <p className="text-xl font-bold">Team settings</p>
        </MaxWidthWrapper>
      </div> */}
      <div className="flex space-x-10">
        <TeamSettingsNav />
        <div className="w-full min-w-0">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
