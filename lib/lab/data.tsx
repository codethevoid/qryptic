import { WandSparkles, Radar } from "lucide-react";

export const labData = [
  {
    title: "Unveil",
    navIcon: <WandSparkles className="h-4 w-4 max-md:h-[14px] max-md:w-[14px]" />,
    icon: <WandSparkles />, // make this bigger
    href: "/lab/unveil",
    description: "Reveal final url to any short link",
    category: "links",
  },
  {
    title: "Radar",
    navIcon: <Radar className="h-4 w-4 max-md:h-[14px] max-md:w-[14px]" />,
    icon: <Radar />,
    href: "/lab/radar",
    description: "Detect malicious links",
    category: "links",
  },
];
