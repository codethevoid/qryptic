import { useParams, useRouter } from "next/navigation";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, QrCode } from "lucide-react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { DownloadQrCode } from "@/components/modals/links/download-qr-code";

export const EditLinkSnackbar = ({ mutate }: { mutate: () => Promise<void> }) => {
  const { slug } = useParams();
  const { editForm, isSubmitting, destination } = useLinkForm();
  const router = useRouter();
  const [isDownloadQrOpen, setIsDownloadQrOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 left-1/2 flex w-auto -translate-x-1/2 items-center justify-between space-x-3 rounded-full border bg-background py-2 pl-3.5 pr-2.5 shadow-[0_6px_20px] shadow-foreground/15 dark:shadow-none">
        <p className="text-nowrap text-[13px]">Edit short link</p>
        <Separator orientation="vertical" className="h-5 bg-border" />
        <div className="flex items-center space-x-1.5">
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => router.push(`/${slug}/links`)}
            disabled={isSubmitting}
          >
            <ChevronLeft size={14} />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full"
            onClick={() => setIsDownloadQrOpen(true)}
          >
            <QrCode size={14} />
          </Button>
          <Button
            size="sm"
            className="w-[110px] rounded-full"
            disabled={isSubmitting || !destination}
            onClick={async () => {
              const success = await editForm();
              if (success) await mutate();
            }}
          >
            {isSubmitting ? <ButtonSpinner /> : "Save changes"}
          </Button>
        </div>
      </div>
      <DownloadQrCode isOpen={isDownloadQrOpen} setIsOpen={setIsDownloadQrOpen} />
    </>
  );
};
