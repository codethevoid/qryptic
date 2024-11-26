"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link2, Radar, Check, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { Skeleton } from "@/components/ui/skeleton";
// http://testsafebrowsing.appspot.com/s/malware.html

const successVerdict =
  "Our tests indicate no signs of malicious activity. However, it's important to remain vigilant and practice safe browsing habits.";

type Threat = "MALWARE" | "UNWANTED_SOFTWARE" | "SOCIAL_ENGINEERING";

export const RadarClient = () => {
  const [inputValue, setInputValue] = useState("");
  const [url, setUrl] = useState("https://vercel.com");
  const [isLoading, setIsLoading] = useState(false);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [isError, setIsError] = useState(false);

  const onSubmit = async () => {
    if (!inputValue) return toast.error("Please enter a URL");
    try {
      new URL(inputValue);
    } catch (e) {
      return toast.error("Enter a valid URL");
    }
    setUrl(inputValue);
    setIsLoading(true);
    setIsError(false);
    setThreats([]);
    try {
      const res = await fetch(`/api/lab/radar?url=${inputValue}`);
      if (!res.ok) {
        setIsLoading(false);
        setIsError(true);
        toast.error("An error occurred while scanning the URL");
        return;
      }
      const data = await res.json();
      setInputValue("");
      setIsError(false);
      setThreats(data.threats);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      setIsError(true);
      console.error("Error in radar client: ", e);
      toast.error("An error occurred while scanning the URL");
    }
  };

  return (
    <div className="mx-auto max-w-[440px] space-y-2 rounded-xl border bg-zinc-50 p-2 shadow-lg dark:bg-zinc-900 max-sm:max-w-none">
      <div className="relative">
        <Link2
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-45 text-muted-foreground"
        />
        <Input
          className="w-full bg-background pl-[34px] pr-[34px]"
          placeholder="https://vercel.com"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSubmit();
          }}
          disabled={isLoading}
        />
        <Button
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md"
          variant="ghost"
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? <ButtonSpinner /> : <Radar size={15} />}
        </Button>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          URL
        </p>
        <div className="flex min-w-0">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="min-w-0 truncate px-3 text-[13px] text-muted-foreground hover:underline"
          >
            {url}
          </a>
        </div>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          Threat tests
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3">
            <p className="text-[13px] text-muted-foreground">Malware</p>
            <Badge
              variant={
                isLoading
                  ? "neutral"
                  : isError
                    ? "warning"
                    : threats.includes("MALWARE")
                      ? "error"
                      : "success"
              }
              className="px-1.5 py-0 text-[10px] uppercase"
            >
              {isLoading
                ? "Testing..."
                : isError
                  ? "Error"
                  : threats.includes("MALWARE")
                    ? "Detected"
                    : "Passed"}
            </Badge>
          </div>
          <div className="flex items-center justify-between px-3">
            <p className="text-[13px] text-muted-foreground">Unwanted software</p>
            <Badge
              variant={
                isLoading
                  ? "neutral"
                  : isError
                    ? "warning"
                    : threats.includes("UNWANTED_SOFTWARE")
                      ? "error"
                      : "success"
              }
              className="px-1.5 py-0 text-[10px] uppercase"
            >
              {isLoading
                ? "Testing..."
                : isError
                  ? "Error"
                  : threats.includes("UNWANTED_SOFTWARE")
                    ? "Detected"
                    : "Passed"}
            </Badge>
          </div>
          <div className="flex items-center justify-between px-3">
            <p className="text-[13px] text-muted-foreground">Social engineering</p>
            <Badge
              variant={
                isLoading
                  ? "neutral"
                  : isError
                    ? "warning"
                    : threats.includes("SOCIAL_ENGINEERING")
                      ? "error"
                      : "success"
              }
              className="px-1.5 py-0 text-[10px] uppercase"
            >
              {isLoading
                ? "Testing..."
                : isError
                  ? "Error"
                  : threats.includes("SOCIAL_ENGINEERING")
                    ? "Detected"
                    : "Passed"}
            </Badge>
          </div>
        </div>
      </div>
      <div className="space-y-2 rounded-lg border bg-background p-2 shadow-sm">
        <p className="rounded-md border bg-zinc-50 px-3 py-1 text-[13px] dark:bg-zinc-900/60">
          Verdict
        </p>
        {isLoading ? (
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : isError ? (
          <p className="px-3 text-[13px] text-muted-foreground">
            An error occurred while scanning the URL
          </p>
        ) : threats.length > 0 ? (
          <p className="px-3 text-[13px] text-red-600">
            {threats.length === 1
              ? threats[0].split("_").join(" ").charAt(0) +
                threats[0].split("_").join(" ").slice(1).toLowerCase()
              : threats.length === 2
                ? `${threats[0].split("_").join(" ").charAt(0) + threats[0].split("_").join(" ").slice(1).toLowerCase()} and ${threats[1].split("_").join(" ").charAt(0) + threats[1].split("_").join(" ").slice(1).toLowerCase()}`
                : `${threats[0].split("_").join(" ").charAt(0) + threats[0].split("_").join(" ").slice(1).toLowerCase()}, ${threats[1].split("_").join(" ").charAt(0) + threats[1].split("_").join(" ").slice(1).toLowerCase()}, and ${threats[2].split("_").join(" ").charAt(0) + threats[2].split("_").join(" ").slice(1).toLowerCase()}`}{" "}
            {threats.length > 1 ? " have" : " has"} been detected. We do not recommend clicking this
            link. Please proceed with caution.
          </p>
        ) : (
          <p className="px-3 text-[13px] text-muted-foreground">{successVerdict}</p>
        )}
      </div>
    </div>
  );
};
