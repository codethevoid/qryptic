"use client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Faq = {
  question: string;
  answer: string;
};

const defaultFaqs = [
  {
    question: "What is Qryptic, and how can it help my business?",
    answer:
      "Qryptic is a powerful tool for creating short links and customizable QR codes, helping you streamline your marketing efforts, track performance, and enhance brand visibility.",
  },
  {
    question: "How can I use Qryptic for my marketing campaigns?",
    answer:
      "With Qryptic, you can create branded links and QR codes that are easy to share and track, giving you insights into user engagement and helping drive better results for your campaigns.",
  },
  {
    question: "Do I need any technical skills to use Qryptic?",
    answer:
      "Not at all! Qryptic is designed to be user-friendly and accessible, so anyone can start creating and managing links and QR codes without any technical expertise.",
  },
  {
    question: "Can I customize my QR codes and links?",
    answer:
      "Yes! Qryptic offers a range of customization options for QR codes and links, so you can make them unique to your brand and campaigns.",
  },
  {
    question: "Is my data safe with Qryptic?",
    answer:
      "Absolutely. We prioritize data security and ensure your information and analytics are kept private and secure.",
  },
  {
    question: "How do I get started with Qryptic?",
    answer:
      "Simply sign up for a free account to start exploring all the features Qryptic has to offer. You can upgrade anytime if you need more advanced features.",
  },
  {
    question: "What kind of analytics does Qryptic provide?",
    answer:
      "Qryptic gives you insights into link clicks, QR code scans, and other engagement metrics to help you understand how your audience interacts with your content.",
  },
  {
    question: "Can I use Qryptic for free?",
    answer:
      "Yes, we offer a free plan with all the essentials. You can always upgrade to access more advanced features as your needs grow.",
  },
];

export const Faq = ({ faqs = defaultFaqs }: { faqs?: Faq[] }) => {
  return (
    <div className="border-y bg-background/60 px-4 py-16">
      <MaxWidthWrapper className="flex space-x-12 max-lg:flex-col max-lg:space-x-0 max-lg:space-y-8">
        <div className="min-w-fit">
          <h3 className="text-3xl font-bold tracking-tight max-lg:text-center max-md:text-2xl max-sm:text-xl">
            Frequently asked questions
          </h3>
          <p className="mt-2 text-muted-foreground max-lg:text-center max-md:text-sm max-sm:text-[13px]">
            Have other questions? Contact us{" "}
            <Link href="/contact" className="underline transition-colors hover:text-foreground">
              here
            </Link>
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="px-4 py-2">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground max-md:text-[13px]">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </MaxWidthWrapper>
    </div>
  );
};
