import { useEffect, useState } from "react";
import { type Plan } from "@/lib/hooks/swr/use-plans";
import { usePlans } from "@/lib/hooks/swr/use-plans";
import {
  CompactDialogDescription,
  CompactDialogHeader,
  CompactDialogTitle,
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingCard } from "@/components/modals/plans/pricing-card";
import NextLink from "next/link";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { useTeamSettings } from "@/lib/hooks/swr/use-team-settings";
import { toast } from "sonner";
import { mutate } from "swr";
import { previewProration } from "@/actions/plans/change-plan/preview";
import { Skeleton } from "@/components/ui/skeleton";
import { confirmPlanChange } from "@/actions/plans/change-plan/confirm-plan-change";

type ChangePlanProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const ChangePlan = ({ isOpen, setIsOpen }: ChangePlanProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [preview, setPreview] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [interval, setInterval] = useState<"year" | "month">("year");
  const { plans } = usePlans();
  const { data: team } = useTeamSettings();

  const handleChange = async () => {
    setIsLoading(true);
    if (!selectedPlan || !team) return setIsLoading(false);
    const price = selectedPlan?.prices.find((price) => price.interval === interval);
    if (!price) return setIsLoading(false);
    if (price.id === team?.price?.id) return setIsLoading(false);
    const { error, message } = await confirmPlanChange(team?.slug, selectedPlan?.id, price.id);
    if (error) {
      toast.error(message);
      return setIsLoading(false);
    }
    toast.success("Plan changed successfully");
    await mutate(`/api/teams/${team?.slug}/settings`);
    await mutate(`/api/teams/${team?.slug}`);
    setIsOpen(false);
    setIsLoading(false);
  };

  const handlePreview = async (plan: Plan) => {
    setSelectedPlan(plan);
    setIsLoadingPreview(true);
    const price = plan.prices.find((price) => price.interval === interval);
    if (price?.id === team?.price?.id) {
      setIsLoadingPreview(false);
      setPreview(null);
      return;
    }

    const proration = await previewProration(team?.slug as string, plan.id, price?.id as string);
    setPreview(proration);
    setIsLoadingPreview(false);
  };

  useEffect(() => {
    if (isOpen && selectedPlan) {
      // generate new preview when interval changes if plan is not current plan
      handlePreview(selectedPlan);
    }
  }, [interval]);

  useEffect(() => {
    if (isOpen && plans && team) {
      setPreview(null);
      const currPlan = plans.find((plan) => plan.id === team?.plan.id);
      const currPrice = currPlan?.prices.find((price) => price.id === team?.price?.id);
      setSelectedPlan(currPlan || plans[0]);
      setInterval(team?.price?.interval || "year");
      if (!currPrice) handlePreview(plans[0]);
    }
  }, [isOpen, plans, team]);

  if (!plans || team?.plan.isFree || team?.subscriptionStatus !== "active") return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[440px] p-0">
        <CompactDialogHeader>
          <CompactDialogTitle>Change plan</CompactDialogTitle>
          <CompactDialogDescription>
            Select a plan. Changes will take effect immediately. Compare all plans and features{" "}
            <NextLink
              href={`${protocol}${rootDomain}/pricing`}
              target="_blank"
              className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
            >
              here
            </NextLink>
          </CompactDialogDescription>
        </CompactDialogHeader>
        <DialogBody>
          <Tabs defaultValue={selectedPlan?.name}>
            <TabsList className="w-full border bg-transparent">
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={plans[0].name}
                onClick={() => handlePreview(plans[0])}
              >
                Pro
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={plans[1].name}
                onClick={() => handlePreview(plans[1])}
              >
                Business
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-zinc-100 data-[state=active]:shadow-none dark:data-[state=active]:bg-zinc-900"
                value={plans[2].name}
                onClick={() => handlePreview(plans[2])}
              >
                Enterprise
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
              <PricingCard plan={plans[0] as Plan} interval={interval} setInterval={setInterval} />
            </TabsContent>
            <TabsContent value={plans[1].name} className="mt-4">
              <PricingCard plan={plans[1] as Plan} interval={interval} setInterval={setInterval} />
            </TabsContent> */}
          </Tabs>
          <div className="flex items-center justify-between px-0.5">
            <p className="text-sm font-medium">Billed now</p>
            {isLoadingPreview ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <p className="animate-fade-in text-sm font-medium">
                {(preview / 100).toLocaleString("en-us", {
                  style: "currency",
                  currency: "usd",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            )}
          </div>
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
            onClick={handleChange}
            disabled={
              isLoading ||
              isLoadingPreview ||
              team?.price?.id ===
                selectedPlan?.prices.find((price) => price.interval === interval)?.id
            }
            size="sm"
            className={`overflow-hidden rounded-lg text-[13px] transition-[opacity_width_150ms] ${preview ? "w-[210px]" : "w-[101px]"}`}
          >
            {isLoading ? (
              <LoaderCircle size={14} className="animate-spin" />
            ) : team?.price?.id ===
              selectedPlan?.prices.find((price) => price.interval === interval)?.id ? (
              <span className="animate-fade-in">Current plan</span>
            ) : (
              <span className="animate-fade-in">
                {`Change plan${
                  preview
                    ? ` and pay ${(preview / 100).toLocaleString("en-us", {
                        style: "currency",
                        currency: "usd",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : ""
                }`}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
