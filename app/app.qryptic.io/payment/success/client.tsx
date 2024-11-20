"use client";

import { PartyPopper, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { GodRays } from "@/components/layout/god-rays";
import { QrypticIcon } from "@/components/logos/qryptic-icon";

export const PaymentSuccessClient = ({ plan }: { plan: string }) => {
  return (
    <>
      <GodRays />
      <div className="flex h-screen min-h-fit w-full items-center justify-center px-4">
        <div className="max-w-[440px] space-y-6 rounded-xl border bg-background px-4 py-6 shadow-lg">
          {/* <Rocket size={30} className="mx-auto" /> */}
          <QrypticIcon className="mx-auto h-6 w-6" />
          <div className="space-y-1">
            <p className="text-center text-lg font-semibold">
              Welcome to Qryptic {plan.slice(0, 1).toUpperCase() + plan.slice(1)}!
            </p>
            <p className="text-center text-[13px] text-muted-foreground">
              Thank you for subscribing and joining us on this journey! We're thrilled to have you
              as part of our community and can't wait to see how you'll help shape Qryptic into
              something truly extraordinary.
            </p>
          </div>
          <div className="mx-auto w-fit max-sm:w-full">
            <Button asChild className="max-sm:w-full">
              <NextLink href={`/`}>Continue to dashboard</NextLink>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
