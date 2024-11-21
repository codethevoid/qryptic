import "server-only";
import { NextResponse, NextRequest } from "next/server";
import { parseReq } from "@/lib/middleware/utils";
import { getUserToken } from "@/lib/middleware/utils";
import { redis } from "@/lib/upstash/redis";

export const appMiddleware = async (req: NextRequest) => {
  const { path, fullPath } = parseReq(req);
  const token = await getUserToken(req);

  // if users is not authenticated and not on login page or register page, redirect to login
  if (
    !token &&
    path !== "/login" &&
    path !== "/register" &&
    path !== "/verify-email" &&
    path !== "/forgot-password" &&
    path !== "/reset-password"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // if users is authenticated and on login page or register page, redirect to app
  if (token) {
    if (path === "/login" || path === "/register") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (path === "/") {
      // attempt to get default team from redis
      const defaultTeam = await redis.get(`user:${token.userId}:defaultTeam`);
      // if no default team, means they don't have any teams
      // redirect to onboarding page
      if (!defaultTeam) {
        return NextResponse.redirect(new URL("/onboarding/create-team", req.url));
      }

      // redirect to default team /[slug]
      return NextResponse.redirect(new URL(`/${defaultTeam}`, req.url));
    }

    // if the user is trying to access the onboarding pages, check if they have a default team
    // if they do, do not let them access the onboarding pages
    if (path.includes("/onboarding")) {
      const defaultTeam = await redis.get(`user:${token.userId}:defaultTeam`);
      if (defaultTeam) {
        return NextResponse.redirect(new URL(`/${defaultTeam}`, req.url));
      }
    }
  }

  // otherwise, rewrite to the app
  return NextResponse.rewrite(
    new URL(`/app.qryptic.io${fullPath === "/" ? "" : fullPath}`, req.url),
  );
};
