/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  source: '/api/:path*',
  destination: 'http://localhost:5000/api/:path*'
}

export default nextConfig
