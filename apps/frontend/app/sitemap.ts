import type { MetadataRoute } from 'next';

const SITE_URL = 'https://anna-nischwitz.fr';

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: SITE_URL,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1,
			images: [`${SITE_URL}/og-image.png`],
		},
		{
			url: `${SITE_URL}/services`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 0.9,
		},
		{
			url: `${SITE_URL}/seance`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.8,
		},
		{
			url: `${SITE_URL}/contact`,
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 0.7,
		},
	];
}
