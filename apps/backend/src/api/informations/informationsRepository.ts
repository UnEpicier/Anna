import type { Informations } from '@repo/app-types';
import prisma from '@/libs/prisma';

export const informations: Informations = {
	id: 1,
	email: 'example@mail.com',
	phone: '0123456789',
	address: '123 Main St, Anytown',
	actionAddress: '456 Action St, Anytown',
	actionLong: -0.56667,
	actionLat: 44.833328,
	actionRadius: 50,
	facebook: '',
	instagram: '',
	notifyLeave: 30,
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};

export class InformationsRepository {
	async findAsync(): Promise<Informations> {
		return prisma.informations.findFirstOrThrow({
			where: {
				id: 1,
			},
		});
	}

	async updateAsync(data: Partial<Informations>): Promise<Informations> {
		return prisma.informations.update({
			where: {
				id: 1,
			},
			data: {
				...data,
			},
		});
	}
}
