"use client";

import { useDomains } from "@/lib/hooks/swr/use-domains";
import { SearchInput } from "@/components/ui/custom/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddDomain } from "@/components/modals/domains/add-domain";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { NoDomains } from "@/components/empty/domains/no-domains";
import { useTeam } from "@/lib/hooks/swr/use-team";

export const DomainsClient = () => {
  const { domains, isLoading, error } = useDomains();
  const { team } = useTeam();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-nowrap text-xl font-bold">Domains</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <SearchInput
            placeholder="Search domains"
            setSearch={setSearch}
            search={search}
            disabled={domains?.length === 0 && debouncedSearch === ""}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="space-x-1.5" size="sm" onClick={() => setIsAddOpen(true)}>
            <Plus size={14} />
            <span>Add domain</span>
          </Button>
        </div>
      </div>
      <div className="mt-6">
        {isLoading ? (
          "loading domains"
        ) : error ? (
          "an error occurred"
        ) : domains.length === 0 ? (
          <NoDomains setIsOpen={setIsAddOpen} />
        ) : (
          "domains found"
        )}
      </div>
      <AddDomain isOpen={isAddOpen} setIsOpen={setIsAddOpen} />
    </>
  );
};
