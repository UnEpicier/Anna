import prisma from '@/libs/prisma';
import type { PopupMessage } from '@repo/app-types';

export class PopupMessageRepository {
	async findAsync(): Promise<PopupMessage> {
		return prisma.popupMessage.findFirstOrThrow({
			where: { id: 1 },
		});
	}

	async updateAsync(data: Partial<PopupMessage>): Promise<PopupMessage> {
		return prisma.popupMessage.update({
			where: { id: 1 },
			data: { ...data },
		});
	}
}
