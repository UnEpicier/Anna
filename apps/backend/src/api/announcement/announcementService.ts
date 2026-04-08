import { AnnouncementRepository } from '@/api/announcement/announcementRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
import { AnnouncementSchema, type Announcement } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';

export class AnnouncementService {
	private announcementRepository: AnnouncementRepository;

	constructor(
		repository: AnnouncementRepository = new AnnouncementRepository()
	) {
		this.announcementRepository = repository;
	}

	async find(): Promise<ServiceResponse<Announcement | null>> {
		try {
			const cached = await redisClient.get('announcement');
			if (cached) {
				return ServiceResponse.success<Announcement>(
					'Announcement found',
					JSON.parse(cached)
				);
			}

			const announcement = await this.announcementRepository.findAsync();
			redisClient.set('announcement', JSON.stringify(announcement));

			return ServiceResponse.success<Announcement>(
				'Announcement found',
				announcement
			);
		} catch (error) {
			console.error(
				`Error finding announcement: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while retrieving announcement.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		data: unknown
	): Promise<ServiceResponse<Announcement | null>> {
		const UpdateSchema = AnnouncementSchema.pick({
			enabled: true,
			title: true,
			message: true,
			ctaLabel: true,
			ctaUrl: true,
			ctaOpenInNewTab: true,
		}).partial();

		const parsed = UpdateSchema.safeParse(data);
		if (!parsed.success) {
			return ServiceResponse.failure(
				'Invalid announcement data.',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const updated =
				await this.announcementRepository.updateAsync(parsed.data);
			redisClient.del('announcement');
			return ServiceResponse.success<Announcement>(
				'Announcement updated successfully',
				updated
			);
		} catch (error) {
			console.error(
				`Error updating announcement: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while updating announcement.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const announcementService = new AnnouncementService();
