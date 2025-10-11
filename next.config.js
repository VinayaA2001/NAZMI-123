/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['razorpay'],
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
