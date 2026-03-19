import { informationsService } from '@/api/informations/informationsService';
import { ServiceResponse } from '@/commons/models/serviceResponse';
import redisClient from '@/libs/redis';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import { randomUUID } from 'node:crypto';

export class AuthService {
	private saltRounds = 10;
	private salt = bcrypt.genSaltSync(this.saltRounds);

	async login(email?: string): Promise<ServiceResponse<string | null>> {
		if (!email || !email.trim()) {
			return ServiceResponse.failure(
				'Email not provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

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

			const sessionToken = randomUUID();
			const authCode = Math.floor(
				100000 + Math.random() * 900000
			).toString();

			// TODD: Send authCode to user's email here

			redisClient.setEx(
				`authCode:${sessionToken}`,
				10 * 60,
				await bcrypt.hash(authCode, this.salt)
			);

			return ServiceResponse.success<string>(
				'Login initiated',
				sessionToken,
				StatusCodes.OK
			);
		} catch (error) {
			const errorMessage = `Error during login: ${(error as Error).message}`;
			console.error(errorMessage);
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
			const storedCode = await redisClient.get(
				`authCode:${sessionToken}`
			);

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

			redisClient.del(`authCode:${sessionToken}`);
			redisClient.setEx(
				`loginSession:${sessionToken}`,
				4 * 60 * 60,
				sessionToken
			);

			return ServiceResponse.success<string>(
				'Authentication successful',
				sessionToken,
				StatusCodes.OK
			);
		} catch (error) {
			const errorMessage = `Error during code verification: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred during code verification.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const authService = new AuthService();
