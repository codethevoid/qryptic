"use client";

import { Input } from "@/components/ui/input";
import { ImageIcon, Link2 } from "lucide-react";
import NextImage from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { KeyboardEvent } from "react";

export const UnveilClient = () => {
  const [enteredShortUrl, setEnteredShortUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("https://bit.ly/4g14yjZ");
  const [destination, setDestination] = useState("https://vercel.com");
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const onSubmit = async () => {
    if (!enteredShortUrl) return toast.error("Please enter a valid short URL");
    setIsFirstLoad(false);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/lab/unveil?url=${enteredShortUrl}`);
      if (!res.ok) {
        setIsLoading(false);
        const data = await res.json();
        toast.error(data.error);
        return;
      }

      const data = await res.json();
      setDestination(data.destination);
      setPreview(data.preview);
      setShortUrl(data.shortUrl);
      setIsLoading(false);
      setEnteredShortUrl("");
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  // add event listener for enter key to submit
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSubmit();
  };

  return (
    <div className="mx-auto max-w-[440px] space-y-2 rounded-xl border bg-zinc-50 p-2 dark:bg-zinc-900 max-sm:max-w-none">
      <div className="relative">
        <Link2
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-45 text-muted-foreground"
        />
        <Input
          className="w-full bg-background pl-[34px] pr-[34px]"
          placeholder="bit.ly/4g14yjZ"
          value={enteredShortUrl}
          disabled={isLoading}
          onChange={(e) => setEnteredShortUrl(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md"
          onClick={onSubmit}
          disabled={isLoading}
          variant="ghost"
        >
          {isLoading ? <ButtonSpinner /> : <WandSparkles size={15} />}
        </Button>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          Short link
        </p>
        <p className="px-3 text-[13px] text-muted-foreground">{shortUrl}</p>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          Destination
        </p>
        <p className="min-w-0 truncate px-3 text-[13px] text-muted-foreground">{destination}</p>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          Preview
        </p>
        {isLoading ? (
          <Skeleton className="aspect-[1920/1080] h-full w-full rounded-lg border" />
        ) : preview ? (
          <NextImage
            src={preview}
            alt="website-screenshot-preview"
            width={1920}
            height={1080}
            className="rounded-lg border"
            quality={100}
          />
        ) : !preview && !isFirstLoad ? (
          <div className="flex aspect-[1920/1080] h-full w-full items-center justify-center rounded-lg border bg-zinc-50 dark:bg-zinc-900/60">
            <div className="space-y-2">
              <ImageIcon size={15} className="mx-auto text-muted-foreground" />
              <p className="text-[13px] text-muted-foreground">No preview available</p>
            </div>
          </div>
        ) : (
          <>
            <NextImage
              src={"https://qryptic.s3.us-east-1.amazonaws.com/main/vercel-screenshot-dark.png"}
              alt="website-screenshot-preview"
              width={1920}
              height={1080}
              className="hidden rounded-lg border dark:block"
              quality={100}
              priority
            />
            <NextImage
              src={"https://qryptic.s3.us-east-1.amazonaws.com/main/vercel-screenshot.png"}
              alt="website-screenshot-preview"
              width={1920}
              height={1080}
              className="rounded-lg border dark:hidden"
              quality={100}
              priority
            />
          </>
        )}
      </div>
    </div>
  );
};
