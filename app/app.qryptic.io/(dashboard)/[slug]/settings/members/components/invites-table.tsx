import { TeamSettings, useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleX, Link2, MailX, MoreHorizontal, Pencil, UserMinus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { PersonalLink } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/dialogs/personal-link";
import { RevokeInvite } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/members/components/dialogs/revoke-invite";

type Props = {
  setIsTeamInviteOpen: (open: boolean) => void;
};

type Invite = TeamSettings["invites"][number];

export const InvitesTable = ({ setIsTeamInviteOpen }: Props) => {
  const { data: team } = useTeamSettings();
  const [selected, setSelected] = useState<Invite | null>(null);
  const [isPersonalLinkOpen, setIsPersonalLinkOpen] = useState(false);
  const [isRevokeOpen, setIsRevokeOpen] = useState(false);

  return (
    <>
      {team?.invites.length === 0 ? (
        <InvitesEmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div
            className={
              "flex items-center justify-between border-b bg-zinc-50 px-3 py-2.5 dark:bg-zinc-950"
            }
          >
            <div className="flex items-center space-x-2">
              {/*<Checkbox*/}
              {/*  id="all-members"*/}
              {/*  disabled={team?.members.length === 1}*/}
              {/*  checked={*/}
              {/*    checked.length === (team?.members.length as number) - 1 &&*/}
              {/*    (team?.members.length as number) > 1*/}
              {/*  }*/}
              {/*  onCheckedChange={(checked: boolean) => handleCheckAll(checked)}*/}
              {/*/>*/}
              {/*<Label htmlFor="all-members">Select all ({team?.members.length})</Label>*/}
              <p className="text-[13px]">{`Invites (${team?.invites.length})`}</p>
            </div>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost">
                  <MoreHorizontal size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()} align="end">
                <DropdownMenuItem
                  className="space-x-2"
                  disabled={team?.plan.isFree}
                  onSelect={() => setIsTeamInviteOpen(true)}
                >
                  <Link2 size={13} />
                  <span className="text-[13px]">Invite link</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {team?.invites.map((invite, i) => (
            <div
              key={invite.id}
              className={cn(
                "flex min-w-0 items-center justify-between space-x-4 px-3 py-2.5",
                i !== 0 && "border-t",
              )}
            >
              <div className="flex min-w-0 items-center space-x-2.5">
                {/*<Checkbox disabled={member.user.id === user?.id} />*/}
                <Avatar className="h-8 w-8 shrink-0 border">
                  <AvatarFallback className="bg-zinc-50 text-xs uppercase dark:bg-zinc-950">
                    {invite.email[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="min-w-0 truncate text-[13px]">{invite.email.split("@")[0]}</p>
                  <p className="min-w-0 truncate text-xs text-muted-foreground">{invite.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center space-x-2.5">
                <p className="text-[13px] capitalize text-muted-foreground">{invite.role}</p>
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="active:!scale-100">
                      <MoreHorizontal size={13} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
                    <DropdownMenuItem
                      className="space-x-2"
                      onSelect={() => {
                        setSelected(invite);
                        setIsPersonalLinkOpen(true);
                      }}
                    >
                      <Link2 size={13} />
                      <span className="text-[13px]">Invite link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="space-x-2 text-red-600 hover:!bg-red-500/10 hover:!text-red-600 dark:text-red-500 dark:hover:!text-red-500"
                      onSelect={() => {
                        setSelected(invite);
                        setIsRevokeOpen(true);
                      }}
                    >
                      <MailX size={13} />
                      <span className="text-[13px]">Revoke invite</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      )}
      <PersonalLink
        isOpen={isPersonalLinkOpen}
        setIsOpen={setIsPersonalLinkOpen}
        invite={selected}
      />
      <RevokeInvite isOpen={isRevokeOpen} setIsOpen={setIsRevokeOpen} invite={selected} />
    </>
  );
};

const InvitesEmptyState = () => {
  return (
    <div className="flex h-52 w-full items-center justify-center rounded-lg border bg-zinc-50 p-4 shadow-sm dark:bg-zinc-950">
      <div className="flex flex-col items-center space-y-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-white to-white shadow-sm dark:from-accent/10 dark:to-accent">
          <MailX size={15} />
        </div>
        <div className="space-y-0.5">
          <p className="text-center text-sm font-medium">No invites found</p>
          <p className="text-center text-[13px] text-muted-foreground">
            Invite members to collaborate
          </p>
        </div>
      </div>
    </div>
  );
};
