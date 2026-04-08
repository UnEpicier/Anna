import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { announcementController } from './announcementController';

export const announcementRouter: Router = Router();

announcementRouter.get('/', announcementController.getAnnouncement);
announcementRouter.put(
	'/',
	requireAuth,
	announcementController.updateAnnouncement
);
