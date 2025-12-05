import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Output static files for Cloudflare Pages
  output: "export",

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Trailing slashes for better compatibility
  trailingSlash: true,

  // Skip type checking during build (faster builds)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Transpile packages that need it
  transpilePackages: [
    "@rainbow-me/rainbowkit",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],

  // Turbopack configuration
  turbopack: {
    root: path.dirname(new URL(import.meta.url).pathname),
  },
};

export default nextConfig;
