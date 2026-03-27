import type { NextConfig } from 'next';

const securityHeaders = [
	{ key: 'X-Frame-Options', value: 'DENY' },
	{ key: 'X-Content-Type-Options', value: 'nosniff' },
	{ key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
	{
		key: 'Permissions-Policy',
		value: 'camera=(), microphone=(), geolocation=self',
	},
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=31536000; includeSubDomains',
	},
	{
		key: 'Content-Security-Policy',
		value: [
			"default-src 'self'",
			// unsafe-eval required by React (dev overlays + some runtime dependencies)
			"script-src 'self' 'unsafe-inline' 'unsafe-eval'",
			"style-src 'self' 'unsafe-inline'",
			"img-src 'self' data: blob: https://images.unsplash.com https://api.maptiler.com",
			"font-src 'self' https://api.maptiler.com",
			"connect-src 'self' https://api.maptiler.com data:",
		].join('; '),
	},
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
