import { informationsService } from '@/api/informations/informationsService';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import { env } from '@/commons/utils/envConfig';
import redisClient from '@/libs/redis';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import nodeMailjet from 'node-mailjet';
import jwt from 'jsonwebtoken';
import { createHash, randomUUID } from 'node:crypto';

export class AuthService {
	private saltRounds = 10;
	private salt = bcrypt.genSaltSync(this.saltRounds);
	private mailjet = nodeMailjet.apiConnect(
		env.MAILJET_PUBLIC_KEY,
		env.MAILJET_PRIVATE_KEY
	);

	private getClientId(userAgent: string | undefined): string {
		return createHash('sha256')
			.update(userAgent ?? 'unknown')
			.digest('hex')
			.slice(0, 32);
	}

	private async sendAuthEmail(email: string, code: string): Promise<void> {
		await this.mailjet.post('send', { version: 'v3.1' }).request({
			Messages: [
				{
					From: {
						Email: 'no-reply@anna-nischwitz.fr',
						Name: 'Anna Nischwitz',
					},
					To: [{ Email: email, Name: email }],
					TemplateID: 7858119,
					TemplateLanguage: true,
					Subject: 'Demande de connexion',
					Variables: { code },
				},
			],
		});
	}

	async login(
		email?: string,
		userAgent?: string
	): Promise<ServiceResponse<string | null>> {
		if (!email || !email.trim()) {
			return ServiceResponse.failure(
				'Email not provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		const clientId = this.getClientId(userAgent);
		const sessionToken = randomUUID();

		try {
			const validEmail = await informationsService.find();

			if (!validEmail.success) {
				return ServiceResponse.failure(
					'Email not found',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			if (validEmail.responseObject?.email !== email) {
				return ServiceResponse.failure(
					'Invalid credentials',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const authCode = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			const hashedCode = await bcrypt.hash(authCode, this.salt);

			// authCode and authEmail are keyed by clientId — overwriting any previous
			// pending session for this client without needing a separate lookup key
			await Promise.all([
				redisClient.setEx(`authCode:${clientId}`, 10 * 60, hashedCode),
				redisClient.setEx(`authEmail:${clientId}`, 10 * 60, email),
				redisClient.setEx(
					`sessionClient:${sessionToken}`,
					10 * 60,
					clientId
				),
				redisClient.del(`authResendCooldown:${clientId}`),
			]);

			await this.sendAuthEmail(email, authCode);

			return ServiceResponse.success<string>(
				'Login initiated',
				sessionToken,
				StatusCodes.OK
			);
		} catch (error) {
			console.error(`Error during login: ${(error as Error).message}`);
			await Promise.all([
				redisClient.del(`authCode:${clientId}`),
				redisClient.del(`authEmail:${clientId}`),
				redisClient.del(`sessionClient:${sessionToken}`),
			]);
			return ServiceResponse.failure(
				'An error occurred during login.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async verifyCode(
		sessionToken: string,
		code: string
	): Promise<ServiceResponse<string | null>> {
		try {
			const clientId = await redisClient.get(
				`sessionClient:${sessionToken}`
			);

			if (!clientId) {
				return ServiceResponse.failure(
					'Authentication code expired or not found',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const storedCode = await redisClient.get(`authCode:${clientId}`);

			if (!storedCode) {
				return ServiceResponse.failure(
					'Authentication code expired or not found',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			if (!(await bcrypt.compare(code, storedCode))) {
				return ServiceResponse.failure(
					'Invalid authentication code',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			await Promise.all([
				redisClient.del(`authCode:${clientId}`),
				redisClient.del(`authEmail:${clientId}`),
				redisClient.del(`authResendCooldown:${clientId}`),
				redisClient.del(`sessionClient:${sessionToken}`),
			]);

			const jti = randomUUID();
			const token = jwt.sign({ jti }, env.JWT_SECRET, {
				expiresIn: '4h',
			});
			await redisClient.setEx(`authSession:${jti}`, 4 * 60 * 60, '1');

			return ServiceResponse.success<string>(
				'Authentication successful',
				token,
				StatusCodes.OK
			);
		} catch (error) {
			console.error(
				`Error during code verification: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred during code verification.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async resendCode(sessionToken: string): Promise<ServiceResponse<null>> {
		try {
			const clientId = await redisClient.get(
				`sessionClient:${sessionToken}`
			);

			if (!clientId) {
				return ServiceResponse.failure(
					'Session expired or not found',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const [cooldown, email] = await Promise.all([
				redisClient.get(`authResendCooldown:${clientId}`),
				redisClient.get(`authEmail:${clientId}`),
			]);

			if (cooldown) {
				return ServiceResponse.failure(
					'Please wait before requesting a new code',
					null,
					StatusCodes.TOO_MANY_REQUESTS
				);
			}

			if (!email) {
				return ServiceResponse.failure(
					'Session expired or not found',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}

			const authCode = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			const hashedCode = await bcrypt.hash(authCode, this.salt);
			await Promise.all([
				redisClient.setEx(`authCode:${clientId}`, 10 * 60, hashedCode),
				redisClient.setEx(`authResendCooldown:${clientId}`, 60, '1'),
			]);

			await this.sendAuthEmail(email, authCode);

			return ServiceResponse.success(
				'Code resent successfully',
				null,
				StatusCodes.OK
			);
		} catch (error) {
			console.error(
				`Error during code resend: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while resending the code.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	checkToken(token: string): ServiceResponse<null> {
		try {
			const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
			if (!payload.jti) {
				return ServiceResponse.failure(
					'Invalid token',
					null,
					StatusCodes.UNAUTHORIZED
				);
			}
			return ServiceResponse.success('Token valid', null, StatusCodes.OK);
		} catch {
			return ServiceResponse.failure(
				'Invalid or expired token',
				null,
				StatusCodes.UNAUTHORIZED
			);
		}
	}

	async checkTokenRevoked(token: string): Promise<ServiceResponse<null>> {
		const localCheck = this.checkToken(token);
		if (!localCheck.success) return localCheck;

		const { jti } = jwt.decode(token) as jwt.JwtPayload;
		const session = await redisClient.get(`authSession:${jti}`);
		if (!session) {
			return ServiceResponse.failure(
				'Token has been revoked',
				null,
				StatusCodes.UNAUTHORIZED
			);
		}
		return ServiceResponse.success('Token valid', null, StatusCodes.OK);
	}

	async logout(token: string): Promise<ServiceResponse<null>> {
		try {
			const localCheck = this.checkToken(token);
			if (localCheck.success) {
				const { jti } = jwt.decode(token) as jwt.JwtPayload;
				await redisClient.del(`authSession:${jti}`);
			}
			return ServiceResponse.success('Logged out', null, StatusCodes.OK);
		} catch (error) {
			console.error(`Error during logout: ${(error as Error).message}`);
			return ServiceResponse.failure(
				'An error occurred during logout.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async cancelLogin(sessionToken: string): Promise<ServiceResponse<null>> {
		try {
			const clientId = await redisClient.get(
				`sessionClient:${sessionToken}`
			);
			if (clientId) {
				await Promise.all([
					redisClient.del(`authCode:${clientId}`),
					redisClient.del(`authEmail:${clientId}`),
					redisClient.del(`authResendCooldown:${clientId}`),
				]);
			}
			await redisClient.del(`sessionClient:${sessionToken}`);
			return ServiceResponse.success(
				'Login cancelled',
				null,
				StatusCodes.OK
			);
		} catch (error) {
			console.error(
				`Error during login cancellation: ${(error as Error).message}`
			);
			return ServiceResponse.failure(
				'An error occurred while cancelling login.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const authService = new AuthService();
