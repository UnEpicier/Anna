import type { Service } from '@repo/app-types';

export const services: Service[] = [
	{
		id: 1,
		title: 'Chat',
		emoji: '🐈',
		shortDescription: 'Soins en douceur dans un environnement familier',
		price: 60,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
	},
	{
		id: 2,
		title: 'Chien',
		emoji: '🐕',
		shortDescription:
			'Prise en charge adaptée à toutes les races et tous les âges',
		price: 60,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
	},
	{
		id: 3,
		title: 'Cheval',
		emoji: '🐴',
		shortDescription: 'Ostéopathie équine pour améliorer les performances',
		price: 120,
		duration: '2h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
	},
	{
		id: 4,
		title: 'NAC',
		emoji: '🐰',
		shortDescription:
			'Expertise pour lapins, furets et autres petits animaux',
		price: 30,
		duration: '1h',
		description:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		enabled: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
	},
];
