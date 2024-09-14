"use client";

import { useTags } from "@/lib/hooks/swr/use-tags";
import { NoTags } from "@/components/empty/no-tags";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTag } from "@/components/modals/tags/create-tag";
import { TagsTable } from "@/components/tables/tags";
import { TagColor } from "@/types/colors";
import { Snackbar } from "@/components/snackbar/snackbar";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/custom/search-input";

type CustomTag = {
  id: string;
  name: string;
  color: TagColor;
  linkCount: number;
  eventCount: number;
};

export const TagsClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  const { tags, totalTags, isLoading, error } = useTags(page, pageSize);

  useEffect(() => {
    if (totalTags && totalTags !== total) setTotal(totalTags);
  }, [totalTags]);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Tags</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <SearchInput placeholder="Search tags" />
          <Button
            className="space-x-1.5"
            size="sm"
            disabled={isLoading}
            onClick={() => setIsOpen(true)}
          >
            <Plus size={14} />
            <span>Create tag</span>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div>loading tags...</div>
        ) : error ? (
          "an error occured"
        ) : tags?.length === 0 ? (
          <NoTags setIsOpen={setIsOpen} />
        ) : (
          <TagsTable tags={tags as CustomTag[]} />
        )}
      </div>
      <CreateTag isOpen={isOpen} setIsOpen={setIsOpen} page={page} pageSize={pageSize} />
      {total > 10 && (
        <Snackbar
          unit="tags"
          page={page}
          pageSize={pageSize}
          total={total}
          setIsOpen={setIsOpen}
          setPage={setPage}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
