"use client";

import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import { useTheme } from "next-themes";
import {
  Book,
  Bot,
  Building,
  ChartArea,
  ChevronRight,
  Headset,
  ListCheck,
  Mail,
  MoonStar,
  Pencil,
  PenTool,
  QrCode,
  Rocket,
  Sun,
  Users,
} from "lucide-react";
import { useScrollPosition } from "@/lib/hooks";
import NextLink from "next/link";
import { Link } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { usePathname } from "next/navigation";

const productLinks = [
  {
    title: "Custom links",
    icon: <Link size={16} />,
    href: "/custom-links",
    description: "Fully customizable short links",
  },
  {
    title: "QR codes",
    icon: <QrCode size={16} />,
    href: "/qr-codes",
    description: "Visually stunning QR codes",
  },
  {
    title: "Analytics",
    icon: <ChartArea size={16} />,
    href: "/analytics",
    description: "Track and analyze your links",
  },
  {
    title: "Teams",
    icon: <Users size={16} />,
    href: "/teams",
    description: "Collaborate with your team",
  },
  {
    title: "AI",
    icon: <Bot size={16} />,
    href: "/ai",
    description: "Explore what's possible",
  },
];

const solutionLinks = [
  {
    title: "Startups",
    icon: <Rocket size={16} />,
    href: "/startups",
    description: "Accelerate your growth",
  },
  {
    title: "Enterprise",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="currentColor"
      >
        <path d="M3 19V5.70046C3 5.27995 3.26307 4.90437 3.65826 4.76067L13.3291 1.24398C13.5886 1.14961 13.8755 1.28349 13.9699 1.54301C13.9898 1.59778 14 1.65561 14 1.71388V6.6667L20.3162 8.77211C20.7246 8.90822 21 9.29036 21 9.72079V19H23V21H1V19H3ZM5 19H12V3.85543L5 6.40089V19ZM19 19V10.4416L14 8.77488V19H19Z"></path>
      </svg>
    ),
    href: "/enterprise",
    description: "Scale with confidence",
  },
];

const resourceLinks = [
  {
    title: "Blog",
    icon: <PenTool size={16} />,
    href: "/blog",
    description: "Read the latest articles",
  },
  // {
  //   title: "Guides",
  //   icon: <Book size={16} />,
  //   href: "/guides",
  //   description: "Learn how to use Qryptic",
  // },
  {
    title: "Contact us",
    icon: <Mail size={16} />,
    href: "/contact",
    description: "Get in touch with us",
  },
  // {
  //   title: "Changelog",
  //   icon: <ListCheck size={16} />,
  //   href: "/changelog",
  //   description: "Stay up to date with our releases",
  // },
  // {
  //   title: "Help center",
  //   icon: <Headset size={16} />,
  //   href: "/help-center",
  //   description: "Get help from our team",
  // },
];

export const MainNav = () => {
  const { setTheme, resolvedTheme } = useTheme();
  const scrollPos = useScrollPosition();
  const pathname = usePathname();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (dropdown: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <div
      className={`sticky top-0 z-50 border-b px-4 py-2 transition-colors ${scrollPos > 50 || pathname.includes("blog") ? "border-border bg-background/85 backdrop-blur" : "border-transparent"}`}
    >
      <MaxWidthWrapper className="flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <NextLink href="/" passHref>
            <QrypticLogo />
          </NextLink>
          <div className="max-md:hidden">
            {/* <Popover open={openDropdown === "product"}>
              <PopoverTrigger
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter("product")}
                className={`inline-flex cursor-auto items-center rounded-full px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${openDropdown === "product" ? "bg-accent text-foreground" : "text-foreground/75"}`}
              >
                Product{" "}
                <ChevronDown
                  className={`relative top-[1px] ml-1 h-3 w-3 transition duration-300 ${openDropdown === "product" ? "rotate-180" : undefined}`}
                  aria-hidden="true"
                />
              </PopoverTrigger>
              <PopoverContent
                onMouseLeave={handleMouseLeave}
                onMouseEnter={() => handleMouseEnter("product")}
                className="w-auto rounded-xl p-2.5 data-[state=closed]:!animate-[exit_300ms] data-[state=open]:!animate-[enter_300ms]"
                sideOffset={7}
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {productLinks.map((link) => (
                  <ListItem key={link.title} {...link} />
                ))}
              </PopoverContent>
            </Popover>
            <Popover open={openDropdown === "solutions"}>
              <PopoverTrigger
                onMouseEnter={() => handleMouseEnter("solutions")}
                onMouseLeave={handleMouseLeave}
                className={`inline-flex cursor-auto items-center rounded-full px-3 py-1 text-sm font-medium transition-colors hover:bg-accent hover:text-foreground ${openDropdown === "solutions" ? "bg-accent text-foreground" : "text-foreground/75"}`}
              >
                Solutions{" "}
                <ChevronDown
                  className={`relative top-[1px] ml-1 h-3 w-3 transition duration-300 ${openDropdown === "solutions" ? "rotate-180" : undefined}`}
                  aria-hidden="true"
                />
              </PopoverTrigger>
              <PopoverContent
                onMouseEnter={() => handleMouseEnter("solutions")}
                onMouseLeave={handleMouseLeave}
                className="w-auto rounded-xl p-2.5 data-[state=closed]:!animate-[exit_300ms] data-[state=open]:!animate-[enter_300ms]"
                sideOffset={7}
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                {solutionLinks.map((link) => (
                  <ListItem key={link.title} {...link} />
                ))}
              </PopoverContent>
            </Popover> */}
            <Button
              asChild
              size="sm"
              variant="ghost"
              onMouseEnter={() => setOpenDropdown(null)}
              className={`inline-flex cursor-pointer items-center rounded-full px-3 text-[13px] font-medium text-foreground/70 transition-colors hover:bg-transparent hover:text-foreground`}
            >
              <NextLink href="/pricing">Pricing</NextLink>
            </Button>
            <Popover open={openDropdown === "resources"}>
              <PopoverTrigger
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
                className={`inline-flex h-8 cursor-auto items-center rounded-full px-3 text-[13px] font-medium transition-colors ${openDropdown === "resources" ? "text-foreground" : "text-foreground/70"}`}
              >
                Resources{" "}
                <ChevronDown
                  className={`relative top-[1px] ml-1 h-3 w-3 transition duration-300 ${openDropdown === "resources" ? "rotate-180" : undefined}`}
                  aria-hidden="true"
                />
              </PopoverTrigger>
              <PopoverContent
                onMouseEnter={() => handleMouseEnter("resources")}
                onMouseLeave={handleMouseLeave}
                className="w-auto rounded-xl p-2.5 data-[state=closed]:!animate-[exit_100ms] data-[state=open]:!animate-[enter_200ms]"
                align="start"
                onCloseAutoFocus={(e) => e.preventDefault()}
                onClick={() => setOpenDropdown(null)}
              >
                {resourceLinks.map((link) => (
                  <ListItem key={link.title} {...link} />
                ))}
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex items-center">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              setTheme(resolvedTheme === "dark" ? "light" : "dark");
            }}
          >
            <Sun size={16} className="absolute opacity-0 dark:opacity-100" />
            <MoonStar size={16} className="absolute opacity-100 dark:opacity-0" />
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="ml-1 hidden rounded-full max-md:inline-flex max-sm:ml-0"
            asChild
          >
            <NextLink href="/pricing">Pricing</NextLink>
          </Button>

          <Button size="sm" variant="ghost" className="ml-1 rounded-full max-sm:ml-0" asChild>
            <a href={`${protocol}${appDomain}/login`}>Log in</a>
          </Button>
          <Button size="sm" className="to cyan-500 group ml-3 rounded-full max-sm:ml-2" asChild>
            <a href={`${protocol}${appDomain}/register`}>Get started</a>
          </Button>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

type ListItemProps = {
  title: string;
  icon: ReactNode;
  className?: string;
  href: string;
  description: string;
};

const ListItem = ({ title, description, icon, href, className }: ListItemProps) => {
  return (
    <NextLink
      href={href}
      className={cn(
        "group flex w-[280px] items-center justify-between text-nowrap rounded-lg p-2 transition-colors duration-200 hover:bg-accent/80 dark:hover:bg-accent/60",
        className,
      )}
    >
      <div className="flex items-center space-x-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-gradient-to-tr from-zinc-100 to-background transition-all dark:from-zinc-950 dark:to-zinc-800">
          {icon}
        </div>
        <div>
          <p className="text-[13px]">{title}</p>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <ChevronRight
        size={15}
        className="mr-2 -translate-x-1 text-muted-foreground opacity-0 transition-all duration-300 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
      />
    </NextLink>
  );
};
