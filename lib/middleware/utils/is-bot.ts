import { NextRequest, userAgent } from "next/server";

export const isBot = (req: NextRequest) => {
  const ua = userAgent(req);
  return ua.isBot;
};
