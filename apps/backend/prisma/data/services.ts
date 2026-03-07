import type { Service } from '@repo/app-types';

export const services: Service[] = [
	{
		id: 1,
		title: 'Chat',
		icon: 'Cat',
		price: 60,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 2,
		title: 'Chien',
		icon: 'Dog',
		price: 60,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 3,
		title: 'Cheval',
		icon: 'Sparkles',
		price: 120,
		duration: '2h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 4,
		title: 'NAC',
		icon: 'Rabbit',
		price: 30,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
];
