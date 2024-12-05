/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		unoptimized: true,
	},
	output: 'export',
	reactStrictMode: true,
	// async redirects() {
	// 	return [{
	// 		source: '/api/:path*',
	// 		destination: 'http://localhost:5000/api/:path*',
	// 		permanent: false
	// 	}]
	// },
}

export default nextConfig
