import prisma from "@/libs/prisma";
import type { Leave } from "./leaveModel";

export const leave: Leave = {
	id: 1,
	from: new Date(),
	to: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
	createdAt: new Date(),
	updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
};

export class LeaveRepository {
	async findAsync(): Promise<Leave | null> {
		return prisma.leave.findFirst({
			where: {
				id: 1,
			},
		});
	}

	async createAsync(data: Omit<Leave, "id" | "createdAt" | "updatedAt">): Promise<Leave> {
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
