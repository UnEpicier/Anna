import request from 'supertest';
import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';

describe('Auth API Endpoints', () => {
	describe('POST /auth/login', () => {
		it('should return 401 for invalid credentials', async () => {
			// Act
			const response = await request(app)
				.post('/auth/login')
				.send({ email: 'invalidmail@example.com' });
			const responseBody: ServiceResponse<null> = response.body;

			// Assert
			expect(response.statusCode).toEqual(401);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid credentials');
		});
	});

	describe('POST /auth/verify-code', () => {
		it('should return 401 for invalid authentication code', async () => {
			// Act
			const response = await request(app)
				.post('/auth/verify-code')
				.send({ sessionToken: 'some-invalid-token', code: '123456' });
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(401);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'Authentication code expired or not found'
			);
		});
	});
});
