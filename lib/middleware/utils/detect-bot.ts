import { NextRequest, userAgent } from "next/server";

export const detectBot = (req: NextRequest) => {
  const ua = userAgent(req);
  return ua.isBot;
};
