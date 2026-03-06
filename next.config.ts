import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.thesportsdb.com"
      },
      {
        protocol: "https",
        hostname: "flagsapi.com"
      }
    ]
  }
};

export default nextConfig;
