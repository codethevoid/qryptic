import { NextRequest } from "next/server";

export const parseReq = (req: NextRequest) => {
  // this is the domain (ex: example.com, app.example.com, etc)
  let host: string | null = req.headers.get("host") ?? null;
  // remove www. from the host
  host = host?.replace("www.", "") ?? null;

  // this is the path starting with the first forward slash after the domain (ex: /path/to/page)
  const path = req.nextUrl.pathname;

  // this is an object containing all the search params (ex: ?key=value&key2=value2)
  // but we convert this to a string for easier use
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  return { host, path, fullPath, searchParams: searchParamsString };
};
