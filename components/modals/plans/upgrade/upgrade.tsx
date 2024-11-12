import {
  CompactDialogDescription,
  CompactDialogHeader,
  CompactDialogTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePlans } from "@/lib/hooks/swr/use-plans";
import { PricingCard } from "@/components/modals/plans/pricing-card";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { createCheckoutSession } from "@/actions/checkout/create-session";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { TrialStarted } from "@/components/modals/plans/upgrade/trial-started";
import { usePathname } from "next/navigation";
import { ButtonSpinner } from "@/components/ui/custom/button-spinner";
import { type Team } from "@/lib/hooks/swr/use-team";
import { type Plan } from "@/lib/hooks/swr/use-plans";

type UpgradeProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const Upgrade = ({ isOpen, setIsOpen }: UpgradeProps) => {
  const [isTrialStartedOpen, setIsTrialStartedOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [interval, setInterval] = useState<"year" | "month">("year");
  const { plans } = usePlans();
  const { team } = useTeam();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isOpen) setInterval("year");
    if (plans) setSelectedPlan(plans[0]);
  }, [isOpen, plans]);

  if (!plans) return null;

  const handleUpgrade = async () => {
    const price = (selectedPlan as Plan)?.prices.find((price) => price.interval === interval);
    if (!price) return;
    setIsLoading(true);
    const { error, url, message } = await createCheckoutSession(
      price,
      selectedPlan as Plan,
      team as Team,
      path,
    );
    if (error) {
      setIsLoading(false);
      return toast.error(message);
    }

    if (url) return router.push(url);

    await mutate(`/api/teams/${team?.slug as string}`);
    await mutate(`/api/teams/${team?.slug as string}/settings`);
    setIsLoading(false);
    setSelectedPlan(null);
    toast.success(message);
    setIsOpen(false);
    setIsTrialStartedOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[440px] p-0">
          <CompactDialogHeader>
            <CompactDialogTitle>Upgrade your plan</CompactDialogTitle>
            <CompactDialogDescription>Choose the plan that works for you.</CompactDialogDescription>
          </CompactDialogHeader>
          <DialogBody>
            <Tabs defaultValue={plans[0].name}>
              <TabsList className="w-full border bg-transparent">
                <TabsTrigger
                  className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                  value={plans[0]?.name}
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
              <div className="mt-4">
                <PricingCard
                  plan={(selectedPlan as Plan) || plans[0]}
                  interval={interval}
                  setInterval={setInterval}
                />
              </div>
              {/* <TabsContent value={plans[0].name} className="mt-4">
                <PricingCard
                  plan={plans[0] as Plan}
                  interval={interval}
                  setInterval={setInterval}
                />
              </TabsContent>
              <TabsContent value={plans[1].name} className="mt-4">
                <PricingCard
                  plan={plans[1] as Plan}
                  interval={interval}
                  setInterval={setInterval}
                />
              </TabsContent> */}
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
              onClick={handleUpgrade}
              disabled={isLoading}
              size="sm"
              className={`w-[110px] rounded-lg text-[13px]`}
            >
              {/*{isLoading ? (*/}
              {/*  <LoaderCircle size={14} className="animate-spin" />*/}
              {/*) : user?.hasUsedTrial ? (*/}
              {/*  "Upgrade plan"*/}
              {/*) : (*/}
              {/*  "Start 14 day trial"*/}
              {/*)}*/}
              {isLoading ? <ButtonSpinner /> : "Upgrade plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <TrialStarted isOpen={isTrialStartedOpen} setIsOpen={setIsTrialStartedOpen} />
    </>
  );
};
