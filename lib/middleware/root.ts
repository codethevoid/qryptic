import { NextResponse, NextRequest } from "next/server";
import { appDomain, protocol } from "@/lib/domains";
import { parseReq } from "@/lib/middleware/utils";

export const rootMiddleware = async (req: NextRequest) => {
  let { path, fullPath } = parseReq(req);

  // if the path is /login or /register, we will redirect to the app
  if (path === "/login" || path === "/register") {
    return NextResponse.redirect(new URL(`${protocol}${appDomain}${fullPath}`, req.url));
  }

  // otherwise, rewrite to main
  return NextResponse.rewrite(new URL(`/main${fullPath === "/" ? "" : fullPath}`, req.url));
};
