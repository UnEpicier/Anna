import prisma from '@/libs/prisma';
import type { Informations } from '@repo/app-types';

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
