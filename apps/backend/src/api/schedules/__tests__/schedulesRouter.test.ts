import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';
import type { Schedule } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { schedules } from '../../../../prisma/data/schedules';

vi.mock('@/commons/middleware/requireAuth', () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const schedule = schedules[0];

describe('Schedules API Endpoints', () => {
	describe('GET /schedules', () => {
		it('should return schedules object', async () => {
			// Act
			const response = await request(app).get('/schedules');
			const responseBody: ServiceResponse<Schedule[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Schedules found');
			expect(Array.isArray(responseBody.responseObject)).toBeTruthy();
			for (const s of responseBody.responseObject) {
				compareSchedule(s);
			}
		});
	});

	describe('PUT /schedules', () => {
		it('should update schedules', async () => {
			// Arrange
			const updatedSchedule: Schedule = {
				...schedule,
				open: false,
			};

			// Act
			const response = await request(app)
				.put('/schedules')
				.send([updatedSchedule]);
			const responseBody: ServiceResponse<Schedule[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Schedule updated successfully'
			);

			const updatedInResponse = responseBody.responseObject.find(
				(s) => s.day === updatedSchedule.day
			);
			if (updatedInResponse) {
				expect(updatedInResponse.open).toEqual(false);
			} else {
				throw new Error(
					`Day "${updatedSchedule.day}" not found in response`
				);
			}
		});

		it('should return 400 for invalid day', async () => {
			// Arrange
			const invalidSchedule = {
				day: 'funday',
				time: '',
				location: '',
				open: false,
			};

			// Act
			const response = await request(app)
				.put('/schedules')
				.send([invalidSchedule]);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Unknown day provided');
			expect(responseBody.responseObject).toBeNull();
		});
	});
});

function compareSchedule(responseSchedule: Schedule) {
	if (!responseSchedule) {
		throw new Error('Invalid test data: responseSchedule is undefined');
	}

	expect(responseSchedule.day).toBeTypeOf('string');
	expect(responseSchedule.time).toBeTypeOf('string');
	expect(responseSchedule.location).toBeTypeOf('string');
	expect(responseSchedule.open).toBeTypeOf('boolean');
}
