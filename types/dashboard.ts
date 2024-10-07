type Event = { createdAt: Date; type: "click" | "scan" };

type TopLink = {
  id: string;
  slug: string;
  destination: string;
  domain: { name: string };
  events: Event[];
};

export type Dashboard = {
  links: {
    count: number;
    prevCount: number;
    percentChange: number;
  };
  clicks: {
    count: number;
    prevCount: number;
    percentChange: number;
  };
  scans: {
    count: number;
    prevCount: number;
    percentChange: number;
  };
  events: Event[];
  topLinks: TopLink[];
};
