import {
  CompactDialogDescription,
  CompactDialogHeader,
  CompactDialogTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { downloadPNG, downloadSVG } from "@/lib/links/qr-code-download";
import { useParams } from "next/navigation";

const constructUrl = (domain: string, slug: string) => {
  return `https://${domain}/${slug}?qr=1`;
};

type DownloadQrCodeProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const DownloadQrCode = ({ isOpen, setIsOpen }: DownloadQrCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<"svg" | "png">("svg");
  const [isLoading, setIsLoading] = useState(false);
  const { color, logo, logoDimensions, domain, slug } = useLinkForm();
  const { slug: teamSlug } = useParams();

  const handleDownload = () => {
    setIsLoading(true);
    const svg = qrRef.current?.querySelector("svg");
    const filename = `qrcode-${teamSlug}-${slug}.${type}`;

    if (type === "svg") {
      downloadSVG(svg as SVGSVGElement, filename);
    } else {
      downloadPNG(svg as SVGSVGElement, filename, 2048, 2048);
    }

    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Download QR code</CompactDialogTitle>
          <CompactDialogDescription>
            Download your QR code in your selected format.
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div ref={qrRef} className="mx-auto w-fit rounded-md border bg-white p-2">
            <QRCodeSVG
              value={constructUrl(domain?.name as string, slug)}
              level="H"
              fgColor={color.length === 7 ? color : "#000000"}
              height={80}
              width={80}
              imageSettings={
                logo
                  ? {
                      src: logo,
                      ...logoDimensions,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleDownload} className="w-[117px]" disabled={isLoading}>
            Download {type.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
