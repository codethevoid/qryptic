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
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { downloadPNG, downloadSVG } from "@/lib/links/qr-code-download";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { CodeXml, ImageIcon } from "lucide-react";

const constructUrl = (domain: string, slug: string) => {
  return `https://${domain}/${slug}?qr=1`;
};

type DownloadQrCodeProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const DownloadQrCode = ({ isOpen, setIsOpen }: DownloadQrCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const [type, setType] = useState<"svg" | "png">("png");
  const { color, logo, logoDimensions, domain, slug } = useLinkForm();
  const { slug: teamSlug } = useParams();

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    const filename = `qrcode-${teamSlug}-${slug}.${type}`;

    if (type === "svg") {
      downloadSVG(svg as SVGSVGElement, filename);
    } else {
      downloadPNG(
        svg as SVGSVGElement,
        logo,
        { height: logoDimensions.height * 16, width: logoDimensions.width * 16 },
        filename,
        2048,
        2048,
      );
    }
  };

  useEffect(() => {
    if (isOpen) setType("png");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Download QR code</CompactDialogTitle>
          <CompactDialogDescription>
            Download QR code in your selected format.
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
          <div className="space-y-1.5">
            {/*<p className="text-[13px] font-medium">Select your preferred format</p>*/}
            <div className="space-y-2">
              <div
                role="button"
                className={cn(
                  "flex items-center space-x-2.5 rounded-lg border p-2 transition-all hover:bg-accent/40",
                  type === "png" && "border-primary bg-accent/40",
                )}
                onClick={() => setType("png")}
              >
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                  <ImageIcon size={14} />
                </div>
                <div>
                  <p className="text-[13px]">Download as PNG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for printing and social media.
                  </p>
                </div>
              </div>
              <div
                role="button"
                className={cn(
                  "flex items-center space-x-2.5 rounded-lg border p-2 transition-all hover:bg-accent/40",
                  type === "svg" && "border-primary bg-accent/40",
                )}
                onClick={() => setType("svg")}
              >
                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent">
                  <CodeXml size={14} />
                </div>
                <div>
                  <p className="text-[13px]">Download as SVG</p>
                  <p className="text-xs text-muted-foreground">
                    Best for websites and digital media.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleDownload} className="w-[117px]">
            Download {type.toUpperCase()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
