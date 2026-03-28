import { authService } from '@/api/auth/authService';
import { requireAuth } from '@/commons/middleware/requireAuth';
import cookieParser from 'cookie-parser';
import express, { type Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { vi } from 'vitest';

vi.mock('@/api/auth/authService', () => ({
	authService: {
		checkTokenRevoked: vi.fn(),
	},
}));

describe('requireAuth middleware', () => {
	let app: Express;

	beforeEach(() => {
		app = express();
		app.use(cookieParser());
		app.get('/protected', requireAuth, (_req, res) => {
			res.status(200).json({ ok: true });
		});
	});

	it('returns 401 when no token cookie is present', async () => {
		const response = await request(app).get('/protected');

		expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
		expect(response.body.success).toBe(false);
		expect(response.body.message).toBe('Unauthorized');
	});

	it('returns 401 and clears the cookie when the token is revoked', async () => {
		vi.mocked(authService.checkTokenRevoked).mockResolvedValueOnce({
			success: false,
			message: 'Token has been revoked',
			responseObject: null,
			statusCode: StatusCodes.UNAUTHORIZED,
		});

		const response = await request(app)
			.get('/protected')
			.set('Cookie', 'token=invalid-token');

		expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
		expect(response.body.success).toBe(false);
		expect(response.headers['set-cookie']).toBeDefined();
		expect(response.headers['set-cookie'][0]).toMatch(/token=;/);
	});

	it('calls next and reaches the route handler when the token is valid', async () => {
		vi.mocked(authService.checkTokenRevoked).mockResolvedValueOnce({
			success: true,
			message: 'Token valid',
			responseObject: null,
			statusCode: StatusCodes.OK,
		});

		const response = await request(app)
			.get('/protected')
			.set('Cookie', 'token=valid-token');

		expect(response.status).toBe(StatusCodes.OK);
		expect(response.body.ok).toBe(true);
	});
});
