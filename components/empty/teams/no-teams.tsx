import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const NoTeams = ({ setCreateTeamOpen }: { setCreateTeamOpen: (value: boolean) => void }) => {
  return (
    <Card className="flex h-[300px] flex-col items-center justify-center bg-zinc-50 p-6 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm dark:bg-gradient-to-tr dark:from-background dark:to-accent">
          <Users size={18} />
        </div>
        <div>
          <p className="text-center font-medium">No active teams</p>
          <p className="mt-0.5 text-center text-sm text-muted-foreground">
            Create a team to get started
          </p>
        </div>
        <Button className="w-full max-w-[200px]" onClick={() => setCreateTeamOpen(true)}>
          Create team
        </Button>
      </div>
    </Card>
  );
};
