import { NextRequest, NextResponse } from "next/server";
import { parseReq } from "@/lib/middleware/utils";

export const linkMiddleware = async (req: NextRequest) => {
  const { host, path } = parseReq(req);
  console.log("Hello from link middleware");
  console.log("host", host);

  // otherwise, do nothing
  return NextResponse.next();
};
