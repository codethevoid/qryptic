"use client";

import { useDomains } from "@/lib/hooks/swr/use-domains";
import { SearchInput } from "@/components/ui/custom/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
      `/api/domains/${team.slug}?page=${page}&pageSize=${pageSize}&status=${status}&search=${debouncedSearch}`,
    );
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-nowrap text-xl font-bold">Domains</p>
        <div className="flex w-full items-center justify-end space-x-2">
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
            <SelectTrigger className="h-8 max-w-[130px] capitalize">{status}</SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button className="space-x-1.5" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus size={14} />
            <span>Add domain</span>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoading || search !== debouncedSearch ? (
          <DomainsSkeleton />
        ) : error ? (
          "an error occurred"
        ) : domains.length === 0 ? (
          <NoDomains
            setIsOpen={setIsAddOpen}
            status={status}
            setStatus={setStatus}
            search={search}
            setSearch={setSearch}
          />
        ) : (
          <DomainsTable domains={domains} mutateDomains={mutateDomains} />
        )}
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
