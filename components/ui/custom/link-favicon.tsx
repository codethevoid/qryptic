"use client";

import Image from "next/image";
import { useState } from "react";
import { FC } from "react";
import { Link2, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

type LinkFaviconProps = {
  link: { destination: string; events: { type: "click" | "scan" }[] };
};

export const LinkFavicon: FC<LinkFaviconProps> = ({ link }) => {
  const [isError, setIsError] = useState(false);

  const clicksOrScans = (events: { type: "click" | "scan" }[]) => {
    let clicks = 0;
    let scans = 0;
    events.forEach((event) => {
      if (event.type === "click") {
        clicks++;
      } else {
        scans++;
      }
    });

    return clicks >= scans ? "clicks" : "scans";
  };

  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border shadow-sm",
        isError && "bg-gradient-to-tr from-accent/10 to-accent",
      )}
    >
      {!isError ? (
        <Image
          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${link.destination}`}
          alt={link.destination}
          className="h-5 w-5 rounded-full"
          height={64}
          width={64}
          quality={100}
          onError={() => setIsError(true)}
        />
      ) : (
        <>
          {clicksOrScans(link.events) === "clicks" ? (
            <Link2 size={13} className="-rotate-45" />
          ) : (
            <QrCode size={13} />
          )}
        </>
      )}
    </div>
  );
};
