"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/nav";
import { LinkPreview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/preview";
import { LinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/form";
import { LinkFormProvider } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";

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
