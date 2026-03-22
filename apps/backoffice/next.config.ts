import type { NextConfig } from 'next';

const securityHeaders = [
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{ key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
	transpilePackages: ['@repo/ui'],
	images: {
		remotePatterns: [new URL('https://images.unsplash.com/**')],
	},
	async headers() {
		return [{ source: '/(.*)', headers: securityHeaders }];
	},
};

export default nextConfig;
