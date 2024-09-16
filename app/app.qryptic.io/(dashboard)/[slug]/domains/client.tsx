"use client";

import { useDomains } from "@/lib/hooks/swr/use-domains";
import { SearchInput } from "@/components/ui/custom/search-input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export const DomainsClient = () => {
  const { domains, isLoading, error } = useDomains();
  const [search, setSearch] = useState("");

  return (
    <>
      <div className="flex items-center justify-between">
        <p className="text-nowrap text-xl font-bold">Domains</p>
        <div className="flex w-full items-center justify-end space-x-2">
          <SearchInput
            placeholder="Search domains"
            setSearch={setSearch}
            search={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button className="space-x-1.5" size="sm">
            <Plus size={14} />
            <span>Add domain</span>
          </Button>
        </div>
      </div>
    </>
  );
};
