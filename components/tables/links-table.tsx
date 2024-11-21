import { type TableLink, LinksTable as LinksTableType } from "@/types/links";
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
  QrCodeIcon,
  ArchiveRestore,
  MousePointerClick,
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { GetQrCode } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/qr-code";
import { ArchiveLink } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/dialogs/archive-link";
import { UnarchiveLink } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/dialogs/unarchive-link";
import { DeleteLink } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/dialogs/delete-link";

type LinksTableProps = {
  links: TableLink[];
  mutate: () => Promise<void | LinksTableType | undefined>;
};

export const LinksTable: FC<LinksTableProps> = ({ links, mutate }) => {
  const { slug } = useParams();
  const router = useRouter();
  const [isQrCodeOpen, setIsQrCodeOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isUnarchiveOpen, setIsUnarchiveOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<TableLink | null>(null);

  return (
    <>
      <div className="rounded-lg border">
        {links.map((link: TableLink, i: number) => (
          <div
            key={link.id}
            className={cn(
              "flex cursor-default items-center justify-between space-x-4 px-3 py-2.5 transition-colors hover:bg-accent/40 dark:hover:bg-accent/30",
              i !== links.length - 1 && "border-b",
            )}
            onClick={() => router.push(`/${slug}/links/edit/${link.id}`)}
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
                  <CopyButton text={`${link.domain.name}/${link.slug}`} />
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
                  className="flex h-5 items-center space-x-1 text-[11px] max-sm:hidden"
                >
                  <TagIcon size={11} />
                  <span className="max-sm:hidden">{link.tags[0].name}</span>
                  <span className="hidden max-sm:block">1</span>
                </Tag>
              )}
              {link._count.tags > 1 && (
                <Tag
                  variant={link.tags[0].color}
                  className="flex h-5 items-center space-x-1 text-[11px] max-sm:hidden"
                >
                  <TagIcon size={11} />
                  <span>
                    <span className="hidden max-sm:block">{link._count.tags}</span>
                    <span className="max-sm:hidden">
                      {link.tags[0].name} +{link._count.tags - 1}
                    </span>
                  </span>
                </Tag>
              )}
              {link._count.events > 0 && (
                <Badge variant="neutral" className="flex h-5 items-center space-x-1 text-[11px]">
                  <MousePointerClick size={11} />
                  <span>
                    {link._count.events.toLocaleString("en-us")}
                    <span className="max-sm:hidden">
                      {link._count.events === 1 ? " event" : " events"}
                    </span>
                  </span>
                </Badge>
              )}
              <Avatar className="h-5 w-5 rounded-full border max-sm:hidden">
                <AvatarImage src={link.user.image} alt="avatar" />
                <AvatarFallback className="bg-transparent">
                  <Skeleton className="h-full w-full" />
                </AvatarFallback>
              </Avatar>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="active:!scale-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal size={13} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                  <DropdownMenuItem className="space-x-2">
                    <Pencil size={13} />
                    <span className="text-[13px]">Edit link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="space-x-2"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await navigator?.clipboard?.writeText(`${link.domain.name}/${link.slug}`);
                      toast.success("Link copied to clipboard");
                    }}
                  >
                    <Copy size={13} />
                    <span className="text-[13px]">Copy link</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="space-x-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(link);
                      setIsQrCodeOpen(true);
                    }}
                  >
                    <QrCodeIcon size={13} />
                    <span className="text-[13px]">QR code</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {link.isArchived ? (
                    <DropdownMenuItem
                      className="space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(link);
                        setIsUnarchiveOpen(true);
                      }}
                    >
                      <ArchiveRestore size={13} />
                      <span className="text-[13px]">Unarchive</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      className="space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(link);
                        setIsArchiveOpen(true);
                      }}
                    >
                      <Archive size={13} />
                      <span className="text-[13px]">Archive</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(link);
                      setIsDeleteOpen(true);
                    }}
                    className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
                  >
                    <Trash size={13} />
                    <span className="text-[13px]">Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
      <GetQrCode isOpen={isQrCodeOpen} setIsOpen={setIsQrCodeOpen} link={selected} />
      <ArchiveLink
        isOpen={isArchiveOpen}
        setIsOpen={setIsArchiveOpen}
        link={selected}
        mutate={mutate}
      />
      <UnarchiveLink
        isOpen={isUnarchiveOpen}
        setIsOpen={setIsUnarchiveOpen}
        link={selected}
        mutate={mutate}
      />
      <DeleteLink
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        link={selected}
        mutate={mutate}
      />
    </>
  );
};
