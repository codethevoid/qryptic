import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, CloudDownload, Dot, PlusCircle, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchInput } from "@/components/ui/custom/search-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { TagColor } from "@/types/colors";
import { Skeleton } from "@/components/ui/skeleton";

type Status = "active" | "archived";
type StatusList = Status[];
type CustomTag = { id: string; name: string; color: TagColor };
type Totals = { active: number; archived: number; all: number; filtered: number; loaded: boolean };

type LinkFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  status: StatusList;
  setStatus: (value: Status[]) => void;
  domainOptions: { id: string; name: string }[];
  domains: { id: string; name: string }[];
  setDomains: (value: { id: string; name: string }[]) => void;
  tagOptions: CustomTag[];
  tags: CustomTag[];
  setTags: (value: CustomTag[]) => void;
  activeFilters: () => number;
  clearFilters: () => void;
  isLoading: boolean;
  totals: Totals;
};

export const LinkFilters = ({
  search,
  setSearch,
  status,
  setStatus,
  domainOptions,
  domains,
  setDomains,
  tagOptions,
  tags,
  setTags,
  activeFilters,
  clearFilters,
  isLoading,
  totals,
}: LinkFiltersProps) => {
  const [domainSearch, setDomainSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  const handleStatusChange = (word: Status) => {
    if (status.includes(word)) {
      setStatus(status.filter((s) => s !== word));
    } else {
      setStatus([...status, word]);
    }
  };

  const handleDomainChange = (domain: { id: string; name: string }) => {
    const isDomainInList = domains.some((d) => d.id === domain.id);
    if (isDomainInList) {
      setDomains(domains.filter((d) => d.id !== domain.id));
    } else {
      setDomains([...domains, domain]);
    }
  };

  const handleTagChange = (tag: CustomTag) => {
    const isTagInList = tags.some((t) => t.id === tag.id);
    if (isTagInList) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else {
      setTags([...tags, tag]);
    }
  };

  const filterDomains = (domains: { name: string; id: string }[]) => {
    return domains.filter((d) => d.name.includes(domainSearch.toLowerCase().trim()));
  };

  const filterTags = (tags: CustomTag[]) => {
    return tags.filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase().trim()));
  };

  return (
    <div className="max-[768px]:hidden">
      <div className="mt-3 grid w-full grid-cols-3 gap-2">
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 shadow-sm transition-all ${status.includes("active") && activeFilters() - 1 === 0 ? "border-primary text-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`}
          role="button"
          onClick={() => {
            clearFilters();
            setStatus(["active"]);
          }}
        >
          <p className="text-[13px] font-medium">Active</p>
          {isLoading && !totals.loaded ? (
            <Skeleton className="h-full w-10" />
          ) : (
            <p className="text-[13px] font-medium">{totals.active}</p>
          )}
        </div>
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 shadow-sm transition-all ${status.includes("archived") && activeFilters() - 1 === 0 ? "border-primary text-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`}
          role="button"
          onClick={() => {
            clearFilters();
            setStatus(["archived"]);
          }}
        >
          <p className="text-[13px] font-medium">Archived</p>
          {isLoading && !totals.loaded ? (
            <Skeleton className="h-full w-10" />
          ) : (
            <p className="text-[13px] font-medium">{totals.archived}</p>
          )}
        </div>
        <div
          className={`flex items-center justify-between rounded-lg border px-3 py-2 shadow-sm transition-all ${!status.length && !activeFilters() ? "border-primary text-foreground" : "border-border text-muted-foreground hover:border-primary/30"}`}
          role="button"
          onClick={() => {
            clearFilters();
            setStatus([]);
          }}
        >
          <p className={`text-[13px] font-medium`}>All</p>
          {isLoading && !totals.loaded ? (
            <Skeleton className="h-full w-10" />
          ) : (
            <p className="text-[13px] font-medium">{totals.all}</p>
          )}
        </div>
      </div>
      <div className="mt-3 flex justify-between space-x-4">
        <div className="mt-[2.5px] flex flex-wrap items-start gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <div
                className={`flex w-fit items-center space-x-1.5 rounded-full border px-2 py-[3px] transition-all hover:bg-accent/60 hover:dark:bg-accent/40 ${!status.length ? "border-dashed" : "shadow-sm"}`}
                role="button"
              >
                <PlusCircle
                  size={13}
                  className={`text-muted-foreground transition-all ${!status.length ? "rotate-0" : "rotate-45 hover:text-red-600"}`}
                  onClick={(e) => {
                    if (!status.length) return;
                    e.stopPropagation();
                    setStatus([]);
                  }}
                />
                <p className="text-xs font-medium text-muted-foreground">Status</p>
                {status.length ? (
                  <>
                    <Separator className="h-3" orientation="vertical" />
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-medium">
                        <span>{status[0]}</span>
                        {/*{status.length > 1 && <span>, {status[1]}</span>}*/}
                        {status.length > 1 && <span> and {status.length - 1} more</span>}
                      </p>
                      <ChevronDown size={13} className="relative top-[1px] text-muted-foreground" />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[140px] p-1">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Filter by status
              </p>
              <DropdownMenuSeparator className="mb-1 mt-0.5" />
              <div>
                <div
                  className="flex cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:dark:bg-accent/90"
                  role="button"
                  onClick={() => handleStatusChange("active")}
                >
                  <p
                    className={cn(
                      "text-[13px] transition-all",
                      status.includes("active") && "font-medium",
                    )}
                  >
                    Active
                  </p>
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 transition-all",
                      status.includes("active") ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
                <div
                  className="flex cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:dark:bg-accent/90"
                  role="button"
                  onClick={() => handleStatusChange("archived")}
                >
                  <p
                    className={cn(
                      "text-[13px] transition-all",
                      status.includes("archived") && "font-medium",
                    )}
                  >
                    Archived
                  </p>
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 transition-all",
                      status.includes("archived") ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex w-fit items-center space-x-1.5 rounded-full border px-2 py-[3px] transition-all hover:bg-accent/60 hover:dark:bg-accent/40",
                  domains.length ? "shadow-sm" : "border-dashed",
                )}
                role="button"
              >
                <PlusCircle
                  size={13}
                  className={cn(
                    "text-muted-foreground transition-all",
                    domains.length ? "rotate-45 hover:text-red-600" : "rotate-0",
                  )}
                  onClick={(e) => {
                    if (!domains.length) return;
                    e.stopPropagation();
                    setDomains([]);
                  }}
                />
                <p className="text-xs font-medium text-muted-foreground">Domain</p>
                {domains?.length ? (
                  <>
                    <Separator className="h-3" orientation="vertical" />
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-medium">
                        <span>{domains[0].name}</span>
                        {/*{status.length > 1 && <span>, {status[1]}</span>}*/}
                        {domains.length > 1 && <span> and {domains.length - 1} more</span>}
                      </p>
                      <ChevronDown size={13} className="relative top-[1px] text-muted-foreground" />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0">
              {/*<p className="text-xs font-medium text-muted-foreground">Filter by domain</p>*/}
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search domains"
                  className="rounded-b-none border-0 border-b pl-8 shadow-none focus-visible:!ring-0"
                  onChange={(e) => setDomainSearch(e.target.value)}
                  value={domainSearch}
                />
              </div>
              <ScrollArea
                className={cn(
                  "p-1 transition-all",
                  filterDomains(domainOptions).length >= 5 ? "h-[165.5px] hover:pr-3" : "h-auto",
                )}
              >
                {filterDomains(domainOptions).map((domain) => (
                  <div
                    role="button"
                    key={domain.id}
                    className="flex cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:dark:bg-accent/90"
                    onClick={() => handleDomainChange(domain)}
                  >
                    <p
                      className={cn(
                        "truncate text-[13px] transition-all",
                        domains.some((d) => d.id === domain.id) && "font-medium",
                      )}
                    >
                      {domain.name}
                    </p>
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all",
                        domains.some((d) => d.id === domain.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                ))}
                {filterDomains(domainOptions).length === 0 && (
                  <div className="flex h-[63px] items-center justify-center text-muted-foreground">
                    <p className="text-xs">No domains found</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex w-fit items-center space-x-1.5 rounded-full border px-2 py-[3px] transition-all hover:bg-accent/60 hover:dark:bg-accent/40",
                  tags.length ? "shadow-sm" : "border-dashed",
                )}
                role="button"
              >
                <PlusCircle
                  size={13}
                  className={cn(
                    "text-muted-foreground transition-all",
                    tags.length ? "rotate-45 hover:text-red-600" : "rotate-0",
                  )}
                  onClick={(e) => {
                    if (!tags.length) return;
                    e.stopPropagation();
                    setTags([]);
                  }}
                />
                <p className="text-xs font-medium text-muted-foreground">Tag</p>
                {tags?.length ? (
                  <>
                    <Separator className="h-3" orientation="vertical" />
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-medium">
                        <span>{tags[0].name}</span>
                        {/*{status.length > 1 && <span>, {status[1]}</span>}*/}
                        {tags.length > 1 && <span> and {tags.length - 1} more</span>}
                      </p>
                      <ChevronDown size={13} className="relative top-[1px] text-muted-foreground" />
                    </div>
                  </>
                ) : (
                  ""
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0">
              {/*<p className="text-xs font-medium text-muted-foreground">Filter by domain</p>*/}
              <div className="relative flex items-center">
                <Search size={14} className="absolute left-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search tags"
                  className="rounded-b-none border-0 border-b pl-8 shadow-none focus-visible:!ring-0"
                  onChange={(e) => setTagSearch(e.target.value)}
                  value={tagSearch}
                />
              </div>
              <ScrollArea
                className={cn(
                  "p-1 transition-all",
                  filterTags(tagOptions).length >= 5 ? "h-[165.5px] hover:pr-3" : "h-auto",
                )}
              >
                {filterTags(tagOptions).map((tag) => (
                  <div
                    role="button"
                    key={tag.id}
                    className="flex h-[31.5px] cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent hover:dark:bg-accent/90"
                    onClick={() => handleTagChange(tag)}
                  >
                    {/*<div className="flex items-center space-x-1.5">*/}
                    {/*  <Tag*/}
                    {/*    variant={tag.color}*/}
                    {/*    className="fles h-2 w-2 items-center justify-center p-0"*/}
                    {/*  >*/}
                    {/*    /!*<TagIcon size={12} />*!/*/}
                    {/*    <Dot size={20} />*/}
                    {/*  </Tag>*/}
                    <p
                      className={cn(
                        "truncate text-[13px] transition-all",
                        tags.some((t) => t.id === tag.id) && "font-medium",
                      )}
                    >
                      {tag.name}
                    </p>
                    {/*</div>*/}
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all",
                        tags.some((t) => t.id === tag.id) ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                ))}
                {filterTags(tagOptions).length === 0 && (
                  <div className="flex h-[63px] items-center justify-center text-muted-foreground">
                    <p className="text-xs">No tags found</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <div
                className={cn(
                  "flex w-fit items-center space-x-1.5 rounded-full border px-2 py-[3px] transition-all hover:bg-accent/60 hover:dark:bg-accent/40",
                  search ? "shadow-sm" : "border-dashed",
                )}
                role="button"
              >
                <PlusCircle
                  size={13}
                  onClick={(e) => {
                    if (!search) return;
                    e.stopPropagation();
                    setSearch("");
                  }}
                  className={cn(
                    "text-muted-foreground transition-all",
                    search ? "rotate-45 hover:text-red-600" : "rotate-0",
                  )}
                />
                <p className="text-xs font-medium text-muted-foreground">Search</p>
                {search && (
                  <>
                    <Separator className="h-3" orientation="vertical" />
                    <div className="flex items-center space-x-1">
                      <p className="text-xs font-medium">{search}</p>
                      <ChevronDown size={13} className="relative top-[1px] text-muted-foreground" />
                    </div>
                  </>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-1">
              <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                Filter by search term
              </p>
              <DropdownMenuSeparator className="mb-1 mt-0.5" />
              <div className="p-2">
                <SearchInput
                  placeholder="Search links"
                  search={search}
                  setSearch={setSearch}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className={cn("hidden h-7 px-2.5 text-xs", activeFilters() && "inline-flex")}
            onClick={clearFilters}
          >
            Clear all ({activeFilters()})
          </Button>
          <Button size="sm" variant="outline" className="h-7 space-x-1.5 px-2.5 text-xs">
            <CloudDownload size={13} />
            <span>Export</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
