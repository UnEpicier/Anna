import { StatusCodes } from "http-status-codes";
import type { Department } from "@repo/app-types";
import { DepartmentsRepository } from "@/api/departments/departmentsRepository";
import { ServiceResponse } from "@/commons/models/serviceResponse";

export class DepartmentsService {
	private departmentsRepository: DepartmentsRepository;

	constructor(repository: DepartmentsRepository = new DepartmentsRepository()) {
		this.departmentsRepository = repository;
	}

	async findAll(): Promise<ServiceResponse<Department[] | null>> {
		try {
			const departments = await this.departmentsRepository.findAllAsync();
			if (!departments) {
				return ServiceResponse.failure("No departments found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Department[]>("Departments found", departments);
		} catch (error) {
			const errorMessage = `Error finding departments: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving departments.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findActives(): Promise<ServiceResponse<Department[] | null>> {
		try {
			const departments = await this.departmentsRepository.findActivesAsync();
			if (!departments) {
				return ServiceResponse.failure("No active departments found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Department[]>("Active departments found", departments);
		} catch (error) {
			const errorMessage = `Error finding active departments: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving active departments.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(code: string, body: Partial<Department>): Promise<ServiceResponse<Department | null>> {
		try {
			if (!body || typeof body.active !== "boolean") {
				return ServiceResponse.failure("Invalid request body", null, StatusCodes.BAD_REQUEST);
			}

			const updatedDepartment = await this.departmentsRepository.updateAsync(code, body.active);
			if (!updatedDepartment) {
				return ServiceResponse.failure("Department not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Department>("Department updated successfully", updatedDepartment);
		} catch (error) {
			const errorMessage = `Error updating department: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while updating the department.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const departmentsService = new DepartmentsService();
