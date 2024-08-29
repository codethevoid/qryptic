import { NextResponse, NextRequest } from "next/server";
import { appDomain, protocol } from "@/lib/domains";
import { parseReq } from "@/lib/middleware/utils";

export const apexMiddleware = async (req: NextRequest) => {
  const { path } = parseReq(req);

  // if the path is /login or /register, we will redirect to the app
  if (path === "/login" || path === "/register") {
    return NextResponse.redirect(new URL(`${protocol}${appDomain}${path}`, req.url));
  }

  // otherwise, just show the page
  return NextResponse.next();
};
