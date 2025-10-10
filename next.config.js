/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['razorpay'],
  outputFileTracingRoot: __dirname,
  images: {
    domains: ['localhost'],
  },
}

module.exports = nextConfig
