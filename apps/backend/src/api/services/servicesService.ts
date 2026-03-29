import { type Service, ServiceSchema } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import z from 'zod';
import { ServicesRepository } from '@/api/services/servicesRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';

export class ServicesService {
	private servicesRepository: ServicesRepository;

	constructor(repository: ServicesRepository = new ServicesRepository()) {
		this.servicesRepository = repository;
	}

	async findAll(): Promise<ServiceResponse<Service[] | null>> {
		try {
			const services = await this.servicesRepository.findAll();
			if (!services) {
				return ServiceResponse.failure(
					'No services found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<Service[]>(
				'Services found',
				services
			);
		} catch (error) {
			const errorMessage = `Error finding services: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving services.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async createMany(
		data: Omit<Service, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>[]
	): Promise<ServiceResponse<Service[] | null>> {
		const dataSchema = z.array(
			ServiceSchema.omit({
				id: true,
				enabled: true,
				createdAt: true,
				updatedAt: true,
			})
		);

		const validationResult = dataSchema.safeParse(data);
		if (!validationResult.success) {
			return ServiceResponse.failure(
				'Missing required fields',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const newServices = await this.servicesRepository.createMany(
				validationResult.data
			);
			return ServiceResponse.success<Service[]>(
				'Services created successfully',
				newServices,
				StatusCodes.CREATED
			);
		} catch (error) {
			const errorMessage = `Error creating services: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while creating services.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async updateMany(
		data: Partial<Service>[]
	): Promise<ServiceResponse<Service[] | null>> {
		try {
			for (const service of data) {
				if (!service.id) {
					return ServiceResponse.failure(
						'Missing service ID',
						null,
						StatusCodes.BAD_REQUEST
					);
				}

				const parsedId = parseInt(`${service.id}`, 10);
				if (!parsedId || parsedId <= 0) {
					return ServiceResponse.failure(
						'Invalid ID provided',
						null,
						StatusCodes.BAD_REQUEST
					);
				}
			}

			const updatedServices =
				await this.servicesRepository.updateMany(data);
			return ServiceResponse.success<Service[]>(
				'Services updated successfully',
				updatedServices
			);
		} catch (error) {
			const errorMessage = `Error updating services: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating services.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async delete(id: string): Promise<ServiceResponse> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			await this.servicesRepository.delete(parsedId);
			return ServiceResponse.success<null>(
				'Service deleted successfully',
				null
			);
		} catch (error) {
			const errorMessage = `Error deleting service: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while deleting service.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const servicesService = new ServicesService();
