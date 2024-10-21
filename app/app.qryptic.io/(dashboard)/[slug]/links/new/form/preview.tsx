import Image from "next/image";
import { XIcon } from "@/components/ui/icons/x-icon";
import { Image as ImageIcon, Pencil, Linkedin } from "lucide-react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FC, useEffect } from "react";
import { FacebookIcon } from "@/components/ui/icons/facebook";
import { Skeleton } from "@/components/ui/skeleton";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { useOpenGraph } from "@/lib/hooks/swr/use-open-graph";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { cn } from "@/lib/utils";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};

export const LinkPreview: FC = () => {
  const { team } = useTeam();
  const {
    title,
    image,
    destination,
    setTab,
    ogUrl,
    setTitle,
    setImage,
    setOgUrl,
    setDescription,
    setImageFile,
    setImageType,
    isSubmitting,
    submitForm,
  } = useLinkForm();

  const debouncedDestination = useDebounce(destination?.split("?")[0], 500);

  const { data, isLoading, error } = useOpenGraph(debouncedDestination);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setImage(data.image);
      setOgUrl(data.url);
      setImageFile(null);
      setImageType(null);
    }
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="min-w-[300px] max-w-[300px]">
        <div className="w-full rounded-lg border p-4 shadow">
          <div className={`${team?.plan.isFree ? "space-y-0.5" : "space-y-0"}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <p className="text-[13px] font-medium">Link Preview</p>
                {team?.plan.isFree && (
                  <Badge variant="neutral" className="px-1.5 py-0 text-[11px]">
                    Pro
                  </Badge>
                )}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="flex h-5 w-5 rounded-md text-muted-foreground"
                onClick={() => setTab("preview")}
              >
                <Pencil size={12} />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              See how your link will look when shared.
            </p>
          </div>
          {isLoading || destination?.split("?")[0] !== debouncedDestination?.split("?")[0] ? (
            <LoadingPreview />
          ) : error || !image ? (
            <NoPreview />
          ) : (
            <div className="mt-4 space-y-6">
              <XPreview title={title} image={image} url={ogUrl || debouncedDestination} />
              <FacebookPreview title={title} image={image} url={ogUrl || debouncedDestination} />
              <LinkedInPreview title={title} image={image} url={ogUrl || debouncedDestination} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const XPreview = ({ image, title, url }: { image: string; title: string; url: string }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <XIcon className="relative bottom-[0.5px] h-3 w-3" />
        <span className="text-[13px] font-medium">X (formerly Twitter)</span>
      </div>
      <div className="space-y-1">
        <div className="relative aspect-[1200/630]">
          <Image
            src={image}
            width={1200}
            height={630}
            alt={title}
            className="h-full w-full rounded-lg object-cover"
          />
          {title && (
            <div className="absolute bottom-2 left-2 rounded-sm bg-black/70 px-1 py-0.5">
              <p className="max-w-[232px] truncate text-xs text-white">{title}</p>
            </div>
          )}
        </div>
        <p className="ml-0.5 line-clamp-1 text-xs text-muted-foreground">From {formatUrl(url)}</p>
      </div>
    </div>
  );
};

const FacebookPreview = ({ image, title, url }: { image: string; title: string; url: string }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5">
        <FacebookIcon className="relative bottom-[1px] h-4 w-4" />
        <p className="text-[13px] font-medium">Facebook</p>
      </div>
      <div className="border">
        <div className="aspect-[1200/630]">
          <Image
            src={image}
            width={1200}
            height={630}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className={cn("border-t bg-zinc-50 p-2 dark:bg-zinc-900/50", title && "space-y-0.5")}>
          <p className="line-clamp-1 text-xs text-muted-foreground">{formatUrl(url)}</p>
          <p className="line-clamp-2 text-[12.5px] font-medium leading-snug">{title}</p>
          {/*<p className="line-clamp-2 text-xs text-muted-foreground">*/}
          {/*  {description || "No description"}*/}
          {/*</p>*/}
        </div>
      </div>
    </div>
  );
};

const LinkedInPreview = ({ title, image, url }: { title: string; image: string; url: string }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1.5">
        <Linkedin className="relative bottom-0.5 h-3.5 w-3.5" />
        <p className="text-[13px] font-medium">LinkedIn</p>
      </div>
      <div className="rounded-lg border p-2.5">
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-[1200/630] overflow-hidden rounded-md">
            <Image
              src={image}
              width={1200}
              height={630}
              alt={title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex h-full flex-col justify-between py-0.5">
            <p className="line-clamp-2 text-[12.5px] font-medium leading-snug">{title}</p>
            <p className="line-clamp-1 text-xs text-muted-foreground">{formatUrl(url)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const NoPreview = () => {
  return (
    <div className="mt-3 flex h-36 w-full flex-col items-center justify-center space-y-2 rounded-lg border bg-zinc-50 dark:bg-zinc-950">
      <ImageIcon size={18} className="text-muted-foreground" />
      <p className="text-xs text-muted-foreground">No preview available</p>
    </div>
  );
};

const LoadingPreview = () => {
  return (
    <Skeleton className="mt-3 flex h-36 w-full flex-col items-center justify-center space-y-2 rounded-lg border">
      {/*<LoaderCircle size={18} className="animate-spin text-muted-foreground" />*/}
    </Skeleton>
  );
};
