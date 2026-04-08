import { PopupMessageRepository } from '@/api/popup-message/popupMessageRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
import type { PopupMessage } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';

export class PopupMessageService {
	private popupMessageRepository: PopupMessageRepository;

	constructor(
		repository: PopupMessageRepository = new PopupMessageRepository()
	) {
		this.popupMessageRepository = repository;
	}

	async find(): Promise<ServiceResponse<PopupMessage | null>> {
		try {
			const cached = await redisClient.get('popup-message');
			if (cached) {
				return ServiceResponse.success<PopupMessage>(
					'PopupMessage found',
					JSON.parse(cached)
				);
			}

			const popupMessage = await this.popupMessageRepository.findAsync();
			redisClient.set('popup-message', JSON.stringify(popupMessage));

			return ServiceResponse.success<PopupMessage>(
				'PopupMessage found',
				popupMessage
			);
		} catch (error) {
			console.error(
				`Error finding popup message: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while retrieving popup message.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		data: Partial<PopupMessage>
	): Promise<ServiceResponse<PopupMessage | null>> {
		try {
			const updated =
				await this.popupMessageRepository.updateAsync(data);
			redisClient.del('popup-message');
			return ServiceResponse.success<PopupMessage>(
				'PopupMessage updated successfully',
				updated
			);
		} catch (error) {
			console.error(
				`Error updating popup message: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while updating popup message.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const popupMessageService = new PopupMessageService();
