/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
