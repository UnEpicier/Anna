import { StatusCodes } from "http-status-codes";
import type { Schedule } from "@/api/schedules/schedulesModel";
import { SchedulesRepository } from "@/api/schedules/schedulesRepository";
import { ServiceResponse } from "@/commons/models/serviceResponse";

export class SchedulesService {
	private schedulesRepository: SchedulesRepository;

	constructor(repository: SchedulesRepository = new SchedulesRepository()) {
		this.schedulesRepository = repository;
	}

	async findAll(): Promise<ServiceResponse<Schedule[] | null>> {
		try {
			const schedules = await this.schedulesRepository.findAllAsync();
			if (!schedules) {
				return ServiceResponse.failure("No schedules found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Schedule[]>("Schedules found", schedules);
		} catch (error) {
			const errorMessage = `Error finding schedules: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving schedules.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async update(day: string, data: Partial<Schedule>): Promise<ServiceResponse<Schedule | null>> {
		try {
			const updatedSchedule = await this.schedulesRepository.updateAsync(day, data);
			return ServiceResponse.success<Schedule>("Schedule updated successfully", updatedSchedule);
		} catch (error) {
			const errorMessage = `Error updating schedule: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while updating schedule.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const schedulesService = new SchedulesService();
