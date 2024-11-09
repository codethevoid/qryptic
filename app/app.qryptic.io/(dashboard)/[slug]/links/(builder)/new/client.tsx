"use client";

import { NewLinkNav } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/nav";
import { LinkPreview } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/preview";
import { LinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/form";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useRouter } from "next/navigation";
import { LinkFormProvider } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { useState } from "react";
import { LinkMobileNav } from "../(form)/mobile-nav";

export const NewLinkClient = () => {
  const [isNavOpen, setIsNavOpen] = useState(false); // for mobile

  return (
    <LinkFormProvider>
      <LinkMobileNav />
      <div className="flex gap-10 max-lg:gap-6 max-sm:flex-col">
        <div className="max-lg:hidden">
          <NewLinkNav />
        </div>
        <LinkForm mode="new" />
        <LinkPreview mode="new" />
      </div>
      <NewLinkSnackbar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
    </LinkFormProvider>
  );
};

type Props = {
  isNavOpen: boolean;
  setIsNavOpen: (isNavOpen: boolean) => void;
};

const NewLinkSnackbar = ({ isNavOpen, setIsNavOpen }: Props) => {
  const { slug } = useParams();
  const { submitForm, isSubmitting, destination } = useLinkForm();
  const router = useRouter();
  return (
    <div className="fixed bottom-6 left-1/2 flex w-auto -translate-x-1/2 items-center justify-between space-x-3 rounded-full border bg-background py-2 pl-3.5 pr-2.5 shadow-[0_6px_20px] shadow-foreground/15 dark:shadow-none">
      <p className="text-nowrap text-[13px]">New short link</p>
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
        {/* <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          onClick={() => setIsNavOpen(true)}
        >
          <Menu size={14} />
        </Button> */}
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
