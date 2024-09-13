"use client";

import { Tag } from "@prisma/client";
import { Card } from "@/components/ui/card";

export const TagsTable = ({ tags }: { tags: Tag[] }) => {
  return (
    <div className="rounded-lg border">
      {tags.map((tag) => (
        <p>{tag.name}</p>
      ))}
    </div>
  );
};
