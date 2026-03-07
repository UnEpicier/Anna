import prisma from '@/libs/prisma';
import type { Schedule } from '@repo/app-types';

export class SchedulesRepository {
	async findAllAsync(): Promise<Schedule[]> {
		return prisma.schedules.findMany();
	}

	async updateAsync(day: string, data: Schedule): Promise<Schedule> {
		return prisma.schedules.update({
			where: {
				day: day,
			},
			data: data,
		});
	}
}
