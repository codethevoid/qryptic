"use client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Faq = () => {
  return (
    <div className="border-y bg-background/60 px-4 py-16">
      <MaxWidthWrapper className="flex space-x-12 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-8">
        <div className="min-w-fit">
          <h3 className="text-3xl font-bold tracking-tight max-lg:text-center max-md:text-2xl max-sm:text-xl">
            Frequently asked questions
          </h3>
          <p className="mt-2 text-muted-foreground max-lg:text-center max-md:text-sm max-sm:text-[13px]">
            Have other questions? Contact us{" "}
            <Link
              href="/contact"
              className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
            >
              here
            </Link>
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
          <AccordionItem value="item-1" className="px-4 py-2">
            <AccordionTrigger>Which Qryptic plan is right for me?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                Our plans are designed to meet the needs of businesses of all sizes. Our free plan
                is perfect for personal use or if you are just wanting to try out Qryptic. Our paid
                plans are going to vary on your specific needs. If you are unsure, you can always
                start with our free plan and upgrade later. Or you can contact us and we can help
                you find the right plan.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="px-4 py-2">
            <AccordionTrigger>Can I get a free trial before I purchase a plan?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                We do not offer free trials at this time. You can try out our free plan to get a
                feel for the platform.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="px-4 py-2">
            <AccordionTrigger>Can I change or cancel my plan at any time?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                Yes, you can change your plan or cancel your subscription at any time. If you cancel
                your subscription, it will remain active until the end of the current billing cycle.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="px-4 py-2">
            <AccordionTrigger>How is my usage calculated?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                For monthly limits like links and QR codes, your usage is calculated on a
                month-to-month basis. For example, if you have a limit of 1000 links per month, your
                usage will reset on the first of each month.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5" className="px-4 py-2">
            <AccordionTrigger>What happens if I go over my plan's limits?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                If you go over your limits for the month, you will not be able to create any more
                links or QR codes until the next month. You can always upgrade your plan if you need
                increased limits. Your existing links will continue to work as normal.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6" className="px-4 py-2">
            <AccordionTrigger>Do you offer refunds?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                If you&apos;re not satisfied with your subscription for any reason, we will refund
                your most recent payment. You can also cancel your subscription and you will not be
                charged again.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7" className="px-4 py-2">
            <AccordionTrigger>Will my data be safe and secure with Qryptic?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                We take the security of your data very seriously. Our goal is to reach SOC 2 and
                GDPR compliance in the near future. We use industry-standard best practices to keep
                your data safe and secure.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8" className="px-4 py-2">
            <AccordionTrigger>How can I reach out with additional questions?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground max-md:text-[13px]">
                You can reach out to us at any time with additional questions. You can contact us{" "}
                <Link
                  href="/contact"
                  className="text-deepBlue-500 hover:underline dark:text-deepBlue-400"
                >
                  here
                </Link>
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </MaxWidthWrapper>
    </div>
  );
};
