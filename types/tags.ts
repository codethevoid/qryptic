import { TagColor } from "@/types/colors";

export type TagWithCounts = {
  id: string;
  name: string;
  color: TagColor;
  linkCount: number;
  eventCount: number;
};
