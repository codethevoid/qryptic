import { NextResponse, NextRequest } from "next/server";
import { parseReq } from "@/lib/middleware/utils";

export const appMiddleware = async (req: NextRequest) => {
  const { path, searchParams, fullPath, host } = parseReq(req);

  // otherwise, rewrite to the app
  return NextResponse.rewrite(new URL(`/app.qryptic.io${fullPath}`, req.url));
};
