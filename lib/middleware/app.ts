import "server-only";
import { NextResponse, NextRequest } from "next/server";
import { parseReq } from "@/lib/middleware/utils";
import { getUserToken } from "@/lib/middleware/utils";
import { redis } from "@/lib/upstash/redis";
import { qrypticHeaders } from "@/utils/qryptic/qryptic-headers";

export const appMiddleware = async (req: NextRequest) => {
  const { path, fullPath } = parseReq(req);
  const token = await getUserToken(req);

  // if users is not authenticated and not on login page or register page, redirect to login
  if (!token && path !== "/login" && path !== "/register") {
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
      // redirect to teams page
      if (!defaultTeam) {
        return NextResponse.redirect(new URL("/teams", req.url));
      }

      // redirect to default team /[slug]
      return NextResponse.redirect(new URL(`/${defaultTeam}`, req.url));
    }
  }

  // otherwise, rewrite to the app
  return NextResponse.rewrite(
    new URL(`/app.qryptic.io${fullPath === "/" ? "" : fullPath}`, req.url),
  );
};
