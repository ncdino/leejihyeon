import type { NextConfig } from "next";
import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    domains: [
      "leejihyeon-blog-storage.s3.amazonaws.com",
      "images.unsplash.com",
    ],
  },
};

export default nextConfig;
