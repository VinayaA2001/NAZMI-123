// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
    // Disable styled-jsx
    styledJsx: false,
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig