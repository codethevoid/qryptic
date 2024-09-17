import { Tag as TagBadge } from "@/components/ui/custom/tag";
import { TagColor } from "@/types/colors";
import { ChartArea, Link2, MoreHorizontal, Pencil, Tag, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TagWithCounts } from "@/types/tags";
import { EditTag } from "@/components/modals/tags/edit-tag";
import { useState } from "react";
import { DeleteTag } from "@/components/modals/tags/delete-tag";
import { TooltipTrigger, Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { useRef, RefObject } from "react";

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
              {/*<DropdownMenu modal={false}>*/}
              {/*  <DropdownMenuTrigger asChild>*/}
              {/*    <Button size="icon" variant="outline">*/}
              {/*      <MoreHorizontal size={14} />*/}
              {/*    </Button>*/}
              {/*  </DropdownMenuTrigger>*/}
              {/*  <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>*/}
              {/*    <DropdownMenuItem*/}
              {/*      className="space-x-2 text-[13px]"*/}
              {/*      onSelect={() => handleEdit(tag)}*/}
              {/*    >*/}
              {/*      <Pencil size={14} />*/}
              {/*      <span>Edit tag</span>*/}
              {/*    </DropdownMenuItem>*/}
              {/*    <DropdownMenuItem*/}
              {/*      className="space-x-2 text-[13px] text-red-600 hover:!bg-red-600/10 hover:!text-red-600"*/}
              {/*      onSelect={() => handleDelete(tag)}*/}
              {/*    >*/}
              {/*      <Trash size={14} />*/}
              {/*      <span>Delete</span>*/}
              {/*    </DropdownMenuItem>*/}
              {/*  </DropdownMenuContent>*/}
              {/*</DropdownMenu>*/}
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-[28px] w-[30px] rounded-r-none border-r-0 text-muted-foreground"
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
                      className="h-[28px] w-[30px] rounded-l-none text-muted-foreground"
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
