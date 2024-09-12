import { useEffect, useState } from "react";
import { PlanWithPrices } from "@/types/plans";
import { usePlans } from "@/lib/hooks/swr/use-plans";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCard } from "@/components/modals/plans/pricing-card";
import NextLink from "next/link";
import { protocol, rootDomain } from "@/lib/constants/domains";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { changeTrial } from "@/actions/plans/change-trial";
import { toast } from "sonner";
import { mutate } from "swr";

type ChangeTrialProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ChangeTrial = ({ isOpen, setIsOpen }: ChangeTrialProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanWithPrices | null>(null);
  const [interval, setInterval] = useState<"year" | "month">("year");
  const { plans } = usePlans();
  const { settings: team } = useTeamSettings();

  useEffect(() => {
    if (isOpen && plans && team) {
      const currPlan = plans.find((plan) => plan.id === team?.plan.id);
      setSelectedPlan(currPlan || plans[0]);
      setInterval(team?.price.interval || "year");
    }
  }, [isOpen, plans, team]);

  const handleTrialChange = async () => {
    if (!selectedPlan) return;
    setIsLoading(true);
    const price = selectedPlan.prices.find((price) => price.interval === interval);
    const { error, message } = await changeTrial(price?.id as string, selectedPlan.id, team?.id);
    if (error) {
      setIsLoading(false);
      return toast.error(message);
    }

    // mutate team to update plan
    const keys = [`/api/teams/${team?.slug}`, `/api/teams/${team?.slug}/settings`];
    await Promise.all(keys.map((key) => mutate(key)));
    setIsLoading(false);
    setIsOpen(false);
  };

  if (!plans || team?.plan.isFree || team.subscriptionStatus !== "trialing") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px] p-0">
        <DialogHeader>
          <DialogTitle>Change plan</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <DialogDescription>Select a plan to change your trial to.</DialogDescription>
          <Tabs defaultValue={selectedPlan?.name}>
            <TabsList className="w-full border bg-transparent">
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={plans[0].name}
                onClick={() => setSelectedPlan(plans[0])}
              >
                Pro
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={plans[1].name}
                onClick={() => setSelectedPlan(plans[1])}
              >
                Business
              </TabsTrigger>
            </TabsList>
            <TabsContent value={plans[0].name} className="mt-4">
              <PricingCard
                plan={plans[0] as PlanWithPrices}
                interval={interval}
                setInterval={setInterval}
              />
            </TabsContent>
            <TabsContent value={plans[1].name} className="mt-4">
              <PricingCard
                plan={plans[1] as PlanWithPrices}
                interval={interval}
                setInterval={setInterval}
              />
            </TabsContent>
          </Tabs>
          <p className="text-[13px] text-muted-foreground">
            Compare all plans and features{" "}
            <NextLink
              className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
              href={`${protocol}${rootDomain}/pricing`}
              target="_blank"
            >
              here
            </NextLink>
          </p>
        </DialogBody>
        <DialogFooter>
          <Button
            size="sm"
            variant="outline"
            className="rounded-lg text-[13px]"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            disabled={
              isLoading ||
              team?.price.id ===
                selectedPlan?.prices.find((price) => price.interval === interval)?.id
            }
            size="sm"
            className={`w-[102px] rounded-lg text-[13px]`}
            onClick={handleTrialChange}
          >
            {isLoading ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : team?.price.id ===
              selectedPlan?.prices.find((price) => price.interval === interval)?.id ? (
              "Current plan"
            ) : (
              "Change plan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
