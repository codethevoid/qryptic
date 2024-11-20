import { ChevronArrow } from "../chevron-arrow";
import NextLink from "next/link";

export const LinkBadge = () => {
  return (
    <NextLink
      href="/blog/company-news/new-exclusive-short-domain-qx-one"
      className="group mx-auto flex w-fit cursor-pointer items-center space-x-1 rounded-full border bg-background px-3 py-1 transition-colors hover:border-primary/30"
    >
      <p className="text-[13px] font-medium">Exlusive short domain is now live</p>
      <ChevronArrow className="bg-black dark:bg-white" />
    </NextLink>
  );
};
