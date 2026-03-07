import { SchedulesRepository } from '@/api/schedules/schedulesRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import type { Schedule } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';

const days = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
	'sunday',
];

export class SchedulesService {
	private schedulesRepository: SchedulesRepository;

	constructor(repository: SchedulesRepository = new SchedulesRepository()) {
		this.schedulesRepository = repository;
	}

	async findAll(): Promise<ServiceResponse<Schedule[] | null>> {
		try {
			const schedules = await this.schedulesRepository.findAllAsync();
			if (!schedules) {
				return ServiceResponse.failure(
					'No schedules found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<Schedule[]>(
				'Schedules found',
				schedules
			);
		} catch (error) {
			const errorMessage = `Error finding schedules: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving schedules.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async update(data: Schedule[]): Promise<ServiceResponse<Schedule | null>> {
		try {
			for (const schedule of data) {
				if (!days.includes(schedule.day)) continue;

				await this.schedulesRepository.updateAsync(
					schedule.day,
					schedule
				);
			}

			const newSchedules = await this.schedulesRepository.findAllAsync();
			return ServiceResponse.success<Schedule[]>(
				'Schedule updated successfully',
				newSchedules
			);
		} catch (error) {
			const errorMessage = `Error updating schedule: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating schedule.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const schedulesService = new SchedulesService();
