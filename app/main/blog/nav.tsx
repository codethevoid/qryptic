"use client";

import { Button } from "@/components/ui/button";
import { useParams, usePathname } from "next/navigation";
import NextLink from "next/link";
import { cn } from "@/lib/utils";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";

export const BlogNav = () => {
  const pathname = usePathname();
  const { post } = useParams();

  if (post) return null;

  return (
    <MaxWidthWrapper>
      <div className={cn("flex gap-1")}>
        <Button
          variant={pathname === "/blog" ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
          asChild
        >
          <NextLink href="/blog">All posts</NextLink>
        </Button>
        <Button
          variant={pathname === "/blog/company-news" ? "default" : "ghost"}
          size="sm"
          className="rounded-full"
          asChild
        >
          <NextLink href="/blog/company-news">Company news</NextLink>
        </Button>
      </div>
    </MaxWidthWrapper>
  );
};
