import { Badge, BadgeProps } from "@/components/ui/badge";

type Plan = "Free" | "Pro" | "Business" | "Enterprise";

type PlanBadgeProps = {
  plan: Plan;
};

export const PlanBadge = ({ plan }: PlanBadgeProps) => {
  const variantMap: Record<Plan | string, BadgeProps["variant"]> = {
    Free: "neutral",
    Pro: "primary",
    Business: "success",
    Enterprise: "warning",
  };

  return <Badge variant={variantMap[plan || "Free"]}>{plan}</Badge>;
};
