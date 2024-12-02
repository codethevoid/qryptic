"use client";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import {
  Link2,
  Info,
  CornerDownLeft,
  CornerDownRight,
  MousePointerClick,
  Settings,
  Settings2,
  Cog,
  FlaskRound,
  TestTubeDiagonal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import NextImage from "next/image";
import { CopyButton } from "@/components/ui/custom/copy-button";
import { Badge } from "@/components/ui/badge";
import FlickeringGrid from "@/components/ui/flickering-grid";
import { QRCodeSVG } from "qrcode.react";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LinkOptions } from "./link-options";
import { type Tab } from "@/types/links";

type CustomTab = Omit<Tab, "qr" | "general">;

type Link = {
  ogImage: string;
  ogTitle: string;
  ogDescription: string;
  _count: { events: number };
};

const colorOptions = [
  "#000000",
  "#b60000",
  "#cb5700",
  "#b6ac00",
  "#48b000",
  "#0072c0",
  "#8100c2",
  "#b00078",
  "#7e3f00",
];

const darkColorOptions = [
  "#ffffff", // White - no change needed
  "#ff4d4d", // Brightened red
  "#ff8c1a", // Brightened orange
  "#e0e000", // Brightened yellow-green
  "#70e000", // Brightened green
  "#0099ff", // Brightened blue
  "#a64dff", // Brightened purple
  "#ff1a8c", // Brightened pink
  "#a65a00", // Brightened brown
];

const getHeroLink = async () => {
  try {
    const res = await fetch("/api/landing/hero-link", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const LinkBuilder = () => {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState("#ffffff");
  const [showLogo, setShowLogo] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [link, setLink] = useState<Link | null>(null);
  const [accordionOpen, setIsAccordionOpen] = useState(false);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [activeTab, setActiveTab] = useState<CustomTab | null>(null);

  useEffect(() => {
    setColor(resolvedTheme === "dark" ? "#ffffff" : "#000000");
  }, [resolvedTheme]);

  useEffect(() => {
    getHeroLink()
      .then((data) => {
        setLink(data);
        setIsLoading(false);
      })
      .catch(() => {
        setLink({
          ogImage: "",
          ogTitle: "",
          ogDescription: "",
          _count: { events: 500 },
        });
        setIsLoading(false);
      });
  }, []);

  console.log(link);

  return (
    <>
      <div className="mx-auto w-full max-w-md space-y-2 rounded-xl border bg-zinc-50 p-2 shadow-sm dark:bg-zinc-900 max-sm:max-w-none">
        <div className="relative">
          <Link2
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-45 text-muted-foreground"
          />
          <Input
            className="w-full bg-background pl-[34px] pr-[34px]"
            placeholder="https://app.qryptic.io/register"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                linkRef.current?.click();
              }
            }}
          />
          <Button
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-md"
            variant="ghost"
            asChild
          >
            <a href={`${protocol}${appDomain}/register`} ref={linkRef}>
              <CornerDownLeft size={15} />
            </a>
          </Button>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-background px-2.5 py-2 shadow-sm">
          <div className="flex items-center space-x-2">
            <div
              className={
                "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm"
              }
            >
              <NextImage
                src={`https://cdn.qryptic.io/logos/qryptic-qr-icon.png`}
                alt="qryptic favicon"
                className="h-5 w-5 rounded-full"
                height={64}
                width={64}
                quality={100}
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1">
                <a
                  href={`https://qx.one/rgstr`}
                  target="_blank"
                  className="cursor-pointer truncate text-[13px] hover:underline"
                >
                  {`qx.one/rgstr`}
                </a>
                <CopyButton text={`https://qx.one/rgstr`} />
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <CornerDownRight size={12} className="shrink-0" />
                <a
                  href={"https://app.qryptic.io/register"}
                  className="truncate hover:underline"
                  target="_blank"
                >
                  {`app.qryptic.io/register`}
                </a>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {isLoading ? (
              <Skeleton className="h-[22px] w-[80px] rounded-full max-sm:w-[40px]" />
            ) : (
              <Badge
                variant="neutral"
                className="relative flex h-[22px] items-center space-x-1 px-2 text-[11px]"
              >
                {isLoading ? (
                  <Skeleton className="h-[18px] w-[18px] rounded-full" />
                ) : (
                  <>
                    <MousePointerClick size={13} />
                    <span>{link?._count?.events?.toLocaleString("en-us") || 0}</span>
                    <span className="max-sm:hidden">events</span>
                  </>
                )}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsAccordionOpen(!accordionOpen)}
            >
              <Cog size={14} />
            </Button>
          </div>
        </div>
        <Accordion value={accordionOpen ? "settings" : ""} type="single" onValueChange={() => {}}>
          <AccordionItem value="settings" className="rounded-lg border bg-background shadow-sm">
            <AccordionTrigger
              onClick={() => setIsAccordionOpen(!accordionOpen)}
              className={cn(
                "mx-2.5 border-b border-transparent py-2 text-[13px] font-normal",
                accordionOpen && "border-border",
              )}
            >
              <span className="flex items-center space-x-1.5">
                <FlaskRound size={14} className="relative bottom-[0.5px]" /> <span>The portal</span>
              </span>
            </AccordionTrigger>
            <AccordionContent className={cn("px-2.5 pb-2")}>
              <LinkOptions activeTab={activeTab} setActiveTab={setActiveTab} link={link} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className="relative z-10 flex w-full items-center justify-center overflow-hidden rounded-lg border bg-background px-4 py-6 shadow-sm">
          <FlickeringGrid
            className="absolute inset-0 top-0.5 z-[-1] hidden size-full w-full dark:block"
            color="#fff"
            height={300}
            width={600}
            gridGap={4}
            squareSize={2}
          />

          <FlickeringGrid
            className="absolute inset-0 top-0.5 z-[-1] size-full w-full dark:hidden"
            color="#000"
            height={300}
            width={600}
            gridGap={4}
            squareSize={2}
          />

          <div className="rounded-md border bg-background p-2">
            <QRCodeSVG
              className="hidden dark:block"
              value={"https://qx.one/rgstr?qr=1"}
              level="H"
              bgColor={"#000000"}
              fgColor={color}
              height={80}
              width={80}
              imageSettings={
                showLogo
                  ? {
                      src: "https://cdn.qryptic.io/logos/qryptic-qr-icon-light.png",
                      height: 34,
                      width: 34,
                      excavate: true,
                    }
                  : undefined
              }
            />
            <QRCodeSVG
              className="dark:hidden"
              value={"https://qx.one/rgstr?qr=1"}
              level="H"
              bgColor={"#ffffff"}
              fgColor={color === "#ffffff" ? "#000000" : color}
              height={80}
              width={80}
              imageSettings={
                showLogo
                  ? {
                      src: "https://cdn.qryptic.io/logos/qryptic-qr-icon.png",
                      height: 34,
                      width: 34,
                      excavate: true,
                    }
                  : undefined
              }
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-lg border bg-background p-2.5 shadow-sm">
          <div className="flex items-center space-x-2">
            <SmallSwitch checked={showLogo} onCheckedChange={setShowLogo} id="hide-logo" />
            <Label htmlFor="hide-logo" className="font-normal">
              Logo
            </Label>
          </div>

          <div className="flex space-x-1 dark:hidden">
            {colorOptions.map((c: string) => (
              <div
                role="button"
                key={c}
                className={cn(
                  "h-[18px] w-[18px] rounded-full border transition-all active:scale-[98%]",
                  color === c && "ring-1 ring-primary ring-offset-1",
                )}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="hidden space-x-1 dark:flex">
            {darkColorOptions.map((c: string) => (
              <div
                role="button"
                key={c}
                className={cn(
                  "h-[18px] w-[18px] rounded-full border transition-all active:scale-[98%]",
                  color === c && "ring-1 ring-primary ring-offset-1",
                )}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>
        <div className="flex space-x-1.5 rounded-lg rounded-md border bg-background px-2 py-1 shadow-sm">
          <Info size={14} className="relative top-[3px] text-muted-foreground" />
          <p className="text-[13px] text-muted-foreground max-sm:text-[12px]">
            <a href={`${protocol}${appDomain}/register`} className="text-foreground underline">
              Sign up
            </a>{" "}
            to start creating and tracking your links.
          </p>
        </div>
      </div>
    </>
  );
};
