import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { popupMessageController } from './popupMessageController';

export const popupMessageRouter: Router = Router();

popupMessageRouter.get('/', popupMessageController.getPopupMessage);
popupMessageRouter.put(
	'/',
	requireAuth,
	popupMessageController.updatePopupMessage
);
