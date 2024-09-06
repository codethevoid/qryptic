"use client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const products = [
  { name: "AI", route: "/ai" },
  { name: "Custom links", route: "/custom-links" },
  { name: "QR codes", route: "/qr-codes" },
  // { name: "Controllers", route: "/controllers" },
  { name: "Analytics", route: "/analytics" },
  { name: "Teams", route: "/teams" },
  { name: "API", route: "/api" },
];

const resources = [
  { name: "Help center", route: "/help-center" },
  // { name: "Docs", route: "/docs" },
  { name: "Guides", route: "/guides" },
  { name: "Pricing", route: "/pricing" },
  { name: "Uptime", route: "/uptime" },
];

const companyLinks = [
  { name: "About", route: "/about" },
  { name: "Blog", route: "/blog" },
  { name: "Changelog", route: "/changelog" },
  { name: "Contact", route: "/contact" },
  { name: "Legal", route: "/legal" },
];

export const Footer = () => {
  return (
    <div className="border-t bg-background/60 px-4 py-16">
      <MaxWidthWrapper>
        <div className="grid grid-cols-[auto_auto_auto_auto_auto] justify-between gap-6">
          <div className="col-span-2 space-y-5">
            <QrypticLogo />
            <p className="max-w-[300px] text-sm text-muted-foreground">
              Empowering businesses to deliver
              <br /> digital experiences at scale.
            </p>
            <Button size="sm" variant="outline" className="space-x-2 text-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span>All systems normal</span>
            </Button>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium">Product</p>
            <div className="flex flex-col space-y-1.5">
              {products.map((product) => (
                <Link
                  href={product.route}
                  key={product.name}
                  className="w-fit text-[13px] text-muted-foreground hover:text-foreground"
                >
                  {product.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium">Resources</p>
            <div className="flex flex-col space-y-1.5">
              {resources.map((resource) => (
                <Link
                  href={resource.route}
                  key={resource.name}
                  className="w-fit text-[13px] text-muted-foreground hover:text-foreground"
                >
                  {resource.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium">Company</p>
            <div className="flex flex-col space-y-1.5">
              {companyLinks.map((company) => (
                <Link
                  href={company.route}
                  key={company.name}
                  className="w-fit text-[13px] text-muted-foreground hover:text-foreground"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Qryptic. All rights reserved.
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
