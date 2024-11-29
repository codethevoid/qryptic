import { Card } from "@/components/ui/card";
import { FilterX, Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

type NoDomainsProps = {
  setIsOpen: (value: boolean) => void;
  setStatus: (value: "all" | "active" | "archived") => void;
  status: "all" | "active" | "archived";
  search: string;
  setSearch: (value: string) => void;
};

export const NoDomains = ({ setIsOpen, status, setStatus, search, setSearch }: NoDomainsProps) => {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center bg-zinc-50 p-6 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm dark:bg-gradient-to-tr dark:from-background dark:to-accent">
          {search !== "" ? <FilterX size={18} /> : <Globe size={18} />}
        </div>
        <div>
          <p className="text-center font-medium">
            {search !== ""
              ? "No domains found"
              : status === "all"
                ? "No domains found"
                : status === "active"
                  ? "No custom domains"
                  : "No archived domains"}
          </p>
          <p className="mt-0.5 text-center text-sm text-muted-foreground">
            {search !== ""
              ? "Try a different search term"
              : status === "all" || status === "active"
                ? "Add a domain for brand consistency."
                : "You don't have any archived domains."}
          </p>
        </div>
        <Button
          className="w-full min-w-[200px] max-w-[200px]"
          onClick={
            search !== ""
              ? () => setSearch("")
              : status === "active" || status === "all"
                ? () => setIsOpen(true)
                : () => setStatus("active")
          }
        >
          {search !== ""
            ? "Clear search"
            : status === "active" || status === "all"
              ? "Add a domain"
              : "View active domains"}
        </Button>
      </div>
    </Card>
  );
};
