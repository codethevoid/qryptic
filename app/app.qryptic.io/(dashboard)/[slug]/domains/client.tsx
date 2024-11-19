"use client";

import { useDomains } from "@/lib/hooks/swr/use-domains";
import { SearchInput } from "@/components/ui/custom/search-input";
import { Button } from "@/components/ui/button";
import { Globe, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { AddDomain } from "@/components/modals/domains/add-domain";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { NoDomains } from "@/components/empty/domains/no-domains";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { mutate } from "swr";
import { DomainsTable } from "@/components/tables/domains-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Snackbar } from "@/components/snackbar/snackbar";
import { DomainsSkeleton } from "@/components/skeletons/domains-skeleton";
import { type Domain } from "@/lib/hooks/swr/use-domains";
import { useDefaultDomains } from "@/lib/hooks/swr/use-default-domains";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader } from "@/components/layout/loader";
import { SmallSwitch } from "@/components/ui/custom/small-switch";
import { Badge } from "@/components/ui/badge";

type DefaultDomain = {
  id: string;
  name: string;
  enabled: boolean;
  isExclusive: boolean;
};

export const DomainsClient = () => {
  const { team } = useTeam();
  const [isAddOpen, setIsAddOpen] = useState(false);

  // pagination and filtering
  const pageSize = 5;
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<"all" | "active" | "archived">("active");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const { domains, count, isLoading, error } = useDomains(page, pageSize, status, debouncedSearch);
  const { data: defaultDomains, isLoading: defaultDomainsLoading } = useDefaultDomains();
  const [defaultDomainsState, setDefaultDomainsState] = useState<DefaultDomain[]>(defaultDomains);

  useEffect(() => {
    setDefaultDomainsState(defaultDomains);
  }, [defaultDomains]);

  useEffect(() => {
    count !== undefined && setTotal(count);
    if (domains?.length === 0 && page > 1) {
      setPage(page - 1);
    }

    return () => {
      setTotal(0);
      setPage(1);
    };
  }, [domains]);

  const mutateDomains = async () => {
    await mutate(
      `/api/domains/${team?.slug}?page=${page}&pageSize=${pageSize}&status=${status}&search=${debouncedSearch}`,
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-nowrap text-xl font-bold">Domains</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <div className="flex items-center space-x-2 max-[768px]:hidden">
            <SearchInput
              name="search domains"
              placeholder="Search domains"
              setSearch={setSearch}
              search={search}
              // disabled={domains?.length === 0 && debouncedSearch === "" && status === "active"}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
            <Select
              value={status}
              onValueChange={(value: "all" | "active" | "archived") => {
                setPage(1);
                setStatus(value);
              }}
              // disabled={domains?.length === 0 && debouncedSearch === "" && status === "active"}
            >
              <SelectTrigger className="h-8 w-auto space-x-2 capitalize">
                <span>{status}</span>
              </SelectTrigger>
              <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
                <SelectGroup>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <Button className="space-x-1.5" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus size={14} />
            <span>Add domain</span>
          </Button>
        </div>
      </div>
      <div className="mt-3 flex items-center space-x-2 min-[768px]:hidden">
        <SearchInput
          name="search domains"
          placeholder="Search domains"
          setSearch={setSearch}
          search={search}
          wrapperClassName="max-w-none"
          inputClassName="w-full"
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <Select
          value={status}
          onValueChange={(value: "all" | "active" | "archived") => {
            setPage(1);
            setStatus(value);
          }}
          // disabled={domains?.length === 0 && debouncedSearch === "" && status === "active"}
        >
          <SelectTrigger className="h-8 w-auto space-x-2 capitalize">
            <span>{status}</span>
          </SelectTrigger>
          <SelectContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
            <SelectGroup>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-6 max-[768px]:mt-3">
        {isLoading || search !== debouncedSearch ? (
          <DomainsSkeleton />
        ) : error ? (
          "an error occurred"
        ) : domains?.length === 0 ? (
          <NoDomains
            setIsOpen={setIsAddOpen}
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
          />
        ) : (
          <DomainsTable domains={domains as Domain[]} mutateDomains={mutateDomains} />
        )}
      </div>
      <div className="mt-6">
        <div className="space-y-0.5">
          <p className="font-semibold">Default domains</p>
          <p className="text-[13px] text-muted-foreground">
            These are the default domains provided by Qryptic. Disabling them will hide them from
            the domain dropdown when creating and editing your links.
          </p>
        </div>
        <div className="mt-3 space-y-4">
          {defaultDomainsLoading ? (
            <Loader />
          ) : (
            defaultDomainsState?.map((domain: DefaultDomain) => (
              <div className="flex items-center justify-between rounded-lg border px-3 py-2.5 shadow-sm">
                <div className="flex items-center space-x-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-gradient-to-tr from-accent/10 to-accent shadow-sm">
                    <Globe size={15} />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-1.5">
                      <p className="text-[13px]">{domain.name}</p>
                      {domain.isExclusive && (
                        <Badge variant="colorful" className="h-[18px] px-2 py-0 text-[11px]">
                          Exclusive
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {domain.name === "qrypt.co"
                        ? "Qryptic's default short domain"
                        : "Qryptic's exclusive domain"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <SmallSwitch
                    disabled={team?.plan.isFree && domain.isExclusive}
                    checked={team?.plan.isFree && domain.isExclusive ? false : domain.enabled}
                    onCheckedChange={async (checked: boolean) => {
                      // enable or disable domain
                      setDefaultDomainsState((prev) =>
                        prev.map((d) => (d.id === domain.id ? { ...d, enabled: checked } : d)),
                      );
                      // update the default domain
                      await fetch(`/api/domains/${team?.slug}/default-domains/${domain.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ enabled: checked }),
                      });
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AddDomain isOpen={isAddOpen} setIsOpen={setIsAddOpen} mutateDomains={mutateDomains} />
      {total > pageSize && (
        <Snackbar
          page={page}
          pageSize={pageSize}
          total={total}
          unit={"domains"}
          setPage={setPage}
          isLoading={isLoading}
          setIsOpen={setIsAddOpen}
        />
      )}
    </>
  );
};
