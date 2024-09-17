import { Card } from "@/components/ui/card";
import { Globe, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NoDomains = ({ setIsOpen }: { setIsOpen: (value: boolean) => void }) => {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center bg-zinc-50 p-6 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm dark:bg-gradient-to-tr dark:from-background dark:to-accent">
          <Globe size={18} />
        </div>
        <div>
          <p className="text-center font-medium">No domains added yet</p>
          <p className="mt-0.5 text-center text-sm text-muted-foreground">
            Add a domain for brand consistency.
          </p>
        </div>
        <Button className="w-full max-w-[200px]" onClick={() => setIsOpen(true)}>
          Add a domain
        </Button>
      </div>
    </Card>
  );
};
