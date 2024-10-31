import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import {
  CompactDialogHeader,
  Dialog,
  CompactDialogTitle,
  CompactDialogDescription,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/ui/custom/copy-button";
import { useState } from "react";
import { toast } from "sonner";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const InviteByLink = ({ isOpen, setIsOpen }: Props) => {
  const { data: team, mutate } = useTeamSettings();
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/teams/${team?.slug}/invites/reset-token`);
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      await mutate();
      setIsLoading(false);
      toast.success("Invite link has been reset");
    } catch (e) {
      setIsLoading(false);
      toast.error("Failed to reset invite link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <CompactDialogHeader>
          <CompactDialogTitle>Invite by link</CompactDialogTitle>
          <CompactDialogDescription>
            Share this link to invite members to your team.
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div className="space-y-1.5">
            <Label>Your invite link</Label>
            <div className="relative">
              <Input
                readOnly
                className="pr-[35px] focus-visible:ring-0"
                value={`${protocol}${appDomain}/invites/teams/${team?.inviteToken}`}
              />
              <CopyButton
                text={`${protocol}${appDomain}/invites/teams/${team?.inviteToken}`}
                className={"absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2"}
                variant="default"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Anyone with this link can join your team.</p>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
          <Button size="sm" className="w-[84px]" disabled={isLoading} onClick={handleReset}>
            {isLoading ? <ButtonSpinner /> : "Reset link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
