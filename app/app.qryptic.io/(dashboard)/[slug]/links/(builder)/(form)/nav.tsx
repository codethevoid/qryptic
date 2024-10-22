"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Earth,
  Link2,
  QrCode,
  TabletSmartphone,
  Tag,
  Image as ImageIcon,
  Lock,
  Ghost,
  SearchCheck,
  Stars,
  Shield,
} from "lucide-react";
import { FC, JSX } from "react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { Badge } from "@/components/ui/badge";
import { type Tab } from "@/types/links";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";

type LinkItem = {
  name: string;
  value: Tab;
  icon: JSX.Element;
  isPro: boolean;
};

const linkItems: LinkItem[] = [
  {
    name: "General",
    value: "general",
    icon: <Link2 size={14} />,
    isPro: false,
  },
  {
    name: "QR code",
    value: "qr",
    icon: <QrCode size={14} />,
    isPro: false,
  },
  {
    name: "UTM params",
    value: "utm",
    icon: <Tag size={14} />,
    isPro: false,
  },
  {
    name: "Device targeting",
    value: "device",
    icon: <TabletSmartphone size={14} />,
    isPro: true,
  },
  {
    name: "Geo targeting",
    value: "geo",
    icon: <Earth size={14} />,
    isPro: true,
  },
  {
    name: "Expiration",
    value: "expiration",
    icon: <Clock size={14} />,
    isPro: true,
  },
  {
    name: "Preview",
    value: "preview",
    icon: <ImageIcon size={14} />,
    isPro: true,
  },
  {
    name: "Protection",
    value: "protection",
    icon: <Shield size={14} />,
    isPro: true,
  },
  {
    name: "Cloaking",
    value: "cloaking",
    icon: <Ghost size={14} />,
    isPro: true,
  },
  {
    name: "Indexing",
    value: "indexing",
    icon: <SearchCheck size={16} />,
    isPro: true,
  },
];

export const NewLinkNav: FC = () => {
  const { team } = useTeam();
  const { tab, setTab } = useLinkForm();
  return (
    <div className="flex min-w-[200px] max-w-[200px] flex-col">
      <div className="mb-3 flex items-center space-x-2">
        <Avatar className="h-4 w-4 border">
          <AvatarImage src={team?.image} alt={team?.name} />
          <AvatarFallback className="bg-transparent">
            <Skeleton className="h-full w-full" />
          </AvatarFallback>
        </Avatar>
        <p className="max-w-[176px] truncate text-xs font-medium text-muted-foreground">
          Link details
        </p>
      </div>
      {linkItems.map((item, i: number) => (
        <Button
          className={`group justify-between transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 ${item.value === tab ? "text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
          variant="ghost"
          size="sm"
          key={item.value}
          onClick={() => setTab(item.value)}
        >
          <span className="flex items-center space-x-2.5">
            {item.icon}
            <span>{item.name}</span>
          </span>
          {item.isPro && team?.plan.isFree && (
            <Badge variant="neutral" className="px-1.5 py-0 text-[11px]">
              Pro
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};
