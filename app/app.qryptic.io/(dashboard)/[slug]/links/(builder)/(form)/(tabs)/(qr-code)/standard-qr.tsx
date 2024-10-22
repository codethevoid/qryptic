"use client";

import { ChangeEvent, KeyboardEvent, useEffect, useRef } from "react";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { QRCodeSVG } from "qrcode.react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Badge } from "@/components/ui/badge";
import { HexColorPicker } from "react-colorful";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { X, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { qrypticLogo } from "@/lib/constants/images";

const constructUrl = (domain: string, slug: string) => {
  return `https://${domain}/${slug}?qr=1`;
};

// black, red, orange, yellow, green, blue, purple, pink, brown, gray
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

export const StandardQr = ({ mode }: { mode: "new" | "edit" }) => {
  const { team } = useTeam();
  const {
    domain,
    slug,
    color,
    setColor,
    logoType,
    setLogoType,
    logo,
    setLogo,
    logoDimensions,
    setLogoDimensions,
    setLogoFile,
    setLogoFileType,
  } = useLinkForm();
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mode === "edit") return;
    if (team) {
      if (team?.plan.isFree) {
        setLogo(qrypticLogo);
        setLogoDimensions({ width: 34, height: 34 });
        setLogoType("qryptic");
      } else {
        setLogo(team.image);
        setLogoDimensions({ width: 34, height: 34 });
        setLogoType("team");
      }
    }
  }, [team]);

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const pattern = new RegExp(/^[a-zA-Z0-9#]+$/);
    if (value.length === 0) {
      setColor("#");
    } else {
      pattern.test(value) && setColor(value);
    }
  };

  const handleColorKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "#") e.preventDefault();
  };

  const calcPercentDiff = (a: number, b: number) => {
    return Math.abs((a - b) / a) * 100;
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || team?.plan.isFree) return;
    const file = e.target.files[0];
    if (!file) return;

    // check file size and type
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      return toast.error("File size is too large.", {
        description: "Please upload an image that is less than 2MB.",
      });
    }

    // get image dimensions
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const { width, height } = img;
      let maxSize: number;
      const percentDiff = calcPercentDiff(height, width);
      if (percentDiff < 20) {
        // image is basically a square
        maxSize = 34;
      } else if (percentDiff > 20 && percentDiff < 50) {
        // image is a standard rectangle
        maxSize = 48;
      } else {
        // image is skinny rectangle
        maxSize = 60;
      }

      // update the logo state and set the logo dimensions
      const aspect = width / height;
      // set new height and width based on aspect ratio
      const newWidth = aspect > 1 ? maxSize : maxSize * aspect;
      const newHeight = aspect > 1 ? maxSize / aspect : maxSize;

      setLogoDimensions({
        width: newWidth,
        height: newHeight,
      });
      setLogo(URL.createObjectURL(file));
      setLogoType("custom");
    };

    const reader = new FileReader();
    reader.onload = () => {
      setLogoFile(reader.result as string);
      setLogoFileType(file.type);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <div className="flex w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
        <div ref={qrRef} className="rounded-md border bg-white p-3">
          <QRCodeSVG
            value={constructUrl(domain?.name as string, slug)}
            level="H"
            fgColor={color.length === 7 ? color : "#000000"}
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
      </div>
      <div className="mt-4">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium">Custom color</p>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
              <div className="flex">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 rounded-r-none border-r-0 active:!scale-100"
                      disabled={team?.plan.isFree}
                    >
                      <span
                        className="h-4 w-4 rounded-sm"
                        style={{ backgroundColor: color.length === 7 ? color : "#000000" }}
                      ></span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-auto border-0 p-0">
                    <HexColorPicker
                      color={color.length === 7 ? color : "#000000"}
                      onChange={setColor}
                    />
                  </PopoverContent>
                </Popover>
                <Input
                  value={color}
                  onChange={(e) => handleColorChange(e)}
                  onKeyDown={(e) => handleColorKeyDown(e)}
                  className="h-8 w-28 rounded-l-none"
                  maxLength={7}
                  onBlur={() => setColor(color.length === 7 ? color : "#000000")}
                  disabled={team?.plan.isFree}
                />
              </div>
              <div className="flex space-x-1">
                {colorOptions.map((c) => (
                  <div
                    role="button"
                    key={c}
                    className={cn(
                      "h-6 w-6 rounded-full border transition-all active:scale-[98%]",
                      color === c && "ring-1 ring-primary ring-offset-1",
                    )}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <p className="text-[13px] font-medium">Custom logo</p>
              {team?.plan.isFree && (
                <Badge variant="neutral" className="px-1.5 py-0 text-[11px]">
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className={cn(
                  "flex h-10 w-10 items-center justify-center p-0",
                  logoType === "qryptic" && "border-primary bg-accent/60",
                )}
                onClick={() => {
                  setLogo(qrypticLogo);
                  setLogoDimensions({ width: 34, height: 34 });
                  setLogoType("qryptic");
                  setLogoFile(null);
                  setLogoFileType(null);
                }}
              >
                <QrypticIcon className="h-[18px] w-[18px]" />
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "flex h-10 w-10 items-center justify-center p-0",
                  logoType === "team" && "border-primary bg-accent/60",
                )}
                disabled={team?.plan.isFree}
                onClick={() => {
                  setLogo(team.image);
                  setLogoDimensions({ height: 34, width: 34 });
                  setLogoType("team");
                  setLogoFileType(null);
                  setLogoFile(null);
                }}
              >
                <Avatar className="h-5 w-5 rounded-full border">
                  <AvatarImage src={team?.image} alt={team?.name} />
                </Avatar>
              </Button>
              <div>
                <input
                  id="file"
                  type="file"
                  accept={"image/png, image/jpeg, image/jpg"}
                  hidden
                  onChange={(e) => handleImageUpload(e)}
                  disabled={team?.plan.isFree}
                />
                <label
                  aria-disabled={team?.plan.isFree}
                  htmlFor="file"
                  className={cn(
                    "flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-all hover:bg-accent/60 active:scale-[98%]",
                    logoType === "custom" && "border-primary bg-accent/60",
                    team?.plan.isFree && "pointer-events-none cursor-default opacity-50",
                  )}
                  role="button"
                >
                  <ImageIcon size={18} />
                </label>
              </div>
              <Button
                variant="outline"
                className={cn(
                  "flex h-10 w-10 items-center justify-center p-0",
                  !logo && "border-primary bg-accent/60",
                )}
                disabled={team?.plan.isFree}
                onClick={() => {
                  setLogo(null);
                  setLogoDimensions({ width: 0, height: 0 });
                  setLogoType(null);
                  setLogoFile(null);
                  setLogoFileType(null);
                }}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
