import { Router } from 'express';
import { authController } from '@/api/auth/authController';

export const authRouter: Router = Router();

authRouter.post('/login', authController.login);

authRouter.post('/verify-code', authController.verifyCode);
