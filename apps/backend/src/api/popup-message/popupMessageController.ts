import type { Request, RequestHandler, Response } from 'express';
import { popupMessageService } from '@/api/popup-message/popupMessageService';

class PopupMessageController {
	public getPopupMessage: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await popupMessageService.find();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updatePopupMessage: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await popupMessageService.update(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const popupMessageController = new PopupMessageController();
