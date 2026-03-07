import type { Department } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { department } from '@/api/departments/departmentsRepository';
import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

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

	describe('PUT /departments/:id', () => {
		it('should update department active status', async () => {
			// Arrange
			const updatedActiveStatus = !department.active;

			// Act
			const response = await request(app)
				.put(`/departments/${department.code}`)
				.send({ active: updatedActiveStatus });
			const responseBody: ServiceResponse<Department> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Department updated successfully'
			);
			expect(responseBody.responseObject).toBeDefined();
			if (responseBody.responseObject) {
				expect(responseBody.responseObject.active).toEqual(
					updatedActiveStatus
				);
				compareDepartment(
					{ ...department, active: updatedActiveStatus },
					responseBody.responseObject
				);
			}
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

	expect(responseDepartment.code).toEqual(mockDepartment.code);
	expect(responseDepartment.name).toEqual(mockDepartment.name);
	expect(responseDepartment.geojson).toBeTypeOf('object');
	expect(responseDepartment.active).toEqual(mockDepartment.active);
}
