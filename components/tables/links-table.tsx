import { TableLink } from "@/types/links";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { LinkFavicon } from "@/components/ui/custom/link-favicon";
import { CopyButton } from "@/components/ui/custom/copy-button";
import {
  Archive,
  ChartArea,
  Copy,
  CornerDownRight,
  MoreHorizontal,
  Pencil,
  Tag as TagIcon,
  Trash,
} from "lucide-react";
import { Tag } from "@/components/ui/custom/tag";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { FC } from "react";

type LinksTableProps = {
  links: TableLink[];
};

export const LinksTable: FC<LinksTableProps> = ({ links }) => {
  const { slug } = useParams();
  return (
    <div className="rounded-lg border">
      {links.map((link: TableLink, i: number) => (
        <NextLink
          href={`/${slug}/links/edit/${link.id}`}
          key={link.id}
          className={cn(
            "flex cursor-default items-center justify-between space-x-4 px-3 py-2.5 transition-colors hover:bg-accent/40 dark:hover:bg-accent/30",
            i !== links.length - 1 && "border-b",
          )}
        >
          <div className="flex min-w-0 items-center space-x-2.5">
            <LinkFavicon link={{ destination: link.destination, events: link.events }} />
            <div className="min-w-0">
              <div className="flex items-center space-x-1">
                <a
                  href={`https://${link.domain.name}/${link.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  className="cursor-pointer truncate text-[13px] hover:underline"
                >
                  {`${link.domain.name}/${link.slug}`}
                </a>
                <CopyButton text={`https://${link.domain.name}/${link.slug}`} />
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <CornerDownRight size={12} className="shrink-0" />
                <a
                  href={link.destination}
                  className="truncate hover:underline"
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  {link.destination.replace("http://", "").replace("https://", "")}
                </a>
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center space-x-2">
            {link._count.tags === 1 && (
              <Tag
                variant={link.tags[0].color}
                className="flex h-5 items-center space-x-1 text-[11px]"
              >
                <TagIcon size={11} />
                <span className="max-[800px]:hidden">{link.tags[0].name}</span>
                <span className="min-[800px]:hidden">1</span>
              </Tag>
            )}
            {link._count.tags > 1 && (
              <Badge variant={"neutral"} className="flex h-5 items-center space-x-1 text-[11px]">
                <TagIcon size={11} />
                <span>
                  {link._count.tags}
                  <span className="max-[800px]:hidden"> tags</span>
                </span>
              </Badge>
            )}
            {link._count.events > 0 && (
              <Badge variant="neutral" className="flex h-5 items-center space-x-1 text-[11px]">
                <ChartArea size={11} />
                <span>
                  {link._count.events.toLocaleString("en-us")}
                  <span className="max-[800px]:hidden">
                    {link._count.events === 1 ? " event" : " events"}
                  </span>
                </span>
              </Badge>
            )}
            <Avatar className="h-5 w-5 rounded-full border">
              <AvatarImage src={link.createdBy.user.image} alt="avatar" />
              <AvatarFallback className="bg-transparent">
                <Skeleton className="h-full w-full" />
              </AvatarFallback>
            </Avatar>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 active:!scale-100"
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreHorizontal size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="space-x-2">
                  <Pencil size={13} />
                  <span className="text-[13px]">Edit link</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="space-x-2">
                  <Copy size={13} />
                  <span className="text-[13px]">Copy link</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="space-x-2">
                  <Archive size={13} />
                  <span className="text-[13px]">Archive</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500">
                  <Trash size={13} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NextLink>
      ))}
    </div>
  );
};
