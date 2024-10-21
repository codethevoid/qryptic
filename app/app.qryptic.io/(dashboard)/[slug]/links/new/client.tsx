"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/nav";
import { LinkPreview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/preview";
import { LinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/form/form";
import { LinkFormProvider } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useRouter } from "next/navigation";

export const NewLinkClient = () => {
  return (
    <LinkFormProvider>
      <div className="flex space-x-10">
        <NewLinkNav />
        <LinkForm />
        <LinkPreview />
      </div>
      <NewLinkSnackbar />
    </LinkFormProvider>
  );
};

const NewLinkSnackbar = () => {
  const { slug } = useParams();
  const { submitForm, isSubmitting, destination } = useLinkForm();
  const router = useRouter();
  return (
    <div className="fixed bottom-6 left-1/2 flex w-auto -translate-x-1/2 items-center justify-between space-x-3 rounded-full border bg-background py-2 pl-3.5 pr-2.5 shadow-[0_6px_20px] shadow-foreground/15 dark:shadow-none">
      <p className="text-nowrap text-[13px] text-muted-foreground">New short link</p>
      <Separator orientation="vertical" className="h-5 bg-border" />
      <div className="flex items-center space-x-1.5">
        {/*<Button size="icon" variant="outline" className="rounded-full">*/}
        {/*  <TableProperties size={14} />*/}
        {/*</Button>*/}
        <Button
          size="sm"
          variant="outline"
          className="rounded-full"
          onClick={() => router.push(`/${slug}/links`)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="w-[91px] rounded-full"
          disabled={isSubmitting || !destination}
          onClick={submitForm}
        >
          {isSubmitting ? <ButtonSpinner /> : "Create link"}
        </Button>
      </div>
    </div>
  );
};
