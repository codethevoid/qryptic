"use client";

import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { cn } from "@/lib/utils";
import { QrCodeTypePicker } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/qr-code/type-picker";
import { StandardQr } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/tabs/qr-code/standard-qr";
// import { AiQr } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/qr-code/ai-qr";
import { ArrowLeft } from "lucide-react";

export const QrCodeProperties = () => {
  const { tab, qrCodeType, setQrCodeType } = useLinkForm();

  return (
    <div className={cn("space-y-6", tab !== "qr" && "hidden")}>
      {/*{qrCodeType === null && <QrCodeTypePicker />}*/}
      {qrCodeType === "standard" && <StandardQr />}
      {/*{qrCodeType === "ai" && <AiQr />}*/}
      {/*{qrCodeType !== null && (*/}
      {/*  <p*/}
      {/*    role="button"*/}
      {/*    className="inline-flex w-fit items-center space-x-1 text-xs text-muted-foreground transition-colors hover:text-foreground"*/}
      {/*    onClick={() => setQrCodeType(null)}*/}
      {/*  >*/}
      {/*    <ArrowLeft size={12} />*/}
      {/*    <span>Change QR code type</span>*/}
      {/*  </p>*/}
      {/*)}*/}
    </div>
  );
};
