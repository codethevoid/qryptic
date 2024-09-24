"use client";

import { Card } from "@/components/ui/card";
import { LoaderCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useUser } from "@/lib/hooks/swr/use-user";
import { useParams } from "next/navigation";
import { useTeams } from "@/lib/hooks/swr/use-teams";
import { updateDefaultTeam } from "@/actions/users/update-default-team";
import NextLink from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const TeamNotFound = () => {
  const { slug } = useParams();
  const { user } = useUser();
  const { teams } = useTeams();
  const { update } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (slug !== user?.defaultTeam && user?.defaultTeam) {
      return router.push("/teams");
    }
    // make sure user's default team is not accessible before updating
    const team = teams?.find((t: any) => t.slug === user?.defaultTeam);
    if (team) return router.push("/teams");
    // if this is showing up, it means the user got booted from their team
    // and their default team is no longer accessible, so we need to update cookie
    setIsLoading(true);
    if (!teams?.length) return router.push("/teams");
    const { error } = await updateDefaultTeam(teams[0]?.slug || null);
    if (!error) await update({ defaultTeam: teams[0]?.slug || null });
    router.push("/teams");
  };

  return (
    <Card className="flex h-[300px] flex-col items-center justify-center bg-zinc-50 p-6 shadow dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white shadow-sm dark:bg-gradient-to-tr dark:from-background dark:to-accent">
          <Users size={18} />
        </div>
        <div>
          <p className="text-center font-medium">Team not found</p>
          <p className="mt-0.5 max-w-[300px] text-center text-sm text-muted-foreground">
            It looks like the team you're looking for either doesn't exist or you don't have access
            to it.
          </p>
        </div>
        <Button className="w-full max-w-[200px]" disabled={isLoading} onClick={handleCheck}>
          {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Back to my teams"}
        </Button>
      </div>
    </Card>
  );
};
