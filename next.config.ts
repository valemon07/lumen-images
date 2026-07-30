import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "lumen-images-bucket-695331051566-us-east-1-an.s3.us-east-1.amazonaws.com",
      },
    ],
  },
};
export default nextConfig;
