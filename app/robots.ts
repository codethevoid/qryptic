import type { MetadataRoute } from "next";

const robots = (): MetadataRoute.Robots => {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/app.qryptic.io", "/admin.qryptic.io"],
    },
    sitemap: "https://qryptic.io/sitemap.xml",
  };
};

export default robots;
