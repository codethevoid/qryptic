import { HTMLAttributes, useEffect } from "react";
import { ProgressTabIcon } from "@/components/ui/custom/progress-tab-icon";
import { JSX } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { isMobile } from "react-device-detect";

type ProgressNumTabProps = HTMLAttributes<HTMLDivElement> & {
  label: string;
  count: number;
  percent: number;
  url?: string;
  icon?: JSX.Element;
  selected?: boolean;
  flag?: string;
  alt?: string;
  actualPercent?: number;
  type?: "num" | "percent";
  onlyIcon?: boolean;
  showIcon?: boolean;
};

export const ProgressNumTab = ({
  label,
  count,
  percent,
  url,
  icon,
  selected,
  flag,
  alt,
  type = "num",
  actualPercent,
  onlyIcon = false,
  showIcon = true,
  ...props
}: ProgressNumTabProps) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // Set to actual percent after a small delay
    const timeout = setTimeout(() => {
      setWidth(percent);
    }, 10); // Small delay to trigger the transition

    return () => clearTimeout(timeout); // Clear timeout on unmount
  }, [percent]);

  return (
    <div
      className="group relative px-3 transition-colors hover:bg-accent/40"
      role="button"
      {...props}
    >
      <div className="relative py-1.5">
        <div className="relative z-10 flex items-center justify-between space-x-3 px-3">
          <div className={cn("flex min-w-0 items-center space-x-2", showIcon && "space-x-2")}>
            {showIcon && (
              <ProgressTabIcon
                url={url}
                icon={icon as JSX.Element}
                flag={flag}
                alt={alt}
                onlyIcon={onlyIcon}
              />
            )}
            <p className="min-w-0 truncate text-[13px]">{label}</p>
          </div>
          <p className="text-[13px]">
            {type === "num"
              ? count.toLocaleString("en-us")
              : `${Math.round(actualPercent as number)}%`}
          </p>
        </div>
        <span
          className="absolute top-0.5 z-0 h-[calc(100%-4px)] rounded-md bg-accent ease-in-out dark:bg-accent/60"
          style={{ width: `${width}%`, transition: "width 750ms" }}
        />
      </div>
      <span
        className={cn(
          "absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-primary transition-all ease-in group-hover:h-[31.5px]",
          selected && "h-[31.5px]",
          isMobile && !selected && "group-hover:h-0",
        )}
      />
    </div>
  );
};
