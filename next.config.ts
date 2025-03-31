import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    appIsrStatus: false,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com", // Google のプロフィール画像ドメイン
    ],
  },
};

export default nextConfig;
