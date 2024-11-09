"use client";

import { MaxWidthWrapper } from "@/components/layout/max-width-wrapper";
import { Button } from "@/components/ui/button";
import NextLink from "next/link";
import { useParams, usePathname } from "next/navigation";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useTeam } from "@/lib/hooks/swr/use-team";
import { QrypticIcon } from "@/components/logos/qryptic-icon";
import { useWindowSize, useWindowWidth } from "@react-hook/window-size";
import { cn } from "@/lib/utils";

const linkItems = [
  { title: "Home", href: "/" },
  { title: "Links", href: "/links" },
  { title: "Analytics", href: "/analytics" },
  { title: "Domains", href: "/domains" },
  { title: "Tags", href: "/tags" },
  // { title: "Team", href: "/team", roles: ["super_admin", "owner"] },
  { title: "Settings", href: "/settings", roles: ["owner"] },
];

export const NavLinks = ({ inView }: { inView: boolean }) => {
  const path = usePathname();
  const { slug } = useParams();
  const { error } = useTeam();
  const { team } = useTeam();
  const navRef = useRef<HTMLDivElement>(null);
  const width = useWindowWidth();

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({
    width: "0",
    left: "0",
  });

  const updateIndicatorStyle = (index: number) => {
    const navbarElement = navRef?.current as HTMLDivElement;
    const targetElement = navbarElement?.children[index + 1] as HTMLButtonElement;
    const width = targetElement?.offsetWidth;
    const left = targetElement?.offsetLeft;

    setIndicatorStyle({
      width: `${width}px`,
      transform: `translateX(${left}px)`,
    });
  };

  useEffect(() => {
    if (!slug || !team || !path) return;
    const definedPath = path.split("/")[2]?.toLowerCase();
    if (!definedPath) {
      setActiveIndex(0);
      updateIndicatorStyle(0);
      return;
    }

    const index = linkItems.findIndex((item) => item.href === `/${definedPath}`);

    setActiveIndex(index);
    updateIndicatorStyle(index);
  }, [path, team, slug]);

  if (error || !slug) return null;

  return (
    <div className={`sticky top-0 z-20 border-b border-border/70 bg-background px-4 py-1.5`}>
      <MaxWidthWrapper className="relative flex items-center space-x-3 overflow-x-auto scrollbar-hide">
        <div
          className={cn(
            `${!inView ? "left-0" : "-left-[20px]"} absolute transition-all max-[499px]:hidden`,
          )}
        >
          <QrypticIcon />
        </div>
        <div
          ref={navRef}
          className={cn(
            `relative flex items-center transition-[left_150ms]`,
            inView ? "-left-3" : "left-5",
            width < 500 && "-left-3",
          )}
        >
          <div
            className="absolute z-0 h-7 rounded-full bg-zinc-100 transition-all duration-300 ease-in-out dark:bg-zinc-900"
            style={indicatorStyle}
          ></div>
          {linkItems
            .filter((item) =>
              !item?.roles ? item : item.roles.includes(team?.user.role as string),
            )
            .map((item, index) => (
              <Button
                key={item.title}
                variant="ghost"
                className={`relative z-10 h-7 text-[13px] duration-200 hover:bg-transparent ${activeIndex === index ? "text-foreground hover:text-foreground" : "text-muted-foreground hover:text-muted-foreground"}`}
                onMouseEnter={() => updateIndicatorStyle(index)}
                onMouseLeave={() => updateIndicatorStyle(activeIndex as number)}
                onClick={() => {
                  setActiveIndex(index);
                  updateIndicatorStyle(index);
                }}
                asChild
              >
                <NextLink href={`/${slug}${item.href}`}>{item.title}</NextLink>
              </Button>
            ))}
        </div>
      </MaxWidthWrapper>
    </div>
  );
};
