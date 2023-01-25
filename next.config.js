/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'akamai',
    path: '/pages',
  },
  // experimental: {
  //   allowMiddlewareResponseBody: true,
  // },
}

module.exports = nextConfig
