import { authService } from '@/api/auth/authService';
import { env } from '@/commons/utils/envConfig';
import type { NextFunction, Request, RequestHandler, Response } from 'express';

export const requireAuth: RequestHandler = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token: string | undefined = req.cookies?.token;

	if (!token) {
		res.status(401).json({
			success: false,
			message: 'Unauthorized',
			responseObject: null,
			statusCode: 401,
		});
		return;
	}

	const serviceResponse = await authService.checkTokenRevoked(token);

	if (!serviceResponse.success) {
		res.clearCookie('token', {
			httpOnly: true,
			secure: env.isProduction,
			sameSite: 'strict',
		});
		res.status(401).json({
			success: false,
			message: 'Unauthorized',
			responseObject: null,
			statusCode: 401,
		});
		return;
	}

	next();
};
