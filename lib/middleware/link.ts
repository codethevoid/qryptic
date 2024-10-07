import { NextRequest, NextResponse } from "next/server";
import { parseReq } from "@/lib/middleware/utils";

export const linkMiddleware = async (req: NextRequest) => {
  const { host, path } = parseReq(req);
  console.log("Hello from link middleware");
  console.log("host", host);
  console.log("path", path);

  // get slug from path
  const slug = path.split("/")[1];
  if (!slug) {
    // look up domain in database
    // if domain exists, redirect to default destination
    // if domain does not exist, return 404 ( and show a message to the user )
  }

  // otherwise, do nothing
  return NextResponse.next();
};
