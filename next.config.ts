import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "micoach-prod-bucket.s3.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
