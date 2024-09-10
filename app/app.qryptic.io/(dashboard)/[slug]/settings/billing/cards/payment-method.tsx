"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardProvider } from "@/components/modals/add-card/card-provider";

type PaymentMethodProps = {
  paymentMethod: {
    type: string;
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
};

export const PaymentMethodCard = ({ paymentMethod }: PaymentMethodProps) => {
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
      />
    </>
  );
};
