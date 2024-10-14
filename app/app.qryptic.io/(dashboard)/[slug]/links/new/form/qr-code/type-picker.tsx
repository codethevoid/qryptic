"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Upgrade } from "@/components/modals/plans/upgrade/upgrade";
import { useState } from "react";

export const QrCodeTypePicker = () => {
  const { team } = useTeam();
  const { setQrCodeType } = useLinkForm();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const handlePick = (type: "ai" | "standard") => {
    setQrCodeType(type);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4 rounded-lg border p-4 shadow">
          <div className="space-y-2">
            <Image
              src="https://qryptic.s3.amazonaws.com/main/standard-qr.png"
              alt="Standad QR"
              width={218}
              height={218}
              quality={100}
              className="h-[218px] w-[218px] rounded-md"
            />
            <div className="space-y-0.5">
              <p className="text-[13px] font-medium">Standard QR code</p>
              <p className="text-xs text-muted-foreground">
                Customize your QR code colors and add a logo to match your brand.
              </p>
            </div>
          </div>
          <Button size="sm" className="w-full" onClick={() => handlePick("standard")}>
            Customize QR code
          </Button>
        </div>
        <div className="space-y-4 rounded-lg border p-4 shadow">
          <div className="space-y-2">
            <Image
              src="https://qryptic.s3.amazonaws.com/main/qr-ai.png"
              alt="AI QR"
              width={768}
              height={768}
              quality={100}
              className="rounded-md"
            />
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <p className="text-[13px] font-medium">Generate with AI</p>
                {team?.plan.isFree && (
                  <Badge variant="neutral" className="px-1.5 py-0 text-[11px]">
                    Pro
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Let AI generate a unique eye-catching QR code for you.
              </p>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full"
            onClick={() => {
              if (team?.plan.isFree) {
                setIsUpgradeOpen(true);
              } else {
                handlePick("ai");
              }
            }}
          >
            {team?.plan.isFree ? "Upgrade to Pro" : "Generate with AI"}
          </Button>
        </div>
      </div>
      <Upgrade isOpen={isUpgradeOpen} setIsOpen={setIsUpgradeOpen} />
    </>
  );
};
