import type { Service } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { service } from '@/api/services/servicesRepository';
import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

describe('Services API Endpoints', () => {
	describe('GET /services', () => {
		it('should return services object', async () => {
			// Act
			const response = await request(app).get('/services');
			const responseBody: ServiceResponse<Service[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Services found');
			for (let i = 0; i < responseBody.responseObject.length; i++) {
				compareService(service, responseBody.responseObject[i]);
			}
		});
	});

	describe('GET /services/:id', () => {
		it('should return a service object', async () => {
			// Act
			const response = await request(app).get(`/services/${service.id}`);
			const responseBody: ServiceResponse<Service> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Service found');
			compareService(service, responseBody.responseObject);
		});

		it('should return 400 for invalid id', async () => {
			// Act
			const response = await request(app).get('/services/invalid-id');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing service', async () => {
			// Act
			const response = await request(app).get('/services/9999');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Service not found');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('POST /services', () => {
		it('should create a new service', async () => {
			// Arrange
			const newService: Omit<
				Service,
				'id' | 'enabled' | 'createdAt' | 'updatedAt'
			> = {
				title: 'New Service',
				icon: 'icon',
				price: 150,
				duration: '45 minutes',
				description: 'This is a new service',
			};

			// Act
			const response = await request(app)
				.post('/services')
				.send(newService);
			const responseBody: ServiceResponse<Service> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Service created successfully'
			);
			expect(responseBody.responseObject).toMatchObject(newService);
		});

		it('should return 400 for missing required fields', async () => {
			// Arrange
			const invalidService: Partial<Service> = {
				icon: 'icon',
				price: 150,
			};

			// Act
			const response = await request(app)
				.post('/services')
				.send(invalidService);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Missing required fields');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('PUT /services/:id', () => {
		it('should update an existing service', async () => {
			// Arrange
			const updatedServiceData: Partial<Service> = {
				title: 'Updated Service Title',
			};

			// Act
			const response = await request(app)
				.put(`/services/${service.id}`)
				.send(updatedServiceData);
			const responseBody: ServiceResponse<Service> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Service updated successfully'
			);
			expect(responseBody.responseObject.title).toEqual(
				updatedServiceData.title
			);
		});

		it('should return 400 for invalid id', async () => {
			// Arrange
			const updatedServiceData: Partial<Service> = {
				title: 'Updated Service Title',
			};

			// Act
			const response = await request(app)
				.put('/services/invalid-id')
				.send(updatedServiceData);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('DELETE /services/:id', () => {
		it('should delete an existing service', async () => {
			// Act
			const response = await request(app).delete(
				`/services/${service.id}`
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Service deleted successfully'
			);
		});

		it('should return 400 for invalid id', async () => {
			// Act
			const response = await request(app).delete('/services/invalid-id');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});
	});
});

function compareService(mockService: Service, responseService: Service) {
	if (!mockService || !responseService) {
		throw new Error(
			'Invalid test data: mockService or responseService is undefined'
		);
	}

	expect(responseService.id).toEqual(mockService.id);
	expect(responseService.title).toEqual(mockService.title);
	expect(responseService.icon).toEqual(mockService.icon);
	expect(responseService.price).toEqual(mockService.price);
	expect(responseService.duration).toEqual(mockService.duration);
	expect(responseService.description).toEqual(mockService.description);
	expect(responseService.enabled).toEqual(mockService.enabled);
}
