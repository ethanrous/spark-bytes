/** @type {import('next').NextConfig} */
const withNextJsObfuscator = require("nextjs-obfuscator")({
  disableConsoleOutput: false,
});
const nextConfig = withNextJsObfuscator({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
});

module.exports = nextConfig;
