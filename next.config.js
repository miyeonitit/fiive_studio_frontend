/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'akamai',
    path: '/pages',
  },
  output: 'export',
}

module.exports = nextConfig
