import { NextRequest, NextResponse, userAgent } from "next/server";
import { parseReq } from "@/lib/middleware/utils";
import { protocol, rootDomain } from "@/utils/qryptic/domains";
import { qrypticHeaders } from "@/utils/qryptic/qryptic-headers";
import { MiddlewareLink } from "@/types/links";
import { constructURL } from "@/utils/construct-url";
import { waitUntil } from "@vercel/functions";
import { recordEvent } from "@/lib/middleware/utils/record-event";
import { detectBot } from "@/lib/middleware/utils/detect-bot";
import { isPasswordCorrect } from "@/lib/middleware/utils/is-password-correct";

const baseURL = `${protocol}${rootDomain}`;

export const linkMiddleware = async (req: NextRequest) => {
  const { domain, slug } = parseReq(req);
  if (!domain) return NextResponse.next();

  if (!slug) {
    // look up domain in database
    const res = await fetch(`${baseURL}/api/links/middleware/domain/${domain}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QRYPTIC_API_KEY}`,
      },
    });
    // get domain data (default destination)
    if (res.ok) {
      const data = await res.json();
      const domainData = data.domainData;
      if (domainData.destination) {
        // redirect to default destination
        return NextResponse.redirect(constructURL(domainData.destination), {
          headers: { "x-robots-tag": "googlebot: noindex" },
        });
      }
      // if default destination does not exist, show a message to the user
      // that this domain uses Qryptic but does not have a default destination
      // we will rewrite this so it can keep the domain in the URL
      return NextResponse.rewrite(new URL(`/${domain}`, req.url), {
        headers: {
          "x-robots-tag": "googlebot: noindex",
          ...qrypticHeaders,
        },
      });
    } else {
      // this request should not fail, because if the domain did not exist
      // it would not have been able to reach this middleware in the first place
      // redirect to home page if this request fails for some reason
      return NextResponse.redirect(`${protocol}${rootDomain}`, {
        headers: { "x-robots-tag": "googlebot: noindex", ...qrypticHeaders },
      });
    }
  }

  // if slug is provided, look up the link in the database
  const res = await fetch(`${baseURL}/api/links/middleware/${slug}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.QRYPTIC_API_KEY}`,
    },
  });

  // if the link does not exist or fails to fetch, check if the domain exists and redirect
  if (!res.ok) {
    const domainRes = await fetch(`${baseURL}/api/links/middleware/domain/${domain}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QRYPTIC_API_KEY}`,
      },
    });
    if (domainRes.ok) {
      const data = await domainRes.json();
      const domainData = data.domainData;
      if (domainData.destination) {
        // redirect to domain default destination
        return NextResponse.redirect(constructURL(domainData.destination), {
          headers: { "x-robots-tag": "googlebot: noindex" },
        });
      }
      // if the default destination does not exist, rewrite to not found page
      return NextResponse.rewrite(new URL(`/${domain}/${slug}/not-found`, req.url), {
        headers: {
          "x-robots-tag": "googlebot: noindex",
          ...qrypticHeaders,
        },
      });
    } else {
      // if the domain does not exist, redirect to home page
      return NextResponse.redirect(`${protocol}${rootDomain}`, {
        headers: { "x-robots-tag": "googlebot: noindex", ...qrypticHeaders },
      });
    }
  }

  const data = await res.json();
  const link = data.link as MiddlewareLink;

  const {
    id,
    destination,
    expiresAt,
    shouldCloak,
    shouldIndex,
    shouldProxy,
    isBanned,
    ios,
    android,
    expired,
    geo,
    domain: domainData,
    isPasswordProtected,
  } = link;

  // check if link is banned
  if (isBanned) {
    return NextResponse.rewrite(new URL(`/${domain}/${slug}/banned`, req.url), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // if the link is password protected, redirect to the password page
  if (isPasswordProtected) {
    const password = req.nextUrl.searchParams.get("password");
    // if no password is provided or the password is incorrect, redirect to the password page
    if (!password || !(await isPasswordCorrect(password, slug))) {
      // we will rewrite this so it can keep the domain in the URL along with the slug
      return NextResponse.rewrite(new URL(`/${domain}/${slug}/password`, req.url), {
        headers: {
          ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
          ...qrypticHeaders,
        },
      });
    } else {
      // if password is correct, clear the password from search params and continue
      req.nextUrl.searchParams.delete("password");
    }
  }

  // if the link is expired, redirect to the expired page
  if (expiresAt && new Date(expiresAt).getTime() < new Date().getTime()) {
    // first we check for expiration URL on the link level
    if (expired) {
      return NextResponse.redirect(constructURL(expired), {
        headers: {
          ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
          ...qrypticHeaders,
        },
      });
    }
    // now we check for expiration URL on the domain level
    if (domainData.destination) {
      return NextResponse.redirect(constructURL(domainData.destination), {
        headers: {
          ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
          ...qrypticHeaders,
        },
      });
    }
    // if no expiration URL is provided, rewrite to the expired page
    return NextResponse.rewrite(new URL(`/${domain}/slug/expired`, req.url), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // check if the request is from a bot and rewrite to the proxy page
  const isBot = detectBot(req);
  if (isBot && shouldProxy) {
    return NextResponse.rewrite(new URL(`/${domain}/${slug}/proxy`, req.url), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // if the link is geo-targeted, check if the user's country is in the list and redirect accordingly
  const country = req.geo?.country;
  if (country && geo && geo[country]) {
    const { destination: geoDestination } = geo[country];
    // record event
    waitUntil(recordEvent({ req, linkId: id, finalUrl: constructURL(geoDestination) }));
    // redirect to geo destination
    return NextResponse.redirect(constructURL(geoDestination), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // check for ios or android destination
  if (ios && userAgent(req)?.os.name === "iOS") {
    // record event
    waitUntil(recordEvent({ req, linkId: id, finalUrl: constructURL(ios) }));
    // redirect to ios destination
    return NextResponse.redirect(constructURL(ios), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  } else if (android && userAgent(req)?.os.name === "Android") {
    // record event
    waitUntil(recordEvent({ req, linkId: id, finalUrl: constructURL(android) }));
    // redirect to android destination
    return NextResponse.redirect(constructURL(android), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // check for cloaked link
  if (shouldCloak) {
    // record events
    waitUntil(recordEvent({ req, linkId: id, finalUrl: destination }));
    // rewrite to cloaked URL
    return NextResponse.rewrite(new URL(`/${domain}/${slug}/cloaked`, req.url), {
      headers: {
        ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
        ...qrypticHeaders,
      },
    });
  }

  // record event and redirect to destination
  waitUntil(recordEvent({ req, linkId: id, finalUrl: destination }));
  return NextResponse.redirect(destination, {
    headers: {
      ...(!shouldIndex && { "x-robots-tag": "googlebot: noindex" }),
      ...qrypticHeaders,
    },
  });
};
