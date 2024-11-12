import { Duration, Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

export const ratelimit = (requests: number = 10, seconds: Duration = "10 s") => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, seconds),
    analytics: true,
    prefix: "qryptic",
  });
};
