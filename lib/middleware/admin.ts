import "server-only";
import { NextResponse, NextRequest } from "next/server";
import { parseReq } from "@/lib/middleware/utils";

export const adminMiddleware = async (req: NextRequest) => {
  const { fullPath } = parseReq(req);

  // otherwise, rewrite to the admin.qryptic.io app
  return NextResponse.rewrite(new URL(`/admin.qryptic.io${fullPath}`, req.url));
};
