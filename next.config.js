/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true, // Required if using app/ directory
  },
  output: 'standalone', // <-- Important for Vercel SSR deployment
}

module.exports = nextConfig
