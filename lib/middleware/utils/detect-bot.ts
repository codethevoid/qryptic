import "server-only";
import { NextRequest, userAgent } from "next/server";

export const detectBot = (req: NextRequest) => {
  const ua = userAgent(req);
  console.log(ua);
  if (ua.isBot) return true;
  if (ua.ua) {
    /* Note:
     * - bot is for most bots & crawlers
     * - ChatGPT is for ChatGPT
     * - bluesky is for Bluesky crawler
     * - facebookexternalhit is for Facebook crawler
     * - WhatsApp is for WhatsApp crawler
     * - MetaInspector is for https://metatags.io/
     * - Go-http-client/1.1 is a bot: https://user-agents.net/string/go-http-client-1-1
     * - iframely is for https://iframely.com/docs/about (used by Notion, Linear)
     */
    return /bot|chatgpt|bluesky|facebookexternalhit|WhatsApp|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex|MetaInspector|Go-http-client|iframely|help@dataminr.com/i.test(
      ua.ua,
    );
  }
  return false;
};
