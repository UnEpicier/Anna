import prisma from '@/libs/prisma';
import type { Leave } from '@repo/app-types';

export class LeaveRepository {
	async findAsync(): Promise<Leave | null> {
		return prisma.leave.findFirst({
			where: {
				id: 1,
			},
		});
	}

	async createAsync(
		data: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Leave> {
		return prisma.leave.create({
			data: {
				...data,
			},
		});
	}

	async updateAsync(data: Partial<Leave>): Promise<Leave> {
		return prisma.leave.update({
			where: {
				id: 1,
			},
			data: {
				...data,
			},
		});
	}

	async deleteAsync(): Promise<Leave> {
		return prisma.leave.delete({
			where: {
				id: 1,
			},
		});
	}
}
