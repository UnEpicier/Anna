import prisma from '@/libs/prisma';
import type { Leave } from '@repo/app-types';

export class LeaveRepository {
	async findForFrontendAsync(): Promise<Leave | null> {
		const now = new Date();
		const oneMonthLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
		return prisma.leave.findFirst({
			where: {
				to: { gte: now },
				from: { lte: oneMonthLater },
			},
			orderBy: { from: 'asc' },
		});
	}

	async findAllAsync(): Promise<Leave[]> {
		return prisma.leave.findMany({
			orderBy: { from: 'asc' },
		});
	}

	async createAsync(
		data: Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<Leave> {
		return prisma.leave.create({ data });
	}

	async updateAsync(
		id: number,
		data: Partial<Omit<Leave, 'id' | 'createdAt' | 'updatedAt'>>
	): Promise<Leave> {
		return prisma.leave.update({ where: { id }, data });
	}

	async deleteAsync(id: number): Promise<Leave> {
		return prisma.leave.delete({ where: { id } });
	}

	async deleteExpiredAsync(): Promise<number> {
		const result = await prisma.leave.deleteMany({
			where: { to: { lt: new Date() } },
		});
		return result.count;
	}
}
