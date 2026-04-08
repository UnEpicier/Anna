import type { Request, RequestHandler, Response } from 'express';
import { announcementService } from '@/api/announcement/announcementService';

class AnnouncementController {
	public getAnnouncement: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await announcementService.find();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateAnnouncement: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await announcementService.update(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const announcementController = new AnnouncementController();
