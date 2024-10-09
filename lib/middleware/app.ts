import { NextResponse, NextRequest } from "next/server";
import { parseReq } from "@/lib/middleware/utils";
import { getUserToken } from "@/lib/middleware/utils";

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

    // get default team id
    if (path === "/") {
      // create team [slug] to the query params
      const { defaultTeam } = token;
      if (!defaultTeam) {
        // if users does not have a default team, redirect to teams page
        // so they can create a team
        return NextResponse.redirect(new URL("/teams", req.url));
      }
      return NextResponse.redirect(new URL(`/${defaultTeam}`, req.url));
    }
  }

  // otherwise, rewrite to the app
  return NextResponse.rewrite(
    new URL(`/app.qryptic.io${fullPath === "/" ? "" : fullPath}`, req.url),
  );
};
