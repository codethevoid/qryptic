import { Tag as TagBadge } from "@/components/ui/custom/tag";
import { TagColor } from "@/types/colors";
import { ChartArea, Link2, Pencil, Tag, Trash, TagIcon, MousePointerClick } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TagWithCounts } from "@/types/tags";
import { EditTag } from "@/components/modals/tags/edit-tag";
import { useState } from "react";
import { DeleteTag } from "@/components/modals/tags/delete-tag";
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { RefObject } from "react";

type TagsTableProps = {
  tags: TagWithCounts[];
  mutateTags: () => Promise<void>;
  containerRef: RefObject<HTMLDivElement>;
};

export const TagsTable = ({ tags, mutateTags, containerRef }: TagsTableProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagWithCounts | undefined>(undefined);

  const handleEdit = (tag: TagWithCounts) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  const handleDelete = (tag: TagWithCounts) => {
    setSelectedTag(tag);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <div className="rounded-lg border">
        {tags.map((tag, i) => (
          <div
            className={`${i !== tags.length - 1 ? "border-b" : undefined} flex items-center justify-between space-x-2.5 px-3 py-2.5 transition-all`}
            key={tag.id}
          >
            <div className="flex items-center space-x-2.5">
              {/* <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
                <Tag size={13} />
              </div> */}
              <TagBadge
                variant={tag.color as TagColor}
                className={`flex h-8 w-8 items-center justify-center border-border p-0`}
              >
                <TagIcon className="h-[13px] w-[13px]" />
              </TagBadge>
              <p className="text-sm">{tag.name}</p>
              {/* <TagBadge className="w-fit text-nowrap" variant={tag.color as TagColor}>
                {tag.name}
              </TagBadge> */}
            </div>
            <div className="flex items-center space-x-2">
              {tag.linkCount ? (
                <Badge
                  variant="neutral"
                  className="flex h-5 items-center space-x-1 text-[11px] max-sm:hidden"
                >
                  <Link2 size={13} className="-rotate-45" />
                  <span>
                    {tag.linkCount !== 0 && tag.linkCount.toLocaleString("en-us")}{" "}
                    {tag.linkCount === 1 ? "link" : tag.linkCount === 0 ? "No links" : "links"}
                  </span>
                </Badge>
              ) : (
                ""
              )}
              {tag.eventCount ? (
                <Badge
                  variant="neutral"
                  className="flex h-5 items-center space-x-1 text-[11px] max-sm:hidden"
                >
                  <MousePointerClick size={13} />
                  <span>
                    {tag.eventCount !== 0 && tag.eventCount.toLocaleString("en-us")}{" "}
                    {tag.eventCount === 1 ? "event" : tag.eventCount === 0 ? "No events" : "events"}
                  </span>
                </Badge>
              ) : (
                ""
              )}
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-[28px] w-[30px] rounded-r-none border-r-0 text-muted-foreground active:!scale-100"
                      onClick={() => handleEdit(tag)}
                    >
                      <Pencil size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit tag</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-[28px] w-[30px] rounded-l-none text-muted-foreground hover:text-red-600 active:!scale-100"
                      onClick={() => handleDelete(tag)}
                    >
                      <Trash size={13} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent collisionBoundary={containerRef?.current}>
                    Delete tag
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
      <EditTag
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        tag={selectedTag}
        mutateTags={mutateTags}
      />
      <DeleteTag
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        tag={selectedTag}
        mutateTags={mutateTags}
      />
    </>
  );
};
