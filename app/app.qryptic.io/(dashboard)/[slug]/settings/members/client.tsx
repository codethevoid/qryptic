"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";
import { useState } from "react";
import { AddMember } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/add-member";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTable } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/members-table";

export const MembersClient = () => {
  const { error, isLoading } = useTeamSettings();
  const [tab, setTab] = useState<"members" | "invites">("members");

  if (error) return <div>Failed to load team settings</div>;

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <AddMember />
      <div className="space-y-3">
        <Tabs defaultValue={"members"}>
          <TabsList className="w-full max-w-[300px] border bg-transparent">
            <TabsTrigger
              className="w-full text-[13px] data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
              value={"members"}
              onClick={() => setTab("members")}
            >
              Members
            </TabsTrigger>
            <TabsTrigger
              className="w-full text-[13px] data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
              value={"invites"}
              onClick={() => setTab("invites")}
            >
              Invites
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === "members" ? <MembersTable /> : "invites table"}
      </div>
    </div>
  );
};
