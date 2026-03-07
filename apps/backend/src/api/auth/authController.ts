import type { Request, RequestHandler, Response } from 'express';
import { authService } from '@/api/auth/authService';

class AuthController {
	public login: RequestHandler = async (req: Request, res: Response) => {
		const email = req.body;

		const serviceResponse = await authService.login(email);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public verifyCode: RequestHandler = async (req: Request, res: Response) => {
		const { sessionToken, code } = req.body;

		const serviceResponse = await authService.verifyCode(
			sessionToken,
			code
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const authController = new AuthController();
