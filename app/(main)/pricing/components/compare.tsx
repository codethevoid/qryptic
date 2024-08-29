"use client";
import type { Plan, Price } from "@prisma/client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { CircleCheck, Minus, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

type CustomPlan = Plan & {
  prices: Price[];
};

type CompareProps = {
  plans: CustomPlan[];
};

// this will format the analytics data based on the number of days
const getAnalytics = (days: number) => {
  const years = days >= 365 ? days / 365 : null;
  if (years) return `${years} year${years > 1 ? "s" : ""}`;
  // if days is greater than 90, divide by 30 to get months
  const months = days >= 90 ? days / 30 : null;
  if (months) return `${months} months`;
  return `${days} days`;
};

export const Compare = ({ plans }: CompareProps) => {
  return (
    <div className="px-4">
      <MaxWidthWrapper>
        <div className="mb-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight">
            Compare the full suite of features
          </h2>
          <p className="mt-2 text-center text-muted-foreground">
            Find the plan that&apos;s right for your business. You can change your plan anytime.
          </p>
        </div>
        <div className="sticky top-[48px] grid w-full grid-cols-[230px_1fr_1fr_1fr_1fr]">
          <div className="compare-grid-item flex items-center space-y-2 border-b border-r-0 bg-background p-4">
            {/*<p className="text-sm font-medium text-muted-foreground">Features and limits</p>*/}
            {/*<p className="text-sm text-muted-foreground">Select a plan to get started.</p>*/}
          </div>
          {plans.map((plan: Plan, index) => (
            <div
              className="compare-grid-item flex items-center justify-between border border-b border-r-0 bg-card p-4 max-[1100px]:flex-col max-[1100px]:space-y-3"
              key={plan.id}
            >
              <p className="text-sm font-medium">{plan.name}</p>
              <Button
                className={`rounded-full max-[1100px]:w-full ${index === 1 ? "bg-deepBlue-500 text-white hover:bg-deepBlue-600" : ""}`}
                size="sm"
                variant={plan.isFree ? "outline" : "default"}
              >
                {plan.isFree ? "Start for free" : "Start free trial"}
              </Button>
            </div>
          ))}
          <div className="compare-grid-item flex items-center justify-between border border-b border-r-0 bg-card p-4 max-[1100px]:flex-col max-[1100px]:space-y-3">
            <p className="text-sm font-medium">Enterprise</p>
            <Button size="sm" className="rounded-full max-[1100px]:w-full">
              Contact sales
            </Button>
          </div>
        </div>
        <div className="grid w-full grid-cols-[230px_1fr_1fr_1fr_1fr] bg-card">
          {/* QR codes  */}
          <TableCell value="QR Codes" className="justify-start border-t-0 font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell
              key={plan.id}
              value={`${plan.links.toLocaleString("en-us")}/mo`}
              className="border-t-0"
            />
          ))}
          <TableCell value="Custom" className="border-t-0" />

          {/* Custom links row */}
          <TableCell value="Short links" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={`${plan.links.toLocaleString("en-us")}/mo`} />
          ))}
          <TableCell value="Custom" />

          {/* Click and scan tracking row */}
          <TableCell value="Scans and clicks" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={"Unlimited"} />
          ))}
          <TableCell value="Unlimited" />

          {/* Analytics row */}
          <TableCell value="Analytical data" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={getAnalytics(plan.analytics)} />
          ))}
          <TableCell value="Custom" />

          {/* Redirects row */}
          <TableCell value="Redirects" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell
              key={plan.id}
              value={
                !plan.redirects ? (
                  <Minus size={18} className="text-muted-foreground" />
                ) : (
                  "Unlimited"
                )
              }
            />
          ))}
          <TableCell value="Unlimited" />

          {/* Redirects row */}
          <TableCell value="Bulk creation" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.bulk ? (
                  `${plan.links.toLocaleString("en-us")}/mo`
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value="Custom" />

          {/* QR Customization */}
          <TableCell value="QR customization" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={plan.qrCustomization ? "Enhanced" : "Limited"} />
          ))}
          <TableCell value={"Enhanced"} />

          {/* Platform seats */}
          <TableCell value="Platform seats" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={plan.seats} />
          ))}
          <TableCell value={"Custom"} />

          {/* Custom domains */}
          <TableCell value="Custom domains" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={plan.domains} />
          ))}
          <TableCell value={"Custom"} />

          <TableCell value="SSL certificates" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={<CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />}
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          <TableCell value="Domain redirector" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.domainRedirector ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* UTM Builder */}
          <TableCell value="UTM builder" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={<CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />}
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* api access */}
          <TableCell value="API access (coming soon)" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.apiAccess ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* AI QR Customization */}
          <TableCell value="AI QR generation" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.qrCustomization ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* AI insights */}
          <TableCell value="AI insights" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.aiInsights ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          <TableCell value="Custom link previews" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.linkPreviews ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* link expiration */}
          <TableCell value="Link expiration" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.smartRules ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* link cloaking */}
          <TableCell value="Link cloaking" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.smartRules ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* password protection */}
          <TableCell
            value="Password protection"
            className="justify-between font-medium"
            info="Protect your pages from being accessed."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.smartRules ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* smart redirects */}
          <TableCell value="Smart redirects" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.smartRules ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* access controls */}
          <TableCell value="Role-based access controls" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.rbac ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* single sign on */}
          <TableCell value="Single sign-on (SSO)" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.sso ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* single sign on */}
          <TableCell value="Service level agreement" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.sla ? (
                  <CircleCheck size={18} className={i === 1 ? "text-deepBlue-500" : ""} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* single sign on */}
          <TableCell value="Dedicated support manager" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={<Minus size={18} className="text-muted-foreground" />}
            />
          ))}
          <TableCell value={<CircleCheck size={18} />} />

          {/* single sign on */}
          <TableCell value="Support level" className="justify-start font-medium" />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell key={plan.id} value={plan.supportLevel} />
          ))}
          <TableCell value="Dedicated" />
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

type CellProps = {
  value: string | number | ReactNode;
  className?: string;
  info?: string;
};

const TableCell = ({ value, className, info }: CellProps) => {
  return (
    <div
      className={cn(
        "compare-grid-item flex items-center justify-center border border-b-0 border-r-0 p-4 text-center text-sm",
        className,
      )}
    >
      <p>{value}</p>
      {info && (
        <Tooltip>
          <TooltipTrigger className="cursor-auto">
            <Info
              size={15}
              className="relative top-[1px] flex items-center text-muted-foreground"
            />
          </TooltipTrigger>
          <TooltipContent>{info}</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
