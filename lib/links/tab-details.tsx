import { JSX } from "react";
import {
  Clock,
  Earth,
  Ghost,
  Image as ImageIcon,
  Link2,
  Lock,
  QrCode,
  SearchCheck,
  TabletSmartphone,
  Tag,
} from "lucide-react";
import { Tab } from "@/types/links";

export const tabDetails: Record<
  Tab,
  { title: string; description: string; icon: JSX.Element; isPro: boolean }
> = {
  general: {
    title: "General details",
    description: "Configure the short link details.",
    icon: <Link2 size={16} />,
    isPro: false,
  },
  device: {
    title: "Device targeting",
    description: "Redirect users based on their device.",
    icon: <TabletSmartphone size={16} />,
    isPro: true,
  },
  utm: {
    title: "UTM parameters",
    description: "Track your link performance.",
    icon: <Tag size={16} />,
    isPro: false,
  },
  geo: {
    title: "Geo targeting",
    description: "Show the link to specific countries.",
    icon: <Earth size={16} />,
    isPro: true,
  },
  cloaking: {
    title: "Cloaking",
    description: "Hide the destination url.",
    icon: <Ghost size={16} />,
    isPro: true,
  },
  protection: {
    title: "Password protection",
    description: "Protect the link with a password.",
    icon: <Lock size={16} />,
    isPro: true,
  },
  qr: {
    title: "QR code",
    description: "Customize the QR code appearance.",
    icon: <QrCode size={16} />,
    isPro: false,
  },
  expiration: {
    title: "Expiration",
    description: "Set an expiration date for the link.",
    icon: <Clock size={16} />,
    isPro: true,
  },
  cards: {
    title: "Social media cards",
    description: "Customize the link preview.",
    icon: <ImageIcon size={16} />,
    isPro: true,
  },
  indexing: {
    title: "Search engine indexing",
    description: "Set the link to be indexed by search engines.",
    icon: <SearchCheck size={16} />,
    isPro: true,
  },
};
