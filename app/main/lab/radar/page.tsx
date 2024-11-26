import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import { Highlights } from "../../(landing)/components/highlights";
import { Products } from "../../(landing)/components/products";
import { Faq } from "../../(landing)/components/faq";
import { MoreFromQryptic } from "../../(landing)/components/more-from-qryptic";
import { getPosts } from "@/lib/blog/get-posts";
import { Drama, Earth, Link2, MousePointerBan, Shield, Telescope } from "lucide-react";
import type { Highlight } from "../../(landing)/components/highlights";
import { RadarClient } from "./client";
import { constructMetadata } from "@/utils/construct-metadata";

export const metadata = constructMetadata({
  title: "Radar | Detect malicious links",
  description:
    "Radar scans and analyzes links for potential threats like phishing, malware, and scams, ensuring a secure browsing experience.",
  image: "https://qryptic.s3.us-east-1.amazonaws.com/main/radar-og.png",
});

const highlights: Highlight[] = [
  {
    icon: <Shield size={16} className="mx-auto" />,
    title: "Ensure safety",
    description: "Scan links to detect threats and guarantee a secure browsing experience.",
  },
  {
    icon: <MousePointerBan size={16} className="mx-auto" />,
    title: "Avoid phishing attacks",
    description: "Got a suspicious email or text? Verify the link first to avoid phishing scams.",
  },
  {
    icon: <Drama size={16} className="mx-auto" />,
    title: "Block malware",
    description:
      "Keep yourself safe from malware and other threats by scanning links before you click.",
  },
];

const faqs: Faq[] = [
  {
    question: "What is Radar?",
    answer:
      "Radar is a tool designed to scan and reveal hidden threats behind any URL, ensuring you can browse safely and confidently.",
  },
  {
    question: "How does Radar work?",
    answer: "Paste any URL into Radar, and it will analyze the link for potential threats.",
  },
  {
    question: "Can I trust Radar's results?",
    answer:
      "Yes. Radar uses real-time scanning and threat detection to provide you with accurate and reliable insights into any link.",
  },
  {
    question: "Is Radar free to use?",
    answer:
      "Yes, Radar is completely free to use. Just paste a link and let Radar reveal it's details.",
  },
  {
    question: "Why should I use Radar?",
    answer:
      "Radar ensures your safety online by analyzing links for potential threats like phishing or malware, giving you peace of mind with every click.",
  },
];

const RadarPage = async () => {
  const posts = await getPosts();
  return (
    <>
      <MaxWidthWrapper className="space-y-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-center text-4xl font-bold tracking-tight max-md:text-3xl max-[500px]:mx-auto max-[500px]:max-w-[340px]">
              Detect hidden threats and stay{" "}
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                secure
              </span>
            </h1>
            <p className="mx-auto max-w-xl text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
              Radar scans and detects hidden threats in real-time, keeping you safe from phishing,
              malware, and suspicious websites.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Button
              className="w-full max-w-[200px] rounded-full max-sm:max-w-none"
              size="lg"
              asChild
            >
              <a href={`${protocol}${appDomain}/register`}>Start for free</a>
            </Button>
          </div>
        </div>
        <RadarClient />
      </MaxWidthWrapper>
      <Highlights highlights={highlights} />
      <Products />
      <Faq faqs={faqs} />
      <MoreFromQryptic posts={posts} />
    </>
  );
};

export default RadarPage;
