"use client";

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ConfirmDeleteUser } from "@/app/app.qryptic.io/(dashboard)/account/components/dialogs/confirm-delete-user";

export const DeleteUser = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Card className="border border-destructive/50 dark:border-destructive/75">
        <CardHeader>
          <CardTitle>Delete account</CardTitle>
          <CardDescription className="text-[13px]">
            This will permanently delete your account and all its data. This action cannot be
            undone. Please proceed with caution.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <p className="text-[13px] text-muted-foreground">Proceed with caution</p>
          <Button size="sm" variant="danger" onClick={() => setIsOpen(true)}>
            Delete account
          </Button>
        </CardFooter>
      </Card>
      <ConfirmDeleteUser isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};
