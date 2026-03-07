import { type Service, ServiceSchema } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
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
					'Any services found',
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

	async find(id: string): Promise<ServiceResponse<Service | null>> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const service = await this.servicesRepository.findById(parsedId);
			if (!service) {
				return ServiceResponse.failure(
					'Service not found',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			return ServiceResponse.success<Service>('Service found', service);
		} catch (error) {
			const errorMessage = `Error finding service: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving service.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async create(
		data: Omit<Service, 'id' | 'enabled' | 'createdAt' | 'updatedAt'>
	): Promise<ServiceResponse<Service | null>> {
		const dataSchema = ServiceSchema.omit({
			id: true,
			enabled: true,
			createdAt: true,
			updatedAt: true,
		});

		const validationResult = dataSchema.safeParse(data);
		if (!validationResult.success) {
			return ServiceResponse.failure(
				'Missing required fields',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const newService = await this.servicesRepository.create(data);
			return ServiceResponse.success<Service>(
				'Service created successfully',
				newService,
				StatusCodes.CREATED
			);
		} catch (error) {
			const errorMessage = `Error creating service: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while creating service.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		id: string,
		data: Partial<Service>
	): Promise<ServiceResponse<Service | null>> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const updatedInformations = await this.servicesRepository.update(
				parsedId,
				data
			);
			return ServiceResponse.success<Service>(
				'Service updated successfully',
				updatedInformations
			);
		} catch (error) {
			const errorMessage = `Error updating service: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating service.',
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
