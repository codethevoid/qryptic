import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import NextLink from "next/link";
import { labLinks, resourceLinks } from "./main-nav";
import { ThemeToggle } from "@/components/ui/custom/theme-toggle";
import { cn } from "@/lib/utils";
import { protocol, appDomain } from "@/utils/qryptic/domains";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

export const MobileNav = ({ isOpen, setIsOpen }: Props) => {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue("");
    if (isOpen) {
      const scrollTop = window.scrollY;

      // Lock the body
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollTop}px`;
      document.body.style.width = "100%";
      document.body.style.overflowY = "scroll"; // Ensures scrollbar remains visible

      // Restore scroll position on close
      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.overflowY = "";
        window.scrollTo(0, scrollTop); // Restore scroll position
      };
    }
  }, [isOpen]);

  const handleValueChange = (value: string) => {
    setValue(value);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setValue("");
  };

  return (
    <div
      style={{ height: isOpen ? `calc(100vh - 49px)` : "0px" }}
      className={
        "fixed top-[45px] z-50 w-full overflow-hidden bg-background backdrop-blur transition-all duration-200"
      }
    >
      <div className={cn("space-y-6 px-4 py-2")}>
        <div className="space-y-2.5">
          <Button size="sm" className="w-full rounded-full shadow-none active:!scale-100" asChild>
            <a href={`${protocol}${appDomain}/register`}>Sign up</a>
          </Button>
          <Button
            size="sm"
            className="active!scale-100 w-full rounded-full shadow-none"
            variant="outline"
            asChild
          >
            <a href={`${protocol}${appDomain}/login`}>Log in</a>
          </Button>
        </div>
        <div>
          <Accordion type="single" collapsible value={value} onValueChange={handleValueChange}>
            <AccordionItem value="lab" className="border-t">
              <AccordionTrigger className="py-2">Lab</AccordionTrigger>
              <AccordionContent>
                <div className="flex w-full flex-col space-y-1">
                  {labLinks.map((link) => (
                    <NextLink
                      href={link.href}
                      key={link.href}
                      className="flex items-center space-x-2 text-[13px] text-muted-foreground"
                      onClick={handleLinkClick}
                    >
                      {link.icon}
                      <span>{link.title}</span>
                    </NextLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="resources">
              <AccordionTrigger className="py-2">Resources</AccordionTrigger>
              <AccordionContent>
                <div className="flex w-full flex-col space-y-1">
                  {resourceLinks.map((link) => (
                    <NextLink
                      href={link.href}
                      key={link.href}
                      className="flex items-center space-x-2 text-[13px] text-muted-foreground"
                      onClick={handleLinkClick}
                    >
                      {link.icon}
                      <span>{link.title}</span>
                    </NextLink>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <NextLink
            href="/pricing"
            className="flex h-9 w-full items-center py-2 text-[13px] font-medium"
            onClick={handleLinkClick}
          >
            Pricing
          </NextLink>
          <div className="flex h-9 w-full items-center justify-between border-b border-t py-2 text-[13px] font-medium">
            <span>Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};
