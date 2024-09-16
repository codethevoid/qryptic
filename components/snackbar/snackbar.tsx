import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, LoaderCircle } from "lucide-react";
import { useState } from "react";

type SnackbarProps = {
  page: number;
  pageSize: number;
  total: number;
  unit: string;
  setIsOpen?: (value: boolean) => void;
  setPage: (page: number) => void;
  isLoading: boolean;
};

export const Snackbar = ({
  page,
  pageSize,
  total,
  unit,
  setIsOpen,
  setPage,
  isLoading,
}: SnackbarProps) => {
  const [lastAction, setLastAction] = useState<"next" | "prev" | null>(null);

  const handleNext = () => {
    setLastAction("next");
    setPage(page + 1);
  };
  const handlePrev = () => {
    setLastAction("prev");
    setPage(page - 1);
  };

  return (
    <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center space-x-3 rounded-full border bg-background py-2 pl-3.5 pr-2.5 shadow-[0_6px_20px] shadow-foreground/15 dark:shadow-none">
      <p className="text-nowrap text-[13px]">
        Showing {pageSize * (page - 1) + 1}-{Math.min(pageSize * page, total)} of {total} {unit}
      </p>
      <Separator orientation="vertical" className="h-5 bg-border" />
      <div className="flex items-center space-x-1.5">
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          disabled={page === 1 || isLoading}
          onClick={handlePrev}
        >
          {lastAction === "prev" && isLoading ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <ChevronLeft size={14} />
          )}
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full"
          disabled={pageSize * page >= total || isLoading}
          onClick={handleNext}
        >
          {lastAction === "next" && isLoading ? (
            <LoaderCircle size={14} className="animate-spin" />
          ) : (
            <ChevronRight size={14} />
          )}
        </Button>
        {setIsOpen && (
          <Button
            disabled={isLoading}
            size="icon"
            className="rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};
