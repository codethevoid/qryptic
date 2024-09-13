"use client";

import { useTags } from "@/lib/hooks/swr/use-tags";
import { NoTags } from "@/components/empty/no-tags";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTag } from "@/components/modals/create-tag";
import { TagsTable } from "@/components/tables/tags";

export const TagsClient = () => {
  const { tags, isLoading, error } = useTags();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between">
        <p className="text-xl font-bold">Tags</p>
        <Button disabled={isLoading} onClick={() => setIsOpen(true)}>
          Create tag
        </Button>
      </div>
      <div className="mt-6">
        {isLoading ? (
          <div>loading tags...</div>
        ) : error ? (
          "an error occured"
        ) : tags?.length === 0 ? (
          <NoTags setIsOpen={setIsOpen} />
        ) : (
          <TagsTable tags={tags} />
        )}
      </div>
      <CreateTag isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
