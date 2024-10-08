import Image from "next/image";
import { XIcon } from "@/components/ui/icons/x-icon";

export const LinkPreview = () => {
  return (
    <div className="w-full max-w-[300px]">
      <div className="w-full space-y-2 rounded-lg border p-4 shadow-sm">
        <div>
          <p className="text-[13px] font-medium">Link Previews</p>
          <p className="text-xs text-muted-foreground">See how your link will look when shared.</p>
        </div>
        {/*<div>*/}
        {/*  <XIcon className="h-3.5 w-3.5" />*/}
        {/*</div>*/}
        {0 ? (
          <Image
            src={
              "https://png.pngtree.com/thumb_back/fh260/background/20230720/pngtree-cool-neon-star-4k-uhd-glowing-abstract-background-in-blue-and-image_3705285.jpg"
            }
            width={1200}
            height={630}
            alt="image"
            className="rounded-md"
          />
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-md border bg-zinc-50 dark:bg-zinc-950">
            <p className="text-xs text-muted-foreground">No preview available</p>
          </div>
        )}
      </div>
    </div>
  );
};
