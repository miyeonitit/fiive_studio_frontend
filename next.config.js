/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  // trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: 'akamai',
    path: '/pages',
  },
  output: 'export',
  // experimental: {
  //   allowMiddlewareResponseBody: true,
  // },
}

module.exports = nextConfig
