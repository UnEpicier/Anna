import { StatusCodes } from 'http-status-codes';
import request from 'supertest';

import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

describe('Health Check API endpoints', () => {
	it('GET /health-check - success', async () => {
		// Act
		const response = await request(app).get('/health-check');
		const result: ServiceResponse = response.body;

		// Assert
		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.success).toBeTruthy();
		expect(result.responseObject).toBeNull();
		expect(result.message).toEqual('Service is healthy');
	});
});
