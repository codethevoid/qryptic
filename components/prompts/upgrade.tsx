"use client";

import { FC } from "react";
import { Stars } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { useState } from "react";

export const UpgradeToPro: FC<{ isProFeature: boolean }> = ({ isProFeature }) => {
  const { team } = useTeam();
  const [isOpen, setIsOpen] = useState(false);

  if (!isProFeature || !team?.plan.isFree) return null;

  return (
    <>
      <div className="flex h-52 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow dark:bg-zinc-950">
        <div className="flex flex-col items-center space-y-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border bg-background shadow-sm dark:bg-gradient-to-tr dark:from-accent/10 dark:to-accent">
            <Stars size={14} />
          </div>
          <div>
            <p className="text-center text-sm font-medium">Pro feature</p>
            <p className="mx-auto max-w-[300px] text-center text-[13px] text-muted-foreground">
              Upgrade to pro to access this feature
            </p>
          </div>
          <Button size="sm" onClick={() => setIsOpen(true)}>
            Upgrade to Pro
          </Button>
        </div>
      </div>
      <Upgrade isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
