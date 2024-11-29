import { ChevronArrow } from "../chevron-arrow";
import NextLink from "next/link";
import { Separator } from "@/components/ui/separator";

type Props = {
  href: string;
  label: string;
};

export const LinkBadge = ({ href, label }: Props) => {
  return (
    <NextLink
      href={href}
      className="group mx-auto flex w-fit cursor-pointer items-center space-x-2 rounded-full border bg-zinc-50 px-3 py-[3px] transition-colors hover:border-primary/30 dark:bg-zinc-900"
    >
      <span className="text-sm">🎉</span>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center space-x-1">
        <p className="text-xs font-medium">{label}</p>
        <ChevronArrow className="bg-black dark:bg-white" />
      </div>
    </NextLink>
  );
};
