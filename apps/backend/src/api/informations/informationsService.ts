import { InformationsRepository } from '@/api/informations/informationsRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
import type { Informations } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';

export class InformationsService {
	private informationsRepository: InformationsRepository;

	constructor(
		repository: InformationsRepository = new InformationsRepository()
	) {
		this.informationsRepository = repository;
	}

	async find(
		cache: boolean = true
	): Promise<ServiceResponse<Informations | null>> {
		try {
			let informations: Informations | null = null;

			if (cache) {
				const cachedInformations =
					await redisClient.get('informations');

				if (cachedInformations) {
					informations = JSON.parse(cachedInformations);
				} else {
					informations =
						await this.informationsRepository.findAsync();
					redisClient.set(
						'informations',
						JSON.stringify(informations)
					);
				}
			} else {
				informations = await this.informationsRepository.findAsync();
			}

			if (!informations) {
				return ServiceResponse.failure(
					'No Informations found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<Informations>(
				'Informations found',
				informations
			);
		} catch (error) {
			const errorMessage = `Error finding informations: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving informations.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		data: Partial<Informations>
	): Promise<ServiceResponse<Informations | null>> {
		try {
			const updatedInformations =
				await this.informationsRepository.updateAsync(data);

			redisClient.del('informations');

			return ServiceResponse.success<Informations>(
				'Informations updated successfully',
				updatedInformations
			);
		} catch (error) {
			const errorMessage = `Error updating informations: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating informations.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const informationsService = new InformationsService();
