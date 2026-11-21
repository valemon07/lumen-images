import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images: {
    qualities: [75, 85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`,
      },
    ],
  },
};
export default nextConfig;
