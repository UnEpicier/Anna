import { authController } from '@/api/auth/authController';
import { Router } from 'express';

export const authRouter: Router = Router();

// Body: mail address => generate temp code and send mail
authRouter.post('/login', authController.login);

// Body: received temp code => generate jwt, send cookie via header
authRouter.post('/verify-code', authController.verifyCode);

// Cookie: sessionToken => resend auth code (60s cooldown)
authRouter.post('/resend-code', authController.resendCode);

// Cookie: sessionToken => cancel pending login, clear Redis keys + cookie
authRouter.post('/cancel-login', authController.cancelLogin);

// Body: check if jwt is valid, get jwt cookie via header
authRouter.post('/check', authController.checkToken);

// Remove jwt from known jwt, remove cookie via header
authRouter.post('/logout', authController.logout);
