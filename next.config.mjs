/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains (if needed)
      },
    ],
  },
};

export default nextConfig;
