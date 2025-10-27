import createMDX from "@next/mdx";
const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["razorpay"],
  // __dirname isn't available in ESM; use cwd for output tracing:
  outputFileTracingRoot: process.cwd(),

  images: {
    // Allow Cloudinary (CDN + site) and local dev previews
    remotePatterns: [
      // Cloudinary CDN (recommended host)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // keep your cloud name restriction (more secure)
        pathname: "/dq5xhg9uo/**",
      },
      // Sometimes URLs come from cloudinary.com (marketing host) — allow it too
      {
        protocol: "https",
        hostname: "cloudinary.com",
        pathname: "/dq5xhg9uo/**",
      },
      // Local images while developing
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
    // Modern formats (you already had these)
    formats: ["image/avif", "image/webp"],
    // NOTE: Next.js does not support an `images.qualities` array.
    // If you want to control quality per image, use the <Image quality={...}/> prop.
  },

  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
};

export default withMDX(nextConfig);
