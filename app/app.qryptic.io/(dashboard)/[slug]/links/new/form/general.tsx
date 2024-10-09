"use client";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLinkForm } from "@/app/app.qryptic.io/(dashboard)/[slug]/links/new/context";
import { Domain } from "@/types/links";
import { useEffect } from "react";
import { useOptions } from "@/lib/hooks/swr/use-options";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const General = () => {
  const { tab, setDestination, domain, setDomain, notes, setNotes } = useLinkForm();
  const { data } = useOptions();
  const [domainSearch, setDomainSearch] = useState<string>("");
  const [isDomainsOpen, setIsDomainsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (data) {
      if (data.domains?.length === 1) {
        setDomain(data.domains[0]);
      } else if (data.domains?.length > 1) {
        // find primary domain
        setDomain(data.domains.find((d: Domain) => d.isPrimary) || data.domains[0]);
      }
    }
  }, [data]);

  const filterDomains = (domains: { name: string; id: string; isPrimary: boolean }[]) => {
    return domains.filter((d) => d.name.includes(domainSearch.toLowerCase().trim()));
  };

  return (
    <div className={cn("space-y-4", tab !== "general" && "hidden")}>
      <div className="space-y-1.5">
        <Label htmlFor="destination">Destination url</Label>
        <Input
          id="destination"
          placeholder="https://example.com"
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="slug">Short link construction</Label>
        <div className="flex">
          <Popover open={isDomainsOpen} onOpenChange={setIsDomainsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-full max-w-[150px] items-center justify-between space-x-2 rounded-r-none border-r-0 active:!scale-100"
                size="sm"
              >
                <span className="max-w-[100px] truncate">{domain?.name}</span>
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
          <Input id="slug" placeholder="Back half (slug)" className="rounded-l-none" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Select tags" />
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
