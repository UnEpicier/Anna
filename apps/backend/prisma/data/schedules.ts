import type { Schedule } from '@repo/app-types';

export const schedules: Schedule[] = [
	{
		day: 'monday',
		time: '9h 12h',
		location: 'À domicile',
		open: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'tuesday',
		time: '9h 12h',
		location: 'À domicile',
		open: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'wednesday',
		time: '9h 12h',
		location: 'À domicile',
		open: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'thursday',
		time: '9h 12h',
		location: 'À domicile',
		open: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'friday',
		time: '9h 12h',
		location: 'À domicile',
		open: true,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'saturday',
		time: '',
		location: 'À domicile',
		open: false,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		day: 'sunday',
		time: '',
		location: 'À domicile',
		open: false,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
];
