import { NextRequest, NextResponse } from "next/server";
import { appMiddleware, linkMiddleware, rootMiddleware, adminMiddleware } from "@/lib/middleware";
import { appDomain, adminDomain, rootDomain } from "@/lib/domains";
import { detectInvalidPath, parseReq } from "@/lib/middleware/utils";

export const middleware = (req: NextRequest) => {
  const { host, path } = parseReq(req);

  if (detectInvalidPath(path)) {
    return NextResponse.rewrite(new URL("/not-found", req.url));
  }

  if (host === appDomain) {
    return appMiddleware(req);
  }

  if (host === adminDomain) {
    return adminMiddleware(req);
  }

  if (host === rootDomain) {
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
