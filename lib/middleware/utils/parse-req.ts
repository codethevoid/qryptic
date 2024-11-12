import { NextRequest } from "next/server";
import { shortDomain, rootDomain, appDomain } from "@/utils/qryptic/domains";

export const parseReq = (req: NextRequest) => {
  // this is the domain (ex: example.com, app.example.com, etc)
  let domain: string | null = req.headers.get("host") as string;
  // remove www. from the host
  domain = domain?.replace("www.", "").toLowerCase();

  // For development, we want to use the short domain
  if (domain === "qrypt.co:3000") {
    domain = shortDomain as string;
  } else {
    if (domain.endsWith(".vercel.app")) {
      if (domain.startsWith("app.")) {
        domain = appDomain as string;
      } else {
        domain = rootDomain as string;
      }
    }
  }

  // this is the path starting with the first forward slash after the domain (ex: /path/to/page)
  const path = req.nextUrl.pathname;
  const slug = path.split("/")[1]; // slug will be the unique identifier for short links

  // this is an object containing all the search params (ex: ?key=value&key2=value2)
  // but we convert this to a string for easier use
  const searchParams = req.nextUrl.searchParams.toString();
  const searchParamsString = searchParams.length > 0 ? `?${searchParams}` : "";
  const fullPath = `${path}${searchParamsString}`;

  return { domain, path, fullPath, searchParams: searchParamsString, slug };
};
