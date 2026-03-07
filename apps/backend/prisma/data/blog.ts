import type { BlogCategory, BlogPost } from '@repo/app-types';

export const categories: BlogCategory[] = [
	{
		id: 1,
		name: 'Technology',
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 2,
		name: 'Health',
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 3,
		name: 'Travel',
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
];

export const posts: BlogPost[] = [
	{
		id: 1,
		title: 'The Future of AI Technology',
		uri: 'future-of-ai-technology',
		content: [
			{
				type: 'heading',
				level: 2,
				text: 'The Future of AI Technology',
			},
			{
				type: 'paragraph',
				text: 'Artificial Intelligence (AI) is rapidly evolving and transforming various industries. From healthcare to finance, AI is making significant strides in improving efficiency and decision-making processes.',
			},
			{
				type: 'heading',
				level: 3,
				text: 'Advancements in AI',
			},
			{
				type: 'paragraph',
				text: 'Recent advancements in AI include natural language processing, computer vision, and machine learning algorithms. These technologies are enabling machines to understand and interpret human language, recognize images, and learn from data more effectively.',
			},
		],
		categories: [categories[0]],
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
		excerpt:
			'Exploring the advancements and future prospects of AI technology.',
		illustrationUrl: 'https://example.com/ai-future.jpg',
		visible: true,
	},
	{
		id: 2,
		title: 'Top 10 Travel Destinations for 2024',
		uri: 'top-10-travel-destinations-2024',
		content: [
			{
				type: 'heading',
				level: 2,
				text: 'Top 10 Travel Destinations for 2024',
			},
			{
				type: 'paragraph',
				text: 'As travel restrictions ease, many are eager to explore new destinations. Here are the top 10 travel spots to consider for your 2024 adventures.',
			},
		],
		categories: [categories[1], categories[2]],
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
		excerpt:
			'Discover the must-visit travel destinations for the year 2024.',
		illustrationUrl: 'https://example.com/travel-2024.jpg',
		visible: true,
	},
];
