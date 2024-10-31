import { TeamSettings } from "@/lib/hooks/swr/use-team-settings";
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

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  invite: TeamSettings["invites"][number] | null;
};

export const PersonalLink = ({ isOpen, setIsOpen, invite }: Props) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]" onOpenAutoFocus={(e) => e.preventDefault()}>
        <CompactDialogHeader>
          <CompactDialogTitle>Personal invite link</CompactDialogTitle>
          <CompactDialogDescription>
            Share this link to invite this person to your team.
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div className="space-y-1.5">
            <Label>Unique invite link</Label>
            <div className="relative">
              <Input
                readOnly
                className="pr-[35px] focus-visible:ring-0"
                value={`${protocol}${appDomain}/invites/${invite?.id}`}
              />
              <CopyButton
                text={`${protocol}${appDomain}/invites/${invite?.id}`}
                className={"absolute right-1.5 top-1/2 h-6 w-6 -translate-y-1/2"}
                variant="default"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            This link will only work for <span className="text-foreground">{invite?.email}</span>
          </p>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
