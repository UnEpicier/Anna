import prisma from '@/libs/prisma';
import type { Announcement } from '@repo/app-types';

export class AnnouncementRepository {
	async findAsync(): Promise<Announcement> {
		return prisma.announcement.findFirstOrThrow({
			where: { id: 1 },
		});
	}

	async updateAsync(data: Partial<Announcement>): Promise<Announcement> {
		return prisma.announcement.update({
			where: { id: 1 },
			data: { ...data },
		});
	}
}
