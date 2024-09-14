"use client";

import { Tag as TagBadge } from "@/components/ui/custom/tag";
import { TagColor } from "@/types/colors";
import { ChartArea, Link2, MoreHorizontal, Tag, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type CustomTag = {
  id: string;
  name: string;
  color: TagColor;
  linkCount: number;
  eventCount: number;
};

export const TagsTable = ({ tags }: { tags: CustomTag[] }) => {
  return (
    <div className="rounded-lg border shadow">
      {tags.map((tag, i) => (
        <div
          className={`${i !== tags.length - 1 ? "border-b" : undefined} flex items-center justify-between space-x-2.5 px-3 py-2.5`}
          key={tag.id}
        >
          <div className="flex items-center space-x-2.5">
            <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
              <Tag size={13} />
            </div>
            <TagBadge className="w-fit text-nowrap" variant={tag.color as TagColor}>
              {tag.name}
            </TagBadge>
          </div>
          <div className="flex items-center space-x-2.5">
            <Badge variant="neutral" className="space-x-1.5 text-nowrap">
              <Link2 size={13} className="-rotate-45" />
              <span>
                {tag.linkCount !== 0 && tag.linkCount}{" "}
                {tag.linkCount === 1 ? "link" : tag.linkCount === 0 ? "No links" : "links"}
              </span>
            </Badge>
            <Badge variant="neutral" className="space-x-1.5 text-nowrap">
              <ChartArea size={13} />
              <span>
                {tag.eventCount !== 0 && tag.eventCount}{" "}
                {tag.linkCount === 1 ? "event" : tag.linkCount === 0 ? "No events" : "events"}
              </span>
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <MoreHorizontal size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-[13px]">Edit</DropdownMenuItem>
                <DropdownMenuItem className="space-x-2 text-[13px]">
                  <Trash size={14} />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};
