"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Payment method info</CardTitle>
          {/*<CardDescription>Your default payment method for your subscription.</CardDescription>*/}
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
          <Button size="sm">{paymentMethod ? "Update" : "Add card"}</Button>
        </CardFooter>
      </Card>
    </>
  );
};
