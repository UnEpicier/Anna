import type { Department } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { department } from '@/api/departments/departmentsRepository';
import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

vi.mock('@/commons/middleware/requireAuth', () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

describe('Departments API Endpoints', () => {
	describe('GET /departments', () => {
		it('should return departments object', async () => {
			// Act
			const response = await request(app).get('/departments');
			const responseBody: ServiceResponse<Department[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Departments found');
			for (let i = 0; i < responseBody.responseObject.length; i++) {
				compareDepartment(department, responseBody.responseObject[i]);
			}
		});
	});

	describe('GET /departments/actives', () => {
		it('should return active departments object', async () => {
			// Act
			const response = await request(app).get('/departments/actives');
			const responseBody: ServiceResponse<Department[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Active departments found');
			for (let i = 0; i < responseBody.responseObject.length; i++) {
				compareDepartment(department, responseBody.responseObject[i]);
			}
		});
	});

	describe('PUT /departments', () => {
		it('should update departments active status', async () => {
			// Act
			const response = await request(app)
				.put('/departments')
				.send([department.code]);
			const responseBody: ServiceResponse<Department[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Department updated successfully'
			);
			expect(Array.isArray(responseBody.responseObject)).toBeTruthy();

			const updated = responseBody.responseObject.find(
				(d) => d.code === department.code
			);
			expect(updated).toBeDefined();
			expect(updated?.active).toBe(true);
		});

		it('should return 400 for invalid body', async () => {
			// Act
			const response = await request(app)
				.put('/departments')
				.send({ code: '33' });
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid request body');
			expect(responseBody.responseObject).toBeNull();
		});
	});
});

function compareDepartment(
	mockDepartment: Department,
	responseDepartment: Department
) {
	if (!mockDepartment || !responseDepartment) {
		throw new Error(
			'Invalid test data: mockDepartment or responseDepartment is undefined'
		);
	}

	expect(responseDepartment.code).toBeTypeOf('string');
	expect(responseDepartment.name).toBeTypeOf('string');
	expect(responseDepartment.geojson).toBeTypeOf('object');
	expect(responseDepartment.active).toBeTypeOf('boolean');
}
