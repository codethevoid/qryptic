"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type CreateTeamProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const CreateTeam = ({ isOpen, setIsOpen }: CreateTeamProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Creat a new team</DialogTitle>
          <DialogDescription>
            A team is a shared workspace where you can collaborate with your team members. You can
            create multiple teams to organize your work.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Input placeholder="Team name" />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)} size="sm" variant="outline">
            Cancel
          </Button>
          <Button size="sm" className="text-[13px]">
            Create team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
