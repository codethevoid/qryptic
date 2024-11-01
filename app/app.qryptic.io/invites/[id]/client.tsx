"use client";

import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

type Props = {
  invite: { team: { name: string; image: string; id: string; slug: string } };
};

export const InviteClient = ({ invite }: Props) => {
  const { id } = useParams();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const router = useRouter();

  const onAccept = async () => {
    setIsAccepting(true);
    try {
      const res = await fetch(`/api/invites/accept/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: invite.team.id }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "User is already a member of the team") {
          router.push(`/${invite.team.slug}`);
        }
        toast.error(data.error);
        setIsAccepting(false);
        return;
      }

      router.push(`/${invite.team.slug}`);
    } catch (e) {
      console.error(e);
      toast.error("Failed to accept invite");
      setIsAccepting(false);
    }
  };

  const onDecline = async () => {
    setIsDeclining(true);
    try {
      const res = await fetch(`/api/invites/decline/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsDeclining(false);
        return;
      }

      router.push("/");
    } catch (e) {
      console.error(e);
      toast.error("Failed to decline invite");
      setIsDeclining(false);
    }
  };

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
      <QrypticLogo className="h-[18px]" />
      <div className="w-full space-y-4 rounded-xl border bg-background p-6 shadow-lg">
        <div className="flex justify-center">
          <NextImage
            src={invite.team.image}
            alt={invite.team.name}
            height={256}
            width={256}
            quality={100}
            className="aspect-square h-12 w-12 rounded-full border object-cover"
          />
        </div>
        <div className="mx-auto w-full max-w-[320px]">
          <p className="text-center font-semibold">Join team {invite.team.name}</p>
          <p className="text-center text-[13px] text-muted-foreground">
            You&apos;ve been invited to join team{" "}
            <span className="text-foreground">{invite.team.name}</span> on Qryptic! You can either
            accept or decline the invite.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[320px] space-y-2.5">
          <Button className="w-full" disabled={isAccepting || isDeclining} onClick={onAccept}>
            {isAccepting ? <ButtonSpinner /> : "Accept"}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            disabled={isAccepting || isDeclining}
            onClick={onDecline}
          >
            {isDeclining ? <ButtonSpinner /> : "Decline"}
          </Button>
        </div>
      </div>
    </div>
  );
};
