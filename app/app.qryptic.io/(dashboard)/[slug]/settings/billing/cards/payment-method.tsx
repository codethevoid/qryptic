"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardProvider } from "@/components/modals/add-card/card-provider";
import { CircleCheck, CreditCard, Dot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TeamSettings } from "@/lib/hooks/swr/use-team-settings";

type PaymentMethodProps = {
  paymentMethod: TeamSettings["paymentMethod"] | undefined;
  name: string;
};

export const PaymentMethodCard = ({ paymentMethod, name: teamName }: PaymentMethodProps) => {
  const [isCardProviderOpen, setIsCardProviderOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment method info</CardTitle>
        </CardHeader>
        <CardContent>
          {!paymentMethod && (
            <div>
              <p className="text-sm font-medium">No payment method on file</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Add a card to keep your subscription active after your trial ends.
              </p>
            </div>
          )}
          {paymentMethod && (
            <div className="flex w-full max-w-[500px] items-center justify-between rounded-lg border px-3 py-2">
              <div className="flex items-center space-x-2">
                <CreditCard size={16} />
                <p className="text-[13px] capitalize">{paymentMethod.brand}</p>
                <div className="flex items-center">
                  <div className="flex items-center -space-x-2.5">
                    <Dot size={14} />
                    <Dot size={14} />
                    <Dot size={14} />
                    <Dot size={14} />
                  </div>
                  <p className="text-[13px]">{paymentMethod.last4}</p>
                </div>
                <Badge variant="primary" className="items-center space-x-1 px-2 py-0.5">
                  <CircleCheck size={13} />
                  <span>Default</span>
                </Badge>
              </div>
              <p className="text-[13px] text-muted-foreground">
                {`expires ${paymentMethod.expMonth}/${paymentMethod.expYear}`}
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end rounded-b-lg border-t bg-zinc-50 px-6 py-3 dark:bg-zinc-950">
          <Button size="sm" onClick={() => setIsCardProviderOpen(true)}>
            {paymentMethod ? "Update card" : "Add card"}
          </Button>
        </CardFooter>
      </Card>
      <CardProvider
        isOpen={isCardProviderOpen}
        hasPaymentMethod={!!paymentMethod}
        setIsOpen={setIsCardProviderOpen}
        name={teamName}
      />
    </>
  );
};
