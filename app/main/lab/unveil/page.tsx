import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Highlights } from "../../(landing)/components/highlights";
import { UnveilClient } from "./client";
import { Button } from "@/components/ui/button";
import { protocol, appDomain } from "@/utils/qryptic/domains";
import type { Highlight } from "../../(landing)/components/highlights";
import { Earth, Link2, Telescope } from "lucide-react";
import { Faq } from "../../(landing)/components/faq";
import { Products } from "../../(landing)/components/products";
import { constructMetadata } from "@/utils/construct-metadata";
import { MoreFromQryptic } from "../../(landing)/components/more-from-qryptic";
import { getPosts } from "@/lib/blog/get-posts";

export const metadata = constructMetadata({
  title: "Unveil | Discover the true destination behind any short link",
  description:
    "Uncover the hidden URLs behind shortened links with Unveil. Instantly unshorten links, enhance online safety, and protect yourself from phishing scams, malicious sites, and more.",
  image: "https://cdn.qryptic.io/main/unveil-opengraph.png",
});

const highlights: Highlight[] = [
  {
    icon: <Earth size={16} className="mx-auto" />,
    title: "Woldwide support",
    description:
      "Works with all URL shortening platforms. Bit.ly, short.io, tinyurl.com, ow.ly, just to name a few.",
  },
  {
    icon: <Link2 size={16} className="mx-auto -rotate-45" />,
    title: "Get original URL",
    description:
      "Instantly reveal the full url behind any shortened link, ensuring a safer browsing experience.",
  },
  {
    icon: <Telescope size={16} className="mx-auto" />,
    title: "Link preview",
    description:
      "Capture a real-time preview of the destination link, giving you a clear glimpse of what lies beyond.",
  },
];

const faqs: Faq[] = [
  {
    question: "What is Unveil?",
    answer:
      "Unveil is a tool that allows you to instantly see the original destination behind any shortened URL, ensuring clarity and a safer browsing experience.",
  },
  {
    question: "How does Unveil work?",
    answer:
      "Simply paste a shortened link into Unveil, and it will retrieve the original destination URL along with a real-time preview of the link.",
  },
  {
    question: "Is Unveil compatible with all URL shorteners?",
    answer:
      "Yes, Unveil works with all major URL shorteners such as Bit.ly, short.io, tinyurl.com, ow.ly, and many more.",
  },
  {
    question: "Can I trust the preview provided by Unveil?",
    answer:
      "Absolutely. Unveil retrieves the preview in real-time to give you a clear and accurate glimpse of the destination without visiting the link directly.",
  },
  {
    question: "Is Unveil free to use?",
    answer:
      "Yes, Unveil is completely free to use. Just paste your shortened link and reveal its destination instantly.",
  },
  {
    question: "Why should I use Unveil?",
    answer:
      "Unveil helps you stay safe online by revealing the true destination of shortened links, preventing potential risks like phishing or malicious websites.",
  },
];

const UnveilPage = async () => {
  const posts = await getPosts();

  return (
    <>
      <MaxWidthWrapper className="space-y-8 px-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-center text-4xl font-bold tracking-tight max-md:text-3xl max-[500px]:mx-auto max-[500px]:max-w-[340px]">
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Unveil{" "}
              </span>
              the destination behind any short link
            </h1>
            <p className="mx-auto max-w-xl text-center text-muted-foreground max-md:text-sm max-sm:max-w-[340px] max-sm:text-[13px]">
              Ever wonder where a short link will take you? Unveil makes it easy to find out.
              Instantly see the original URL behind any shortened link.
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
        <UnveilClient />
      </MaxWidthWrapper>
      <Highlights highlights={highlights} />
      <Products />
      <Faq faqs={faqs} />
      <MoreFromQryptic posts={posts} />
    </>
  );
};

export default UnveilPage;
