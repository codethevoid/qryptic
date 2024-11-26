"use client";

import type { Plan, Price } from "@prisma/client";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Minus, Info } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { CircleCheckFill } from "@/components/ui/icons/circle-check-fill";
import { useInView } from "react-intersection-observer";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import { MobileCompare } from "./mobile-compare";

type CustomPlan = Plan & {
  prices: Price[];
};

type CompareProps = {
  plans: CustomPlan[];
};

// this will format the analytics data based on the number of days
const getAnalytics = (days: number) => {
  const years = days >= 365 ? days / 365 : null;
  if (years) return `${Math.round(years)} year${Math.round(years) > 1 ? "s" : ""}`;
  // if days is greater than 90, divide by 30 to get months
  const months = days >= 90 ? days / 30 : null;
  if (months) return `${Math.round(months)} months`;
  return `${days} days`;
};

export const Compare = ({ plans }: CompareProps) => {
  const { ref, inView } = useInView();

  return (
    <div className="px-4 max-[800px]:hidden">
      <MaxWidthWrapper>
        <div className="mb-8">
          <h2
            className="text-center text-3xl font-bold tracking-tight max-md:text-2xl max-sm:text-xl"
            ref={ref}
          >
            Compare the full suite of features
          </h2>
          <p className="mt-2 text-center text-muted-foreground max-md:text-sm max-sm:text-[13px]">
            Find the plan that&apos;s right for your business. You can change your plan at anytime.
          </p>
        </div>
        <div className="sticky top-[48px] z-10 grid w-full grid-cols-[230px_1fr_1fr_1fr_1fr] max-md:hidden">
          <div
            className={`compare-grid-item flex flex-col justify-center border border-b border-r-0 bg-background p-4 ${!inView ? "rounded-tl-none" : "rounded-tl-xl"}`}
          >
            <p className="text-sm font-medium">Features and limits</p>
            <p className="text-[13px] text-muted-foreground">Select a plan to get started.</p>
          </div>
          {plans.map((plan: Plan, index) => (
            <div
              className={`compare-grid-item flex items-center border border-b border-r-0 bg-background p-4 max-[1040px]:flex-col max-[1040px]:space-y-2 min-[1040px]:justify-between ${!inView ? "rounded-tr-none" : index === 3 ? "rounded-tr-xl" : ""}`}
              key={plan.id}
            >
              <p className="text-sm font-medium">{plan.name}</p>
              <Button
                className={`rounded-full text-xs max-[1040px]:w-full`}
                size="sm"
                variant={plan.isFree ? "outline" : "default"}
                asChild
              >
                <a href={`${protocol}${appDomain}/register`}>
                  {plan.isFree ? "Start for free" : "Get started"}
                </a>
              </Button>
            </div>
          ))}
          {/* <div
            className={`compare-grid-item flex items-center border border-b border-r-0 bg-background p-4 max-[1100px]:flex-col max-[1100px]:space-y-2 min-[1100px]:justify-between ${!inView ? "rounded-tr-none" : "rounded-tr-xl"}`}
          >
            <p className="text-sm font-medium">Enterprise</p>
            <Button size="sm" className="rounded-full text-xs max-[1100px]:w-full">
              Contact sales
            </Button>
          </div> */}
        </div>
        <div className="grid w-full grid-cols-[230px_1fr_1fr_1fr_1fr] bg-background max-md:hidden">
          {/* QR codes  */}
          <TableCell
            value="QR Codes"
            className="justify-between border-t-0 font-medium"
            info="The number of QR codes you can create per month"
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell
              key={plan.id}
              value={`${plan.links.toLocaleString("en-us")}/mo`}
              className="border-t-0"
            />
          ))}
          {/* <TableCell value="Unlimited" className="border-t-0" /> */}

          {/* Custom links row */}
          <TableCell
            value="Short links"
            className="justify-between font-medium"
            info="The number of short links you can create per month"
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={`${plan.links.toLocaleString("en-us")}/mo`} />
          ))}
          {/* <TableCell value="Unlimited" /> */}

          {/* Click and scan tracking row */}
          <TableCell
            value="Scans and clicks"
            className="justify-between font-medium"
            info="The number of clicks and scans your QR codes and short links can receive. All of these will be tracked."
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={"Unlimited"} />
          ))}
          {/* <TableCell value="Unlimited" /> */}

          {/* Analytics row */}
          <TableCell
            value="Analytical data"
            className="justify-between font-medium"
            info="How far back you can view historical data."
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={getAnalytics(plan.analytics)} />
          ))}
          {/* <TableCell value="All time" /> */}

          {/* Redirects row */}
          <TableCell
            value="Redirects"
            className="justify-between font-medium"
            info="Change the destination of a short link or QR code after they have already been created."
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell
              key={plan.id}
              value={
                plan.isFree ? <Minus size={18} className="text-muted-foreground" /> : "Unlimited"
              }
            />
          ))}
          {/* <TableCell value="Unlimited" /> */}

          {/* Redirects row */}
          <TableCell
            value="Bulk (coming soon)"
            className="justify-between font-medium"
            info="Create short links and qr codes from csv files. Create as many as your plan allows."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  `${plan.links.toLocaleString("en-us")}/mo`
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value="Unlimited" /> */}

          {/* QR Customization */}
          <TableCell
            value="QR customization"
            className="justify-between font-medium"
            info="Apply custom colors and branding (logos)"
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={!plan.isFree ? "Enhanced" : "Limited"} />
          ))}
          {/* <TableCell value={"Enhanced"} /> */}

          {/* Platform seats */}
          <TableCell
            value="Platform seats"
            className="justify-between font-medium"
            info="The number of team members you can add to your team."
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={plan.seats} />
          ))}
          {/* <TableCell value={"Unlimited"} /> */}

          {/* Custom domains */}
          <TableCell
            value="Custom domains"
            className="justify-between font-medium"
            info="The number of domains you can add to your team."
          />
          {plans.map((plan: CustomPlan) => (
            <TableCell key={plan.id} value={plan.domains} />
          ))}
          {/* <TableCell value={"Unlimited"} /> */}

          <TableCell
            value="SSL certificates"
            className="justify-between font-medium"
            info="SSL certificates will automatically generate for all of your custom domains."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell key={plan.id} value={<CircleCheckFill />} />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          <TableCell
            value="Domain redirector"
            className="justify-between font-medium"
            info="If someone lands on the root or an invalid path of your domain, they will be redirected to a page of your choice."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* UTM Builder */}
          <TableCell
            value="UTM builder"
            className="justify-between font-medium"
            info={"Easily create UTM parameters to your links."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell key={plan.id} value={<CircleCheckFill />} />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* AI QR Customization */}
          {/* <TableCell
            value="AI QR generation"
            className="justify-between font-medium"
            info={"Create visually stunning QR codes with AI."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill className={i === 1 ? "fill-deepBlue-500" : undefined} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))} */}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* AI insights */}
          {/* <TableCell
            value="AI insights"
            className="justify-between font-medium"
            info={"Get insights on how your links are performing."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill className={i === 1 ? "fill-deepBlue-500" : undefined} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))} */}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          <TableCell
            value="Custom link previews"
            className="justify-between font-medium"
            info={
              "Customize the title, description, and image of your links when shared on social media to increase click-through rates."
            }
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* link expiration */}
          <TableCell
            value="Link expiration"
            className="justify-between font-medium"
            info={"Set an expiration date for your links, after which they will no longer work."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* link cloaking */}
          <TableCell
            value="Link cloaking"
            className="justify-between font-medium"
            info={"Hide the destination URL of your links."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* password protection */}
          <TableCell
            value="Password protection"
            className="justify-between font-medium"
            info="Only allow people with the password to access a link."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* smart redirects */}
          <TableCell
            value="Adaptive routing"
            className="justify-between font-medium"
            info={"Redirect users based on their device and or location."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* access controls */}
          {/* <TableCell
            value="Roles & permissions"
            className="justify-between font-medium"
            info={
              "Implement granular access controls to ensure customized access and permissions for each users."
            }
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.rbac ? (
                  <CircleCheckFill className={i === 1 ? "fill-deepBlue-500" : undefined} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))} */}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* single sign on */}
          {/* <TableCell
            value="Single sign-on (SSO)"
            className="justify-between font-medium"
            info={"Access Qryptic through your company's SSO provider."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.sso ? (
                  <CircleCheckFill className={i === 1 ? "fill-deepBlue-500" : undefined} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))} */}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* service level agreement */}
          {/* <TableCell
            value="Service level agreement"
            className="justify-between font-medium"
            info={
              "Define the level of service you expect from us. This includes support response times and uptime."
            }
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                plan.sla ? (
                  <CircleCheckFill className={i === 1 ? "fill-deepBlue-500" : undefined} />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))} */}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* api access */}
          <TableCell
            value="API access (coming soon)"
            className="justify-between font-medium"
            info={
              "Use our API to create and manage your links. This feature will be available soon."
            }
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                !plan.isFree ? (
                  <CircleCheckFill />
                ) : (
                  <Minus size={18} className="text-muted-foreground" />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* dedicated support manager */}
          <TableCell
            value="Dedicated support rep"
            className="justify-between font-medium"
            info="Get your own dedicated support representative you can reach out to at anytime for all of your needs."
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={
                i !== 3 ? (
                  <Minus size={18} className="text-muted-foreground" />
                ) : (
                  <CircleCheckFill />
                )
              }
            />
          ))}
          {/* <TableCell value={<CircleCheckFill />} /> */}

          {/* support level */}
          <TableCell
            value="Support level"
            className="justify-between rounded-bl-xl font-medium"
            info={"The level of support you will receive."}
          />
          {plans.map((plan: CustomPlan, i) => (
            <TableCell
              key={plan.id}
              value={plan.supportLevel}
              className={`${i === 3 ? "rounded-br-xl" : ""}`}
            />
          ))}
          {/* <TableCell value="Dedicated" className="rounded-br-xl" /> */}
        </div>
        <MobileCompare plans={plans} />
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
        "compare-grid-item flex h-[54px] items-center justify-center border border-b-0 border-r-0 p-4 text-center text-sm",
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
          <TooltipContent className="max-w-[200px] text-center" sideOffset={8}>
            {info}
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
