import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx", "js", "jsx"],
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        hostname: "cdn.qryptic.io",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "www.google.com",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
