import createMDX from "@next/mdx";
const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["razorpay"],
  // __dirname isn't available in ESM; use cwd for output tracing:
  outputFileTracingRoot: process.cwd(),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dq5xhg9uo/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85, 90],
  },

  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
};

export default withMDX(nextConfig);
