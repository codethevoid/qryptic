"use client";

import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Loader } from "@/components/layout/loader";
import { useState } from "react";
import { AddMember } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/add-member";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MembersTable } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/members-table";
import { InvitesTable } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/invites-table";
import { InviteByLink } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/dialogs/invite-by-link";

export const MembersClient = () => {
  const { error, isLoading } = useTeamSettings();
  const [tab, setTab] = useState<"members" | "invites">("members");
  const [isInviteByLinkOpen, setIsInviteByLinkOpen] = useState(false);

  if (error) return <div>Failed to load team settings</div>;

  if (isLoading) return <Loader />;

  return (
    <>
      <div className="space-y-6">
        <AddMember setTab={setTab} setIsInviteOpen={setIsInviteByLinkOpen} />
        <div className="space-y-3">
          <Tabs value={tab} onValueChange={(value) => setTab(value as "members" | "invites")}>
            <TabsList className="w-full max-w-[300px] border bg-transparent max-sm:max-w-none">
              <TabsTrigger
                className="w-full text-[13px] data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={"members"}
              >
                Members
              </TabsTrigger>
              <TabsTrigger
                className="w-full text-[13px] data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={"invites"}
              >
                Invites
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {tab === "members" ? (
            <MembersTable setIsTeamInviteOpen={setIsInviteByLinkOpen} />
          ) : (
            <InvitesTable setIsTeamInviteOpen={setIsInviteByLinkOpen} />
          )}
        </div>
      </div>
      <InviteByLink isOpen={isInviteByLinkOpen} setIsOpen={setIsInviteByLinkOpen} />
    </>
  );
};
