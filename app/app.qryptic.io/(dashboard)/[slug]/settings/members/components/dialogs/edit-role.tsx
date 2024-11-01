import {
  Dialog,
  DialogContent,
  CompactDialogHeader,
  CompactDialogDescription,
  CompactDialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TeamSettings, useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { z } from "zod";
import { toast } from "sonner";

const roleSchema = z.object({
  role: z.union([z.literal("owner"), z.literal("member")]),
  memberId: z.string(),
});

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  member: TeamSettings["members"][number] | null;
};

export const EditRole = ({ isOpen, setIsOpen, member }: Props) => {
  const { slug } = useParams();
  const { mutate } = useTeamSettings();
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member) setRole(member.role);
  }, [member]);

  const handleEditRole = async () => {
    // test role and memberId
    const values = { role, memberId: member?.id };
    const result = roleSchema.safeParse(values);
    if (result.error) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/teams/${slug}/members/edit-role/${member?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      await mutate();
      setIsOpen(false);
      setIsLoading(false);
      toast.success("Role has been edited");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Failed to edit role");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px]">
        <CompactDialogHeader>
          <CompactDialogTitle>Edit member role</CompactDialogTitle>
          <CompactDialogDescription>
            Change{" "}
            <span className="text-foreground">{member?.user.name || member?.user.email}'s</span>{" "}
            role in the team
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <div className="space-y-1.5">
            <p className="text-[13px] font-medium">Select role</p>
            <div className="space-y-2">
              <div
                className={cn(
                  "rounded-lg border px-3 py-2.5 shadow-sm transition-colors hover:border-primary/30",
                  role === "owner" && "border-primary hover:border-primary",
                )}
                role="button"
                onClick={() => setRole("owner")}
              >
                <p className="text-[13px]">Owner</p>
                <p className="text-xs text-muted-foreground">Full access to the team</p>
              </div>
              <div
                className={cn(
                  "rounded-lg border px-3 py-2.5 shadow-sm transition-colors hover:border-primary/30",
                  role === "member" && "border-primary hover:border-primary",
                )}
                role="button"
                onClick={() => setRole("member")}
              >
                <p className="text-[13px]">Member</p>
                <p className="text-xs text-muted-foreground">Manage links, domains, and tags</p>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="w-[54px]"
            disabled={isLoading || role === member?.role}
            onClick={handleEditRole}
          >
            {isLoading ? <ButtonSpinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
