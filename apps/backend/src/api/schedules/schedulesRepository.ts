import prisma from '@/libs/prisma';
import type { Schedule } from '@repo/app-types';

export class SchedulesRepository {
	async findAll(): Promise<Schedule[]> {
		return prisma.schedules.findMany();
	}

	async updateMany(data: Schedule[]): Promise<Schedule[]> {
		const schedules = await prisma.$transaction(
			data.map((schedule) =>
				prisma.schedules.update({
					where: {
						day: schedule.day,
					},
					data: data,
				})
			)
		);

		return schedules;
	}
}
