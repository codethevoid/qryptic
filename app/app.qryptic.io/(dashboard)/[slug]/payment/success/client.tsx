"use client";

import { useParams } from "next/navigation";
import { PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";

export const PaymentSuccessClient = () => {
  const { slug } = useParams();

  return (
    <div className="flex w-full flex-col items-center">
      <PartyPopper size={24} className="mb-2" />
      <p className="mb-2 text-lg font-semibold">Payment successful!</p>
      <p className="mb-4 text-sm text-muted-foreground">
        You can now enjoy increased limits and premium features.
      </p>
      <Button asChild size="sm">
        <NextLink href={`/${slug}`}>Continue to dashboard</NextLink>
      </Button>
    </div>
  );
};
