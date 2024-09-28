import { Card } from "@/components/ui/card";
import { Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NoTags = ({ setIsOpen }: { setIsOpen: (value: boolean) => void }) => {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center bg-zinc-50 p-6 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm dark:bg-gradient-to-tr dark:from-background dark:to-accent">
          <Tag size={18} />
        </div>
        <div>
          <p className="text-center font-medium">No tags created yet</p>
          <p className="mt-0.5 text-center text-sm text-muted-foreground">
            Create a tag to organize your links
          </p>
        </div>
        <Button className="w-full max-w-[200px]" onClick={() => setIsOpen(true)}>
          Create a tag
        </Button>
      </div>
    </Card>
  );
};
