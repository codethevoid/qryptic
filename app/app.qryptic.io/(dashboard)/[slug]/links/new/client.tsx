"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/nav";
import { LinkPreview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/preview";
import { LinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form";
import { LinkFormProvider } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";

type Tab =
  | "general"
  | "device"
  | "utm"
  | "geo"
  | "cloaking"
  | "protection"
  | "qr"
  | "expiration"
  | "cards"
  | "indexing";

export const NewLinkClient = () => {
  return (
    <LinkFormProvider>
      <div className="flex space-x-10">
        <NewLinkNav />
        <LinkForm />
        <LinkPreview />
      </div>
    </LinkFormProvider>
  );
};
