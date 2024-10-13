"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { cn } from "@/lib/utils";
import { QrCodeTypePicker } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/qr-code/type-picker";
import { StandardQr } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/qr-code/standard-qr";
import { AiQr } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/qr-code/ai-qr";

export const QrCodeProperties = () => {
  const { tab, qrCodeType, setQrCodeType } = useLinkForm();

  return (
    <div className={cn("space-y-4", tab !== "qr" && "hidden")}>
      {qrCodeType === null && <QrCodeTypePicker />}
      {qrCodeType === "standard" && <StandardQr />}
      {qrCodeType === "ai" && <AiQr />}
      {/*{qrCodeType !== null && (*/}
      {/*  <p className="text-sm" onClick={() => setQrCodeType(null)}>*/}
      {/*    Change type*/}
      {/*  </p>*/}
      {/*)}*/}
    </div>
  );
};
