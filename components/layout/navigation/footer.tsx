"use client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// const products = [
//   // { name: "AI", route: "/ai" },
//   // { name: "Custom links", route: "/custom-links" },
//   // { name: "QR codes", route: "/qr-codes" },
//   // { name: "Controllers", route: "/controllers" },
//   // { name: "Analytics", route: "/analytics" },
//   // { name: "Teams", route: "/teams" },
//   // { name: "API", route: "/api" },
// ];

const resources = [
  // { name: "Help center", route: "/help-center" },
  // { name: "Docs", route: "/docs" },
  // { name: "Guides", route: "/guides" },
  { name: "Pricing", route: "/pricing" },
  // { name: "Uptime", route: "/uptime" },
];

const companyLinks = [
  // { name: "About", route: "/about" },
  // { name: "Blog", route: "/blog" },
  // { name: "Changelog", route: "/changelog" },
  { name: "Contact", route: "/contact" },
  // { name: "Legal", route: "/legal" },
  { name: "Privacy", route: "/legal/privacy" },
  { name: "Terms", route: "/legal/terms" },
];

export const Footer = () => {
  return (
    <div className="border-t bg-background/60 px-4 py-16">
      <MaxWidthWrapper>
        <div className="grid grid-cols-[auto_auto_auto_auto_auto] justify-between gap-6 max-sm:grid-cols-1 max-sm:gap-10">
          <div className="col-span-3 space-y-5 max-sm:col-span-1">
            <QrypticLogo className="max-sm:mx-auto" />
            <p className="max-w-[300px] text-[13px] text-muted-foreground max-sm:mx-auto max-sm:text-center">
              Empowering businesses to deliver
              <br /> digital experiences at scale.
            </p>

            <div className="w-fit max-sm:mx-auto">
              <Button size="icon" variant="outline" asChild>
                <a href="https://x.com/qryptic_io" target="_blank">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M10.4883 14.651L15.25 21H22.25L14.3917 10.5223L20.9308 3H18.2808L13.1643 8.88578L8.75 3H1.75L9.26086 13.0145L2.31915 21H4.96917L10.4883 14.651ZM16.25 19L5.75 5H7.75L18.25 19H16.25Z"></path>
                  </svg>
                </a>
              </Button>
            </div>
            <div className="w-fit max-sm:mx-auto">
              <Button size="sm" variant="outline" className="space-x-2 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                <span>All systems normal</span>
              </Button>
            </div>
          </div>
          {/* <div>
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
          </div> */}
          <div>
            <p className="mb-4 text-sm font-medium max-sm:mb-2 max-sm:text-center">Resources</p>
            <div className="flex flex-col space-y-1.5">
              {resources.map((resource) => (
                <Link
                  href={resource.route}
                  key={resource.name}
                  className="w-fit text-[13px] text-muted-foreground hover:text-foreground max-sm:mx-auto max-sm:text-center"
                >
                  {resource.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium max-sm:mb-2 max-sm:text-center">Company</p>
            <div className="flex flex-col space-y-1.5">
              {companyLinks.map((company) => (
                <Link
                  href={company.route}
                  key={company.name}
                  className="w-fit text-[13px] text-muted-foreground hover:text-foreground max-sm:mx-auto max-sm:text-center"
                >
                  {company.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12">
          <p className="text-xs text-muted-foreground max-sm:text-center">
            &copy; {new Date().getFullYear()} Qryptic. All rights reserved.
          </p>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
