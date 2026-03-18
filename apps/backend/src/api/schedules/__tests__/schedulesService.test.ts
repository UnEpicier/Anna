import { SchedulesRepository } from '@/api/schedules/schedulesRepository';
import { SchedulesService } from '@/api/schedules/schedulesService';
import type { Schedule } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import type { Mock } from 'vitest';
import { schedules as mockSchedules } from '../../../../prisma/data/schedules';

vi.mock('@/api/schedules/schedulesRepository');

const mockSchedule = mockSchedules[0];

describe('schedulesService', () => {
	let schedulesServiceInstance: SchedulesService;
	let schedulesRepositoryInstance: SchedulesRepository;

	beforeEach(() => {
		schedulesRepositoryInstance = new SchedulesRepository();
		schedulesServiceInstance = new SchedulesService(
			schedulesRepositoryInstance
		);
	});

	describe('findAll', () => {
		it('return schedules', async () => {
			// Arrange
			(schedulesRepositoryInstance.findAll as Mock).mockReturnValue([
				mockSchedule,
			]);

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).equals('Schedules found');
			expect(result.responseObject).toEqual([mockSchedule]);
		});

		it('returns a not found error for no schedules found', async () => {
			// Arrange
			(schedulesRepositoryInstance.findAll as Mock).mockReturnValue(null);

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(result.success).toBeFalsy();
			expect(result.message).equals('No schedules found');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for findAll', async () => {
			// Arrange
			(schedulesRepositoryInstance.findAll as Mock).mockRejectedValue(
				new Error('Database error')
			);

			// Act
			const result = await schedulesServiceInstance.findAll();

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).equals(
				'An error occurred while retrieving schedules.'
			);
			expect(result.responseObject).toBeNull();
		});
	});

	describe('updateMany', () => {
		it('updates and returns all schedules', async () => {
			// Arrange
			const updateData: Schedule = { ...mockSchedule, open: false };
			const updatedSchedules: Schedule[] = [
				updateData,
				...mockSchedules.slice(1),
			];
			(
				schedulesRepositoryInstance.updateMany as Mock
			).mockResolvedValue(undefined);
			(schedulesRepositoryInstance.findAll as Mock).mockReturnValue(
				updatedSchedules
			);

			// Act
			const result = await schedulesServiceInstance.updateMany([
				updateData,
			]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.OK);
			expect(result.success).toBeTruthy();
			expect(result.message).toEqual('Schedule updated successfully');
			expect(result.responseObject).toEqual(updatedSchedules);
		});

		it('returns 400 for unknown day', async () => {
			// Arrange
			const invalidSchedule = { ...mockSchedule, day: 'funday' };

			// Act
			const result =
				await schedulesServiceInstance.updateMany([invalidSchedule]);

			// Assert
			expect(result.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual('Unknown day provided');
			expect(result.responseObject).toBeNull();
		});

		it('handles errors for updateMany', async () => {
			// Arrange
			(
				schedulesRepositoryInstance.updateMany as Mock
			).mockRejectedValue(new Error('Database error'));

			// Act
			const result =
				await schedulesServiceInstance.updateMany([mockSchedule]);

			// Assert
			expect(result.statusCode).toEqual(
				StatusCodes.INTERNAL_SERVER_ERROR
			);
			expect(result.success).toBeFalsy();
			expect(result.message).toEqual(
				'An error occurred while updating schedule.'
			);
			expect(result.responseObject).toBeNull();
		});
	});
});
