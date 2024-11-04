"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useState } from "react";
import { ConfirmDeleteTeam } from "@/app/app.qryptic.io/(dashboard)/[slug]/settings/components/dialogs/confirm-delete-team";

export const DeleteTeam = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="border border-destructive/50 dark:border-destructive/75">
        <CardHeader>
          <CardTitle>Delete team</CardTitle>
          <CardDescription className="text-[13px]">
            This will permanently delete your team and all its data. This action cannot be undone.
            Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">Proceed with caution</p>
          <Button size="sm" variant="danger" onClick={() => setIsOpen(true)}>
            Delete team
          </Button>
        </CardFooter>
      </Card>
      <ConfirmDeleteTeam isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
