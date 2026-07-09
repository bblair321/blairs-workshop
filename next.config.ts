import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.blairsworkshop.com" }],
        destination: "https://blairsworkshop.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
