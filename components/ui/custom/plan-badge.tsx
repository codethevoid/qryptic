import { Badge, BadgeProps } from "@/components/ui/badge";
import { PlanName } from "@/types/plans";

type PlanBadgeProps = {
  plan: PlanName;
  className?: string;
};

export const PlanBadge = ({ plan, className }: PlanBadgeProps) => {
  const variantMap: Record<PlanName | string, BadgeProps["variant"]> = {
    Free: "neutral",
    Pro: "colorful",
    Business: "primary",
    Enterprise: "purple",
  };

  return (
    <Badge variant={variantMap[plan || "Free"]} className={className}>
      {plan}
    </Badge>
  );
};
