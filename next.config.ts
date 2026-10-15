import type { NextConfig } from "next";

// Static single-page export. After `next build`, scripts/relative-assets.mjs
// rewrites root-absolute asset URLs so the export works from any nested sub-path.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
