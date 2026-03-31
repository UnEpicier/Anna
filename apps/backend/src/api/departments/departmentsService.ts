import { DepartmentsRepository } from '@/api/departments/departmentsRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
import type { Department } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';

export class DepartmentsService {
	private departmentsRepository: DepartmentsRepository;

	constructor(
		repository: DepartmentsRepository = new DepartmentsRepository()
	) {
		this.departmentsRepository = repository;
	}

	async findAll(): Promise<ServiceResponse<Department[] | null>> {
		try {
			let departments: Department[] = [];

			const cachedDepartments = await redisClient.get('departments');

			if (cachedDepartments) {
				departments = JSON.parse(cachedDepartments);
			} else {
				departments = await this.departmentsRepository.findAllAsync();
				redisClient.set('departments', JSON.stringify(departments));
			}

			if (departments.length === 0) {
				return ServiceResponse.failure(
					'No departments found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<Department[]>(
				'Departments found',
				departments
			);
		} catch (error) {
			const errorMessage = `Error finding departments: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving departments.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async findActives(): Promise<ServiceResponse<Department[] | null>> {
		try {
			let departments: Department[] = [];

			const cachedDepartments =
				await redisClient.get('activeDepartments');

			if (cachedDepartments) {
				departments = JSON.parse(cachedDepartments);
			} else {
				departments =
					await this.departmentsRepository.findActivesAsync();
				redisClient.set(
					'activeDepartments',
					JSON.stringify(departments)
				);
			}

			if (departments.length === 0) {
				return ServiceResponse.failure(
					'No active departments found',
					null,
					StatusCodes.NO_CONTENT
				);
			}
			return ServiceResponse.success<Department[]>(
				'Active departments found',
				departments
			);
		} catch (error) {
			const errorMessage = `Error finding active departments: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving active departments.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(
		body: string[]
	): Promise<ServiceResponse<Department[] | null>> {
		try {
			if (
				!body ||
				!Array.isArray(body) ||
				!body.every((item) => typeof item === 'string')
			) {
				return ServiceResponse.failure(
					'Invalid request body',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const updatedDepartment =
				await this.departmentsRepository.updateAsync(body);
			if (!updatedDepartment) {
				return ServiceResponse.failure(
					'Department not found',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			redisClient.del('activeDepartments');

			return ServiceResponse.success<Department[]>(
				'Department updated successfully',
				updatedDepartment
			);
		} catch (error) {
			const errorMessage = `Error updating department: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating the department.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const departmentsService = new DepartmentsService();
