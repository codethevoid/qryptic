"use client";

import Image from "next/image";
import { useState, JSX } from "react";
import { FC } from "react";

type LinkFaviconProps = {
  url?: string;
  icon: JSX.Element;
  flag?: string;
  alt?: string;
  onlyIcon?: boolean;
};

export const ProgressTabIcon: FC<LinkFaviconProps> = ({ url, icon, flag, alt, onlyIcon }) => {
  const [isError, setIsError] = useState(false);

  if (onlyIcon) return <div className="shrink-0">{icon}</div>;

  return (
    <div className="shrink-0">
      {!isError && url && url !== "direct" ? (
        <Image
          src={`https://www.google.com/s2/favicons?sz=64&domain_url=${url}`}
          alt={url}
          className="h-4 w-4 rounded-full"
          height={64}
          width={64}
          quality={100}
          onError={() => setIsError(true)}
        />
      ) : flag && !isError ? (
        <Image
          src={flag}
          alt={alt || "Country flag"}
          height={30}
          width={40}
          quality={100}
          className="h-3 w-4"
          onError={() => setIsError(true)}
        />
      ) : (
        <>{icon}</>
      )}
    </div>
  );
};
