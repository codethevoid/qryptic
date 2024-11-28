import { ChevronArrow } from "../chevron-arrow";
import NextLink from "next/link";

type Props = {
  href: string;
  label: string;
};

export const LinkBadge = ({ href, label }: Props) => {
  return (
    <NextLink
      href={href}
      className="group mx-auto flex w-fit cursor-pointer items-center space-x-1 rounded-full border bg-background px-3 py-[3px] transition-colors hover:border-primary/30"
    >
      <p className="text-[13px] font-medium">{label}</p>
      <ChevronArrow className="bg-black dark:bg-white" />
    </NextLink>
  );
};
