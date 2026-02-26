import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	transpilePackages: ['@repo/ui'],
	images: {
		remotePatterns: [new URL('https://images.unsplash.com/**')],
	},
};

export default nextConfig;
