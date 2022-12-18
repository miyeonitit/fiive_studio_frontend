/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
