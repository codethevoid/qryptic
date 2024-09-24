"use client";

import { useTags } from "@/lib/hooks/swr/use-tags";
import { NoTags } from "@/components/empty/tags/no-tags";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CreateTag } from "@/components/modals/tags/create-tag";
import { TagsTable } from "@/components/tables/tags-table";
import { Snackbar } from "@/components/snackbar/snackbar";
import { Plus } from "lucide-react";
import { SearchInput } from "@/components/ui/custom/search-input";
import { TagWithCounts } from "@/types/tags";
import { useParams } from "next/navigation";
import { mutate } from "swr";
import { scrollToTop } from "@/utils/smooth-scroll";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { NoTagsFound } from "@/components/empty/tags/no-tags-found";
import { TagsSkeleton } from "@/components/skeletons/tags-skeleton";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

export const TagsClient = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const pageSize = 10;
  const { tags, totalTags, isLoading, error } = useTags(page, pageSize, debouncedSearch);
  const { slug } = useParams();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    totalTags !== undefined && setTotal(totalTags);
    if (tags?.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [tags]);

  useEffect(() => {
    scrollToTop();
  }, [page]);

  const mutateTags = async () => {
    await mutate(`/api/tags/${slug}?page=${page}&pageSize=${pageSize}&search=${debouncedSearch}`);
  };

  return (
    <>
      <div className="flex items-center justify-between" ref={containerRef}>
        <p className="text-xl font-bold">Tags</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <SearchInput
            placeholder="Search tags"
            setSearch={setSearch}
            search={search}
            // disabled={tags?.length === 0 && debouncedSearch === ""}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Button className="space-x-1.5" size="sm" onClick={() => setIsOpen(true)}>
            <Plus size={14} />
            <span>Create tag</span>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoading || search !== debouncedSearch ? (
          <TagsSkeleton />
        ) : error ? (
          "an error occured"
        ) : tags.length === 0 && debouncedSearch ? (
          <NoTagsFound setSearch={setSearch} />
        ) : tags.length === 0 ? (
          <NoTags setIsOpen={setIsOpen} />
        ) : (
          <TagsTable
            tags={tags as TagWithCounts[]}
            mutateTags={mutateTags}
            containerRef={containerRef}
          />
        )}
      </div>
      <CreateTag isOpen={isOpen} setIsOpen={setIsOpen} mutateTags={mutateTags} />
      {total > pageSize && (
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
