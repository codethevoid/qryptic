"use client";

import { QrypticLogo } from "@/components/logos/qryptic-logo";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { useState } from "react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

type Props = {
  team: { id: string; name: string; image: string; slug: string };
};

export const TeamInviteClient = ({ team }: Props) => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onJoin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/invites/join/${token}`, { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error);
        setIsLoading(false);
        return;
      }

      router.push(`/${team.slug}`);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      toast.error("Failed to join team");
    }
  };

  return (
    <div className="flex w-full max-w-[420px] flex-col items-center space-y-6">
      <QrypticLogo className="h-[18px]" />
      <div className="w-full space-y-4 rounded-xl border bg-background px-6 py-10 shadow-lg">
        <div className="flex justify-center">
          <NextImage
            src={team.image}
            alt={team.name}
            height={256}
            width={256}
            quality={100}
            className="aspect-square h-12 w-12 rounded-full border object-cover"
          />
        </div>
        <div className="mx-auto w-full max-w-[320px]">
          <p className="text-center font-semibold">Join team {team.name}</p>
          <p className="text-center text-[13px] text-muted-foreground">
            You&apos;ve been invited to join team{" "}
            <span className="text-foreground">{team.name}</span> on Qryptic! Join now to start
            collaborating.
          </p>
        </div>
        <div className="mx-auto w-full max-w-[320px] space-y-2.5">
          <Button className="w-full" disabled={isLoading} onClick={onJoin}>
            {isLoading ? <ButtonSpinner /> : "Join team"}
          </Button>
        </div>
      </div>
    </div>
  );
};
