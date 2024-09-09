import { ReactNode } from "react";
import { TeamSettingsNav } from "@/components/layout/navigation/team-settings-nav";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

const SettingsLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <div className="relative left-1/2 z-0 -mt-8 mb-8 w-screen -translate-x-1/2 border-b border-border/70 bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
        <MaxWidthWrapper>
          <p className="text-xl font-bold">Team settings</p>
        </MaxWidthWrapper>
      </div>
      <div className="flex space-x-10">
        <TeamSettingsNav />
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};

export default SettingsLayout;
