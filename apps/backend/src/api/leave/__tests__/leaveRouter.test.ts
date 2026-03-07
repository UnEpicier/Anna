import type { Leave } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { leave } from '@/api/leave/leaveRepository';
import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

describe('Leave API Endpoints', () => {
	describe('GET /leave', () => {
		it('should return leave object', async () => {
			// Act
			const response = await request(app).get('/leave');
			const responseBody: ServiceResponse<Leave> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Leave found');
			compareInformations(leave as Leave, responseBody.responseObject);
		});
	});

	describe('PUT /leave', () => {
		it('should update and return the updated leave object', async () => {
			// Arrange
			const updateData: Partial<Leave> = {
				to: new Date('2024-12-31T23:59:59Z'),
			};

			// Act
			const response = await request(app).put('/leave').send(updateData);
			const responseBody: ServiceResponse<Leave> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Leave updated successfully'
			);
			if (responseBody.responseObject) {
				compareInformations(
					leave as Leave,
					responseBody.responseObject
				);
			} else {
				throw new Error('Response object is undefined');
			}
		});
	});

	describe('DELETE /leave', () => {
		it('should delete the leave object', async () => {
			// Act
			const response = await request(app).delete('/leave');
			const responseBody: ServiceResponse<null> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Leave deleted successfully'
			);
			expect(responseBody.responseObject).toBeNull();
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
				compareInformations(
					responseBody.responseObject,
					responseBody.responseObject
				);
			} else {
				throw new Error('Response object is undefined');
			}
		});
	});
});

function compareInformations(mockLeave: Leave, responseLeave: Leave) {
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
