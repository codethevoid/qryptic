"use client";

import { Button } from "@/components/ui/button";
import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { QrypticLogo } from "@/components/logos/qryptic-logo";
import { appDomain, protocol } from "@/utils/qryptic/domains";
import {
  Book,
  Bot,
  Building,
  ChartArea,
  ChevronRight,
  FlaskConical,
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
  WandSparkles,
  XIcon,
  MenuIcon,
  Radar,
} from "lucide-react";
import { useScrollPosition } from "@/lib/hooks";
import NextLink from "next/link";
import { Link } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { MobileNav } from "./mobile-nav";
import { useWindowWidth } from "@react-hook/window-size";
import { RainbowButton } from "@/components/ui/rainbow-button";

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

// const solutionLinks = [
//   {
//     title: "Startups",
//     icon: <Rocket size={16} />,
//     href: "/startups",
//     description: "Accelerate your growth",
//   },
//   {
//     title: "Enterprise",
//     icon: (
//       <svg
//         xmlns="http://www.w3.org/2000/svg"
//         viewBox="0 0 24 24"
//         width="16"
//         height="16"
//         fill="currentColor"
//       >
//         <path d="M3 19V5.70046C3 5.27995 3.26307 4.90437 3.65826 4.76067L13.3291 1.24398C13.5886 1.14961 13.8755 1.28349 13.9699 1.54301C13.9898 1.59778 14 1.65561 14 1.71388V6.6667L20.3162 8.77211C20.7246 8.90822 21 9.29036 21 9.72079V19H23V21H1V19H3ZM5 19H12V3.85543L5 6.40089V19ZM19 19V10.4416L14 8.77488V19H19Z"></path>
//       </svg>
//     ),
//     href: "/enterprise",
//     description: "Scale with confidence",
//   },
// ];

export const resourceLinks = [
  {
    title: "Blog",
    icon: <PenTool className="max-md:[14px] h-4 w-4 max-md:w-[14px]" />,
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
    icon: <Mail className="h-4 w-4 max-md:h-[14px] max-md:w-[14px]" />,
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

export const labLinks = [
  {
    title: "Unveil",
    icon: <WandSparkles className="h-4 w-4 max-md:h-[14px] max-md:w-[14px]" />,
    href: "/lab/unveil",
    description: "Reveal final url to any short link",
  },
  {
    title: "Radar",
    icon: <Radar className="h-4 w-4 max-md:h-[14px] max-md:w-[14px]" />,
    href: "/lab/radar",
    description: "Detect malicious links",
  },
];

export const MainNav = () => {
  const scrollPos = useScrollPosition();
  const pathname = usePathname();
  const windowWidth = useWindowWidth();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (windowWidth >= 768) {
      setIsMobileMenuOpen(false);
    }
  }, [windowWidth]);

  return (
    <>
      <div
        className={`sticky top-0 z-50 border-b px-4 py-2 transition-colors ${scrollPos > 50 || pathname.includes("blog") || isMobileMenuOpen ? "border-border bg-background/85 backdrop-blur" : "border-transparent"} ${isMobileMenuOpen ? "!border-transparent !bg-background" : ""}`}
      >
        <MaxWidthWrapper className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <NextLink href="/" passHref className="qryptic-home-page-link">
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
              <Popover open={openDropdown === "lab"}>
                <PopoverTrigger
                  onMouseEnter={() => handleMouseEnter("lab")}
                  onMouseLeave={handleMouseLeave}
                  className={`inline-flex h-8 cursor-auto items-center rounded-full px-3 text-[13px] font-medium transition-colors ${openDropdown === "lab" ? "text-foreground" : "text-foreground/70"}`}
                >
                  Lab{" "}
                  <ChevronDown
                    className={`relative top-[1px] ml-1 h-3 w-3 transition duration-300 ${openDropdown === "lab" ? "rotate-180" : undefined}`}
                    aria-hidden="true"
                  />
                </PopoverTrigger>
                <PopoverContent
                  onMouseEnter={() => handleMouseEnter("lab")}
                  onMouseLeave={handleMouseLeave}
                  className="w-auto rounded-xl p-2.5 data-[state=closed]:!animate-[exit_100ms] data-[state=open]:!animate-[enter_200ms]"
                  align="start"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                  onClick={() => setOpenDropdown(null)}
                >
                  {labLinks.map((link) => (
                    <ListItem key={link.title} {...link} />
                  ))}
                </PopoverContent>
              </Popover>
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
              <Button
                asChild
                size="sm"
                variant="ghost"
                onMouseEnter={() => setOpenDropdown(null)}
                className={`inline-flex cursor-pointer items-center rounded-full px-3 text-[13px] font-medium text-foreground/70 transition-colors hover:bg-transparent hover:text-foreground`}
              >
                <NextLink href="/pricing">Pricing</NextLink>
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-2 max-md:hidden">
            <Button size="sm" variant="ghost" className="ml-1 rounded-full max-sm:ml-0" asChild>
              <a href={`${protocol}${appDomain}/login`}>Log in</a>
            </Button>

            <a href={`${protocol}${appDomain}/register`}>
              <RainbowButton className="h-8 rounded-full px-3 text-[13px]">Sign up</RainbowButton>
            </a>
          </div>
          <div className="hidden space-x-2 max-md:flex">
            <a
              href={`${protocol}${appDomain}/register`}
              className={cn(isMobileMenuOpen && "hidden")}
            >
              <RainbowButton className="h-8 rounded-full px-3 text-[13px]">Sign up</RainbowButton>
            </a>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full bg-background shadow-none hover:bg-background active:!scale-100"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XIcon size={16} /> : <MenuIcon size={16} />}
            </Button>
          </div>
        </MaxWidthWrapper>
      </div>
      <MobileNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </>
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
