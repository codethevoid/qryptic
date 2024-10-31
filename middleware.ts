import { NextRequest, NextResponse } from "next/server";
import { appMiddleware, linkMiddleware, rootMiddleware, adminMiddleware } from "@/lib/middleware";
import { appDomain, adminDomain, rootDomain } from "@/utils/qryptic/domains";
import { detectInvalidPath, getUserToken, parseReq } from "@/lib/middleware/utils";

export const middleware = async (req: NextRequest) => {
  const { domain, path } = parseReq(req);

  if (detectInvalidPath(path)) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  if (domain === appDomain) {
    return appMiddleware(req);
  }

  if (domain === adminDomain) {
    return adminMiddleware(req);
  }

  if (domain === rootDomain) {
    return rootMiddleware(req);
  }

  return linkMiddleware(req);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
