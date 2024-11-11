import "server-only";
import { NextResponse, NextRequest } from "next/server";
import { getUserToken, parseReq } from "@/lib/middleware/utils";

export const adminMiddleware = async (req: NextRequest) => {
  const { fullPath, path } = parseReq(req);
  const user = await getUserToken(req);

  if (!user && path !== "/login") {
    // rewrite to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // otherwise, rewrite to the admin.qryptic.io app
  return NextResponse.rewrite(
    new URL(`/admin.qryptic.io${fullPath === "/" ? "" : fullPath}`, req.url),
  );
};
