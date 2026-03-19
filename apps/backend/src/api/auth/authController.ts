import { authService } from '@/api/auth/authService';
import type { Request, RequestHandler, Response } from 'express';

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

	public checkToken: RequestHandler = async (
		req: Request,
		res: Response
	) => {};

	public logout: RequestHandler = async (req: Request, res: Response) => {};
}

export const authController = new AuthController();
