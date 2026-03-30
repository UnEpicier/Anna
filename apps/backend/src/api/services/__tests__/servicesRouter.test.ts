import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';
import type { Service } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { services } from '../../../../prisma/data/services';

vi.mock('@/commons/middleware/requireAuth', () => ({
	requireAuth: (_req: unknown, _res: unknown, next: () => void) => next(),
}));

const service = services[0];

describe('Services API Endpoints', () => {
	describe('GET /services', () => {
		it('should return services object', async () => {
			const response = await request(app).get('/services');
			const responseBody: ServiceResponse<Service[]> = response.body;

			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Services found');
			expect(Array.isArray(responseBody.responseObject)).toBeTruthy();
			for (const s of responseBody.responseObject) {
				validateServiceStructure(s);
			}
		});
	});

	describe('POST /services', () => {
		it('should create new services', async () => {
			const newService: Omit<
				Service,
				'id' | 'enabled' | 'createdAt' | 'updatedAt'
			> = {
				title: 'New Service',
				price: 150,
				duration: '45 minutes',
				description: 'This is a new service',
			};

			const response = await request(app)
				.post('/services')
				.send([newService]);
			const responseBody: ServiceResponse<Service[]> = response.body;

			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Services created successfully'
			);
			expect(responseBody.responseObject[0]).toMatchObject(newService);
		});

		it('should return 400 for missing required fields', async () => {
			const invalidService = { price: 150 };

			const response = await request(app)
				.post('/services')
				.send([invalidService]);
			const responseBody: ServiceResponse = response.body;

			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Missing required fields');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('PUT /services', () => {
		it('should update existing services', async () => {
			const updatedServiceData: Partial<Service> = {
				id: service.id,
				title: 'Updated Service Title',
			};

			const response = await request(app)
				.put('/services')
				.send([updatedServiceData]);
			const responseBody: ServiceResponse<Service[]> = response.body;

			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Services updated successfully'
			);
			expect(responseBody.responseObject[0].title).toEqual(
				updatedServiceData.title
			);
		});

		it('should return 400 for missing service ID', async () => {
			const invalidData = [{ title: 'No ID' }];

			const response = await request(app)
				.put('/services')
				.send(invalidData);
			const responseBody: ServiceResponse = response.body;

			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Missing service ID');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('DELETE /services/:id', () => {
		it('should delete an existing service', async () => {
			const response = await request(app).delete(
				`/services/${service.id}`
			);
			const responseBody: ServiceResponse = response.body;

			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Service deleted successfully'
			);
		});

		it('should return 400 for invalid id', async () => {
			const response = await request(app).delete('/services/invalid-id');
			const responseBody: ServiceResponse = response.body;

			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});
	});
});

function validateServiceStructure(responseService: Service) {
	if (!responseService) {
		throw new Error('Invalid test data: responseService is undefined');
	}

	expect(responseService.id).toBeTypeOf('number');
	expect(responseService.title).toBeTypeOf('string');
	expect(responseService.price).toBeTypeOf('number');
	expect(responseService.duration).toBeTypeOf('string');
	expect(responseService.enabled).toBeTypeOf('boolean');
}
