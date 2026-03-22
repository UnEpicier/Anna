import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';
import { StatusCodes } from 'http-status-codes';
import type { Response } from 'supertest';
import request from 'supertest';
import { informations } from '../../../../prisma/data/informations';

/**
 * The mock intercepts node-mailjet and captures the 6-digit OTP so tests can
 * use it in /auth/verify-code without actually sending any email.
 * vi.hoisted() makes the object accessible inside the vi.mock() factory (which
 * is hoisted to the top of the file by Vitest before any import runs).
 */
const emailCapture = vi.hoisted(() => ({ code: '' }));

vi.mock('node-mailjet', () => {
	const mock = {
		apiConnect: () => ({
			post: () => ({
				request: async (payload: {
					Messages: Array<{ Variables: { code: string } }>;
				}) => {
					emailCapture.code = payload.Messages[0].Variables.code;
					return { response: { status: 200 }, body: {} };
				},
			}),
		}),
	};
	// Spread handles both ESM default import and CJS named access
	return { default: mock, ...mock };
});

const VALID_EMAIL = informations.email;

// Each describe uses a distinct User-Agent so Redis keys (keyed by clientId =
// sha256(userAgent)) never collide between test groups.
const UA = {
	login: 'vitest-ua-login',
	verify: 'vitest-ua-verify',
	resend: 'vitest-ua-resend',
	cancel: 'vitest-ua-cancel',
	token: 'vitest-ua-token',
};

function getSetCookies(res: Response): string[] {
	const raw = res.headers['set-cookie'];
	if (!raw) return [];
	return Array.isArray(raw) ? raw : [raw];
}

function extractCookie(res: Response, name: string): string {
	const found = getSetCookies(res).find((c) => c.startsWith(`${name}=`));
	return found ?? '';
}

/** Returns just the "name=value" part, stripped of attributes */
function cookieHeader(raw: string): string {
	return raw.split(';')[0];
}

// ---------------------------------------------------------------------------

describe('Auth API Endpoints', () => {
	// -------------------------------------------------------------------------
	describe('POST /auth/login', () => {
		it('returns 400 when email is not provided', async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.login)
				.send({});

			const body: ServiceResponse = res.body;
			expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(body.success).toBeFalsy();
		});

		it('returns 400 when email is an empty string', async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.login)
				.send({ email: '   ' });

			expect(res.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(res.body.success).toBeFalsy();
		});

		it('returns 401 for an unregistered email', async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.login)
				.send({ email: 'unknown@example.com' });

			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
			expect(res.body.success).toBeFalsy();
		});

		it('sends OTP and sets sessionToken cookie for the registered email', async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.login)
				.send({ email: VALID_EMAIL });

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();
			// OTP intercepted from Mailjet mock
			expect(emailCapture.code).toMatch(/^\d{6}$/);

			const sessionCookie = extractCookie(res, 'sessionToken');
			expect(sessionCookie).toBeTruthy();
			expect(sessionCookie).toContain('HttpOnly');
			expect(sessionCookie).toContain('SameSite=Strict');
		});
	});

	// -------------------------------------------------------------------------
	describe('POST /auth/verify-code', () => {
		let sessionCookie: string;

		beforeAll(async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.verify)
				.send({ email: VALID_EMAIL });
			sessionCookie = cookieHeader(extractCookie(res, 'sessionToken'));
		});

		it('returns 401 when sessionToken cookie is absent', async () => {
			const res = await request(app)
				.post('/auth/verify-code')
				.send({ code: '123456' });

			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
			expect(res.body.success).toBeFalsy();
		});

		it('returns 401 for an incorrect code', async () => {
			const res = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: '000000' });

			// Wrong code: session must still be alive (not consumed)
			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
			expect(res.body.success).toBeFalsy();
		});

		it('returns 200, sets HttpOnly auth cookie for the correct OTP', async () => {
			const res = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: emailCapture.code });

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();

			const tokenCookie = extractCookie(res, 'token');
			expect(tokenCookie).toBeTruthy();
			expect(tokenCookie).toContain('HttpOnly');
			expect(tokenCookie).toContain('SameSite=Strict');
		});

		it('returns 401 when the same session is reused after verification', async () => {
			// Session must have been consumed by the previous test
			const res = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: emailCapture.code });

			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		});
	});

	// -------------------------------------------------------------------------
	describe('POST /auth/resend-code', () => {
		let sessionCookie: string;

		beforeAll(async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.resend)
				.send({ email: VALID_EMAIL });
			sessionCookie = cookieHeader(extractCookie(res, 'sessionToken'));
		});

		it('returns 401 when sessionToken cookie is absent', async () => {
			const res = await request(app).post('/auth/resend-code');
			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		});

		it('resends the code and returns 200', async () => {
			const previousCode = emailCapture.code;

			const res = await request(app)
				.post('/auth/resend-code')
				.set('Cookie', sessionCookie);

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();
			// A fresh OTP must have been generated (collision probability: 1/900 000)
			expect(emailCapture.code).toMatch(/^\d{6}$/);
			expect(emailCapture.code).not.toEqual(previousCode);
		});

		it('returns 429 when resend is called again within the 60-second cooldown', async () => {
			const res = await request(app)
				.post('/auth/resend-code')
				.set('Cookie', sessionCookie);

			expect(res.statusCode).toEqual(StatusCodes.TOO_MANY_REQUESTS);
			expect(res.body.success).toBeFalsy();
		});

		it('the resent code is accepted by verify-code', async () => {
			const res = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: emailCapture.code });

			expect(res.statusCode).toEqual(StatusCodes.OK);
		});
	});

	// -------------------------------------------------------------------------
	describe('POST /auth/cancel-login', () => {
		let sessionCookie: string;

		beforeAll(async () => {
			const res = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.cancel)
				.send({ email: VALID_EMAIL });
			sessionCookie = cookieHeader(extractCookie(res, 'sessionToken'));
		});

		it('cancels the pending session and returns 200', async () => {
			const res = await request(app)
				.post('/auth/cancel-login')
				.set('Cookie', sessionCookie);

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();
		});

		it('verify-code returns 401 after session has been cancelled', async () => {
			const res = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: emailCapture.code });

			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		});
	});

	// -------------------------------------------------------------------------
	describe('POST /auth/check and POST /auth/logout', () => {
		let authCookie: string;

		beforeAll(async () => {
			// Complete login flow: login → capture OTP → verify → get auth token
			const loginRes = await request(app)
				.post('/auth/login')
				.set('User-Agent', UA.token)
				.send({ email: VALID_EMAIL });
			const sessionCookie = cookieHeader(
				extractCookie(loginRes, 'sessionToken')
			);

			const verifyRes = await request(app)
				.post('/auth/verify-code')
				.set('Cookie', sessionCookie)
				.send({ code: emailCapture.code });
			authCookie = cookieHeader(extractCookie(verifyRes, 'token'));
		});

		it('POST /auth/check returns 401 without token', async () => {
			const res = await request(app).post('/auth/check');
			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		});

		it('POST /auth/check returns 200 for a valid, non-revoked token', async () => {
			const res = await request(app)
				.post('/auth/check')
				.set('Cookie', authCookie);

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();
		});

		it('POST /auth/logout revokes the session and returns 200', async () => {
			const res = await request(app)
				.post('/auth/logout')
				.set('Cookie', authCookie);

			expect(res.statusCode).toEqual(StatusCodes.OK);
			expect(res.body.success).toBeTruthy();
		});

		it('POST /auth/check returns 401 after logout (token revoked)', async () => {
			const res = await request(app)
				.post('/auth/check')
				.set('Cookie', authCookie);

			expect(res.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
		});
	});
});
