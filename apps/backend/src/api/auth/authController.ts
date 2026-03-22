import { authService } from '@/api/auth/authService';
import { env } from '@/commons/utils/envConfig';
import type { Request, RequestHandler, Response } from 'express';

const SESSION_COOKIE = 'sessionToken';
const AUTH_COOKIE = 'token';

class AuthController {
	public login: RequestHandler = async (req: Request, res: Response) => {
		const email = req.body.email;
		const userAgent = req.headers['user-agent'];

		const serviceResponse = await authService.login(email, userAgent);

		res.status(serviceResponse.statusCode);

		if (serviceResponse.success) {
			res.cookie(SESSION_COOKIE, serviceResponse.responseObject as string, {
				httpOnly: true,
				maxAge: 10 * 60 * 1000,
				secure: env.isProduction,
				sameSite: 'strict',
			});
		}

		res.send({ ...serviceResponse, responseObject: null });
	};

	public verifyCode: RequestHandler = async (req: Request, res: Response) => {
		const sessionToken: string | undefined = req.cookies?.[SESSION_COOKIE];
		const { code } = req.body;

		if (!sessionToken) {
			res.status(401).send({ success: false, message: 'Missing session cookie', responseObject: null, statusCode: 401 });
			return;
		}

		const serviceResponse = await authService.verifyCode(sessionToken, code);

		if (serviceResponse.success) {
			res.clearCookie(SESSION_COOKIE);
			res.cookie(AUTH_COOKIE, serviceResponse.responseObject as string, {
				httpOnly: true,
				maxAge: 4 * 60 * 60 * 1000,
				secure: env.isProduction,
				sameSite: 'strict',
			});
		}

		res.status(serviceResponse.statusCode).send({
			...serviceResponse,
			responseObject: null,
		});
	};

	public resendCode: RequestHandler = async (req: Request, res: Response) => {
		const sessionToken: string | undefined = req.cookies?.[SESSION_COOKIE];

		if (!sessionToken) {
			res.status(401).send({ success: false, message: 'Missing session cookie', responseObject: null, statusCode: 401 });
			return;
		}

		const serviceResponse = await authService.resendCode(sessionToken);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public cancelLogin: RequestHandler = async (req: Request, res: Response) => {
		const sessionToken: string | undefined = req.cookies?.[SESSION_COOKIE];

		if (sessionToken) {
			await authService.cancelLogin(sessionToken);
		}

		res.clearCookie(SESSION_COOKIE);
		res.status(200).send({ success: true, message: 'Login cancelled', responseObject: null, statusCode: 200 });
	};

	public checkToken: RequestHandler = async (req: Request, res: Response) => {
		const token: string | undefined = req.cookies?.[AUTH_COOKIE];

		if (!token) {
			res.status(401).send({ success: false, message: 'Missing auth cookie', responseObject: null, statusCode: 401 });
			return;
		}

		const serviceResponse = await authService.checkTokenRevoked(token);
		res.status(serviceResponse.statusCode).send({ ...serviceResponse, responseObject: null });
	};

	public logout: RequestHandler = async (req: Request, res: Response) => {
		const token: string | undefined = req.cookies?.[AUTH_COOKIE];

		if (token) {
			await authService.logout(token);
		}

		res.clearCookie(AUTH_COOKIE);
		res.status(200).send({ success: true, message: 'Logged out', responseObject: null, statusCode: 200 });
	};
}

export const authController = new AuthController();
