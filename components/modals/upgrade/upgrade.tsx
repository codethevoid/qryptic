import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Car, LoaderCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { usePlans } from "@/lib/hooks/swr/use-plans";
import { PlanWithPrices } from "@/types/plans";
import { Switch } from "@/components/ui/switch";
import { PricingCard } from "@/components/modals/upgrade/pricing-card";

type UpgradeProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const Upgrade = ({ isOpen, setIsOpen }: UpgradeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [interval, setInterval] = useState<"year" | "month">("year");
  const { plans } = usePlans();

  if (!plans) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-[440px] p-0"
        aria-describedby="Upgrade your plan. Find the plan that works for you. You can change your plan at anytime."
      >
        <div className="rounded-t-lg border-b bg-zinc-50 px-4 py-6 dark:bg-zinc-950">
          <DialogTitle>Upgrade your plan</DialogTitle>
        </div>
        <div className="space-y-4 border-b bg-background px-4 py-6">
          <DialogDescription>
            Find the perfect plan for your team. Upgrade to unlock more features and get the most
            out of your team.
          </DialogDescription>
          <Tabs defaultValue="pro">
            <TabsList className="w-full">
              <TabsTrigger className="w-full" value="pro">
                Pro
              </TabsTrigger>
              <TabsTrigger className="w-full" value="business">
                Business
              </TabsTrigger>
            </TabsList>
            <TabsContent value="pro" className="mt-4">
              <PricingCard
                plan={plans[0] as PlanWithPrices}
                interval={interval}
                setInterval={setInterval}
              />
            </TabsContent>
            <TabsContent value="business" className="mt-4">
              <PricingCard
                plan={plans[1] as PlanWithPrices}
                interval={interval}
                setInterval={setInterval}
              />
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex w-full items-center justify-end space-x-2 rounded-b-lg bg-zinc-50 p-4 dark:bg-zinc-950">
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg text-[13px]"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button disabled={isLoading} size="sm" className="w-[100px] rounded-lg text-[13px]">
            {isLoading ? <LoaderCircle size={14} className="animate-spin" /> : "Upgrade plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
