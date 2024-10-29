"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/(builder)/(form)/context";
import { Domain } from "@/types/links";
import { ChangeEvent, useEffect } from "react";
import { useOptions } from "@/lib/hooks/swr/use-options";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { RefreshCw, Search, TagIcon, XCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { TagColor } from "@/types/colors";
import { Tag } from "@/components/ui/custom/tag";
import { useParams } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { generateSlug, checkSlug, isSlugUrlSafe } from "@/lib/links/slug-actions";
import { useTeam } from "@/lib/hooks/swr/use-team";

export const General = ({ mode }: { mode: "new" | "edit" }) => {
  const {
    tab,
    setDestination,
    destination,
    domain,
    setDomain,
    notes,
    setNotes,
    tags,
    setTags,
    setSlug,
    slug,
    setUtmSource,
    setUtmContent,
    setUtmTerm,
    setUtmCampaign,
    setUtmMedium,
    setExpiredDestination,
    setTitle,
    setImage,
    setDescription,
    setOgUrl,
    setImageFile,
    setImageType,
    existingLink,
  } = useLinkForm();
  const { data } = useOptions();
  const { slug: teamSlug } = useParams();
  const { team } = useTeam();
  const debouncedSlug = useDebounce(slug, 500);
  const [isLoadingSlug, setIsLoadingSlug] = useState<boolean>(false);
  const [slugError, setSlugError] = useState<string>("");
  const [domainSearch, setDomainSearch] = useState<string>("");
  const [isDomainsOpen, setIsDomainsOpen] = useState<boolean>(false);
  const [tagSearch, setTagSearch] = useState<string>("");

  useEffect(() => {
    if (mode === "edit") return;
    generateSlug(teamSlug as string).then((data) => setSlug(data.slug));
  }, []);

  useEffect(() => {
    if (debouncedSlug === existingLink?.slug) {
      return setSlugError("");
    }
    if (debouncedSlug) {
      checkSlug(teamSlug as string, debouncedSlug).then((data) => {
        if (!data.isAvailable) {
          setSlugError("Slug is not available");
        } else if (!isSlugUrlSafe(debouncedSlug)) {
          setSlugError("Slug must be URL safe");
        } else {
          setSlugError("");
        }
      });
    }
  }, [debouncedSlug]);

  useEffect(() => {
    if (mode === "edit") return;
    if (data) {
      if (data.domains?.length === 1) {
        setDomain(data.domains[0]);
        setExpiredDestination(data.domains[0].destination);
      } else if (data.domains?.length > 1) {
        // find primary domain
        const primary = data.domains.find((d) => d.isPrimary);
        setDomain(primary || data.domains[0]);
        setExpiredDestination(primary?.destination || "");
      }
    }
  }, [data]);

  const filterDomains = (domains: Domain[]) => {
    return domains.filter((d) => d.name.includes(domainSearch.toLowerCase().trim()));
  };

  const filterTags = (tags: { id: string; name: string; color: TagColor }[]) => {
    return tags.filter((t) => t.name.toLowerCase().includes(tagSearch.toLowerCase().trim()));
  };

  const handleTagChange = (tag: { id: string; name: string; color: TagColor }) => {
    const isTagInList = tags.some((t) => t.id === tag.id);
    if (isTagInList) {
      setTags(tags.filter((t) => t.id !== tag.id));
    } else {
      setTags([...tags, tag]);
    }
  };

  const resetUTM = () => {
    setUtmSource("");
    setUtmMedium("");
    setUtmCampaign("");
    setUtmTerm("");
    setUtmContent("");
  };

  const resetOg = () => {
    setTitle("");
    setDescription("");
    setImage("");
    setOgUrl("");
    setImageFile(null);
    setImageType(null);
  };

  const handleDestinationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
    if (!e.target.value) {
      resetUTM();
      resetOg();
      return;
    }
    const searchParams = new URLSearchParams(e.target.value.split("?")[1]);
    setUtmSource(searchParams.get("utm_source") || "");
    setUtmMedium(searchParams.get("utm_medium") || "");
    setUtmCampaign(searchParams.get("utm_campaign") || "");
    setUtmTerm(searchParams.get("utm_term") || "");
    setUtmContent(searchParams.get("utm_content") || "");
  };

  return (
    <div className={cn("space-y-4", tab !== "general" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="destination">Destination url</Label>
        <Input
          id="destination"
          placeholder="https://example.com"
          value={destination}
          onChange={(e) => handleDestinationChange(e)}
          disabled={mode === "edit" && team?.plan.isFree}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="slug">Short link construction</Label>
          <Button
            className="h-5 w-5 rounded-md"
            size="icon"
            variant="ghost"
            disabled={isLoadingSlug}
            onClick={async () => {
              setIsLoadingSlug(true);
              const data = await generateSlug(teamSlug as string);
              setSlug(data.slug);
              setIsLoadingSlug(false);
            }}
          >
            <RefreshCw size={11} className={`${isLoadingSlug ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex">
          <Popover open={isDomainsOpen} onOpenChange={setIsDomainsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full max-w-[150px] items-center justify-between space-x-2 rounded-r-none border-r-0 font-normal active:!scale-100"
                size="sm"
              >
                <span className="max-w-[100px] truncate">
                  {domain?.name || <Skeleton className="h-4 w-20" />}
                </span>
                <CaretSortIcon className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0">
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
                  filterDomains(data?.domains || []).length >= 5
                    ? "h-[165.5px] hover:pr-3"
                    : "h-auto",
                )}
              >
                {filterDomains(data?.domains || []).map((d) => (
                  <div
                    role="button"
                    key={d.id}
                    className={cn(
                      "flex cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors",
                      d.id === domain?.id
                        ? "bg-accent dark:bg-accent/90"
                        : "hover:!bg-accent/60 dark:hover:!bg-accent/40",
                    )}
                    onClick={() => {
                      setDomain(d);
                      setExpiredDestination(d.destination || "");
                      setIsDomainsOpen(false);
                    }}
                  >
                    <p
                      className={cn(
                        "truncate text-[13px] transition-all",
                        domain?.id === d.id && "font-medium",
                      )}
                    >
                      {d.name}
                    </p>
                    <CheckIcon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all",
                        domain?.id === d.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </div>
                ))}
                {filterDomains(data?.domains || []).length === 0 && (
                  <div className="flex h-[63px] items-center justify-center text-muted-foreground">
                    <p className="text-xs">No domains found</p>
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <Input
            id="slug"
            placeholder="Back half (slug)"
            className={cn(
              "rounded-l-none",
              slugError && existingLink?.slug !== slug && "border-red-600",
            )}
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              if (!e.target.value) setSlugError("");
            }}
          />
        </div>
        {slugError && debouncedSlug && existingLink?.slug !== slug && (
          <p className="text-xs text-red-600">{slugError}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <div>
          <Label htmlFor="tags">Tags</Label>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-auto min-h-9 w-full items-center justify-between gap-x-2 active:!scale-100"
            >
              <span className={cn("font-normal text-muted-foreground", tags.length && "hidden")}>
                Select tags
              </span>
              <div className={cn("flex flex-wrap gap-1 py-1.5", !tags.length && "hidden")}>
                {tags.map((tag) => (
                  <Tag
                    key={tag.id}
                    variant={tag.color}
                    className="cursor-default items-center space-x-1 px-1.5 py-0 text-[11px] transition-all hover:opacity-90"
                  >
                    <XCircle
                      role="button"
                      className="cursor-pointer"
                      size={11}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTags(tags.filter((t) => t.id !== tag.id));
                      }}
                    />
                    <span>{tag.name}</span>
                  </Tag>
                ))}
              </div>
              <CaretSortIcon className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto min-w-[var(--radix-popover-trigger-width)] p-0">
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
                filterTags(data?.tags || []).length >= 5 ? "h-[165.5px] hover:pr-3" : "h-auto",
              )}
            >
              {filterTags(data?.tags || []).map((t) => (
                <div
                  role="button"
                  key={t.id}
                  className={cn(
                    "flex h-[31.5px] cursor-default select-none items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-accent dark:hover:bg-accent/90",
                  )}
                  onClick={() => handleTagChange(t)}
                >
                  <div className="flex items-center space-x-2">
                    <Tag variant={t.color} className="flex h-5 w-5 items-center justify-center p-0">
                      <TagIcon className="h-2.5 w-2.5" />
                    </Tag>
                    <p
                      className={cn(
                        "max-w-[calc(var(--radix-popover-trigger-width)-80px)] truncate text-[13px] transition-all",
                        tags.some((tag) => tag.id === t.id) && "font-medium",
                      )}
                    >
                      {t.name}
                    </p>
                  </div>
                  <CheckIcon
                    className={cn(
                      "h-4 w-4 shrink-0 transition-all",
                      tags.some((tag) => tag.id === t.id) ? "opacity-100" : "opacity-0",
                    )}
                  />
                </div>
              ))}
              {filterTags(data?.tags || []).length === 0 && (
                <div className="flex h-[63px] items-center justify-center text-muted-foreground">
                  <p className="text-xs">No tags found</p>
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Internal notes or reminders for this link"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
};
