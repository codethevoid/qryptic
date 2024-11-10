"use client";

import { SearchInput } from "@/components/ui/custom/search-input";
import { useState, FC, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, TableProperties } from "lucide-react";
import NextLink from "next/link";
import { useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useLinks } from "@/lib/hooks/swr/use-links";
import { Snackbar } from "@/components/snackbar/snackbar";
import { TagColor } from "@/types/colors";
import { LinkFilters } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/filters";
import { LinksTable } from "@/components/tables/links-table";
import { LinksSkeleton } from "@/components/skeletons/links-skeleton";
import { NoLinks } from "@/components/empty/links/no-links";
import { type TableLink } from "@/types/links";
import { NoLinksFound } from "@/components/empty/links/no-links-found";
import { ExportLinkData } from "./dialogs/export-data";

type Status = "active" | "archived";
type StatusList = Status[];
type Totals = { active: number; archived: number; all: number; filtered: number; loaded: boolean };
const initialTotals = { active: 0, archived: 0, all: 0, filtered: 0, loaded: false };
type CustomTag = { id: string; name: string; color: TagColor };

export const LinksClient: FC = () => {
  const pageSize = 20;
  const [page, setPage] = useState(1);
  // search
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  // status
  const [status, setStatus] = useState<StatusList>(["active"]);
  // domains
  const [domainOptions, setDomainOptions] = useState<{ name: string; id: string }[]>([]);
  const [domains, setDomains] = useState<{ name: string; id: string }[]>([]);
  // tags
  const [tagOptions, setTagOptions] = useState<CustomTag[]>([]);
  const [tags, setTags] = useState<CustomTag[]>([]);
  // sort
  const [sort, setSort] = useState<"date" | "activity">("date");
  // totals
  const [totals, setTotals] = useState<Totals>(initialTotals);
  const { slug } = useParams();

  const [isNewLinkOpen, setIsNewLinkOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const { data, isLoading, error, mutate } = useLinks({
    status,
    search: debouncedSearch,
    tags,
    domains,
    page,
    pageSize,
    sort,
  });

  useEffect(() => {
    if (data) {
      setTotals({ ...data.totals, loaded: true });
      setDomainOptions(data.domains);
      setTagOptions(data.tags);
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
  }, [search, status, domains, tags]);

  useEffect(() => {
    window?.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const activeFilters = () => {
    const numSearch = search.length ? 1 : 0;
    return status.length + numSearch + domains.length + tags.length;
  };

  const clearFilters = () => {
    setSearch("");
    setStatus([]);
    setDomains([]);
    setTags([]);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-xl font-bold">Links</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <div className="flex items-center space-x-2 max-[768px]:hidden">
            <SearchInput
              name="search links"
              placeholder="Search links"
              search={search}
              setSearch={setSearch}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Select value={sort} onValueChange={(value: "date" | "activity") => setSort(value)}>
              <SelectTrigger className="h-8 w-auto space-x-2 capitalize">
                <span>{sort}</span>
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
                <SelectGroup>
                  <SelectItem value="date">Sort by date</SelectItem>
                  <SelectItem value="activity">Sort by activity</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/*<div>*/}
          {/*  <Tooltip>*/}
          {/*    <TooltipTrigger asChild>*/}
          {/*      <Button size="icon" variant="outline">*/}
          {/*        <TableProperties size={13} />*/}
          {/*      </Button>*/}
          {/*    </TooltipTrigger>*/}
          {/*    <TooltipContent>Upload CSV</TooltipContent>*/}
          {/*  </Tooltip>*/}
          {/*</div>*/}
          <Button size="sm" className="space-x-1.5" asChild>
            <NextLink href={`/${slug}/links/new`} passHref>
              <Plus size={14} />
              <span>Create link</span>
            </NextLink>
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2 min-[768px]:hidden">
        <SearchInput
          name="search links"
          placeholder="Search links"
          search={search}
          setSearch={setSearch}
          wrapperClassName="max-w-none"
          inputClassName="w-full"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={sort} onValueChange={(value: "date" | "activity") => setSort(value)}>
          <SelectTrigger className="h-8 w-auto space-x-2 capitalize">
            <span>{sort}</span>
          </SelectTrigger>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
            <SelectGroup>
              <SelectItem value="date">Sort by date</SelectItem>
              <SelectItem value="activity">Sort by activity</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <LinkFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        domainOptions={domainOptions}
        domains={domains}
        setDomains={setDomains}
        tagOptions={tagOptions}
        tags={tags}
        setTags={setTags}
        activeFilters={activeFilters}
        clearFilters={clearFilters}
        isLoading={isLoading}
        totals={totals}
        setIsExportOpen={setIsExportOpen}
      />
      <div className="mt-3">
        {isLoading || search !== debouncedSearch ? (
          <LinksSkeleton />
        ) : error ? (
          "An error occurred"
        ) : data?.totals.all === 0 ? (
          <NoLinks />
        ) : data?.links.length === 0 ? (
          <NoLinksFound clearFilters={clearFilters} />
        ) : (
          <LinksTable links={data?.links as TableLink[]} mutate={mutate} />
        )}
      </div>
      {totals.filtered > pageSize && (
        <Snackbar
          page={page}
          pageSize={pageSize}
          total={totals.filtered}
          unit={"links"}
          setPage={setPage}
          isLoading={isLoading}
          // setIsOpen={setIsNewLinkOpen}
          link={`/${slug}/links/new`}
        />
      )}
      {/*<NewLink isOpen={isNewLinkOpen} setIsOpen={setIsNewLinkOpen} />*/}
      <ExportLinkData isOpen={isExportOpen} setIsOpen={setIsExportOpen} />
    </>
  );
};
