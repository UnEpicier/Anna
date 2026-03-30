import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';
import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { leave } from '../../../../prisma/data/leave';

vi.mock('@/commons/middleware/requireAuth', () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

describe('Leave API Endpoints', () => {
	describe('GET /leave', () => {
		it('should return the closest upcoming leave within 1 month', async () => {
			// Act
			const response = await request(app).get('/leave');
			const responseBody: ServiceResponse<Leave> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Leave found');
			compareLeave(leave as Leave, responseBody.responseObject);
		});
	});

	describe('GET /leave/all', () => {
		it('should return all leaves', async () => {
			// Act
			const response = await request(app).get('/leave/all');
			const responseBody: ServiceResponse<Leave[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Leaves found');
			expect(Array.isArray(responseBody.responseObject)).toBeTruthy();
		});
	});

	describe('POST /leave', () => {
		it('should create and return a new leave object', async () => {
			// Arrange
			const newLeaveData: Partial<Leave> = {
				from: new Date('2025-01-01T00:00:00Z'),
				to: new Date('2025-01-10T23:59:59Z'),
			};

			// Act
			const response = await request(app)
				.post('/leave')
				.send(newLeaveData);
			const responseBody: ServiceResponse<Leave> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Leave created successfully'
			);
			if (responseBody.responseObject) {
				compareLeave(
					responseBody.responseObject,
					responseBody.responseObject
				);
			} else {
				throw new Error('Response object is undefined');
			}
		});
	});

	describe('PUT /leave/:id', () => {
		it('should update and return the updated leave object', async () => {
			// Arrange
			const updateData: Partial<Leave> = {
				to: new Date('2024-12-31T23:59:59Z'),
			};

			// Act
			const response = await request(app)
				.put(`/leave/${leave.id}`)
				.send(updateData);
			const responseBody: ServiceResponse<Leave> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Leave updated successfully'
			);
			if (responseBody.responseObject) {
				compareLeave(leave as Leave, responseBody.responseObject);
			} else {
				throw new Error('Response object is undefined');
			}
		});

		it('should return 404 when leave does not exist', async () => {
			// Act
			const response = await request(app)
				.put('/leave/99999')
				.send({ to: new Date() });
			const responseBody: ServiceResponse<null> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Leave not found');
		});
	});

	describe('DELETE /leave/:id', () => {
		it('should delete the leave object', async () => {
			// Act
			const response = await request(app).delete(`/leave/${leave.id}`);
			const responseBody: ServiceResponse<null> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Leave deleted successfully'
			);
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 when leave does not exist', async () => {
			// Act
			const response = await request(app).delete('/leave/99999');
			const responseBody: ServiceResponse<null> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Leave not found');
		});
	});
});

function compareLeave(mockLeave: Leave, responseLeave: Leave) {
	if (!mockLeave || !responseLeave) {
		throw new Error(
			'Invalid test data: mockLeave or responseLeave is undefined'
		);
	}

	expect(responseLeave.id).toEqual(mockLeave.id);
	expect(responseLeave.from).toMatch(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
	);
	expect(responseLeave.to).toMatch(
		/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/
	);
}
