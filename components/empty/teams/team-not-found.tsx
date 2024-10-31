"use client";

import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";

export const TeamNotFound = () => {
  // const { slug } = useParams();
  // const { user } = useUser();
  // const { teams } = useTeams();
  // const { update } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
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
        <Button className="w-full max-w-[200px]" asChild>
          <NextLink href="/teams">Back to my teams</NextLink>
        </Button>
      </div>
    </Card>
  );
};
