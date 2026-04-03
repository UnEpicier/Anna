import { SchedulesRepository } from '@/api/schedules/schedulesRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
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
			let schedules: Schedule[] = [];

			const cachedSchedules = await redisClient.get('schedules');

			if (cachedSchedules) {
				schedules = JSON.parse(cachedSchedules);
			} else {
				schedules = await this.schedulesRepository.findAll();
				redisClient.set('schedules', JSON.stringify(schedules));
			}

			if (!schedules || schedules.length === 0) {
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

	async updateMany(
		data: Schedule[]
	): Promise<ServiceResponse<Schedule[] | null>> {
		try {
			for (const schedule of data) {
				if (!days.includes(schedule.day)) {
					return ServiceResponse.failure(
						'Unknown day provided',
						null,
						StatusCodes.BAD_REQUEST
					);
				}
			}

			await this.schedulesRepository.updateMany(data);

			redisClient.del('schedules');

			const updatedSchedules = await this.schedulesRepository.findAll();

			return ServiceResponse.success<Schedule[]>(
				'Schedule updated successfully',
				updatedSchedules
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
