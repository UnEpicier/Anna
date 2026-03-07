import type { Leave } from '@repo/app-types';

export const leave: Leave = {
	id: 1,
	from: new Date(),
	to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};
