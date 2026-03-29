import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

const cspHeader = [
	"default-src 'self'",
	// unsafe-eval required by React dev mode (error overlays, call stack reconstruction)
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data: blob: https://images.unsplash.com https://api.maptiler.com",
	"font-src 'self' https://api.maptiler.com",
	"connect-src 'self' https://api.maptiler.com data:",
	'worker-src blob:',
].join('; ');

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [new URL('https://images.unsplash.com/**')],
	},
	allowedDevOrigins: ['192.168.1.24'],
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{ key: 'Content-Security-Policy', value: cspHeader },
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=self',
					},
				],
			},
		];
	},
};

export default nextConfig;
