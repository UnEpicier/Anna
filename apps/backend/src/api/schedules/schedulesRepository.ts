import prisma from "@/libs/prisma";
import type { Schedule } from "./schedulesModel";

export const schedule: Schedule = {
	day: "monday",
	startTime: new Date(),
	endTime: new Date(),
	open: true,
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};

export class SchedulesRepository {
	async findAllAsync(): Promise<Schedule[]> {
		return prisma.schedules.findMany();
	}

	async updateAsync(day: string, data: Partial<Schedule>): Promise<Schedule> {
		return prisma.schedules.update({
			where: {
				day: day,
			},
			data: {
				...data,
			},
		});
	}
}
