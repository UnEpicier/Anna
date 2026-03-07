import type { Informations } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import { InformationsRepository } from '@/api/informations/informationsRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';

export class InformationsService {
	private informationsRepository: InformationsRepository;

	constructor(
		repository: InformationsRepository = new InformationsRepository()
	) {
		this.informationsRepository = repository;
	}

	async find(): Promise<ServiceResponse<Informations | null>> {
		try {
			const informations = await this.informationsRepository.findAsync();
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
