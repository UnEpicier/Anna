import type { Request, RequestHandler, Response } from 'express';

import { informationsService } from '@/api/informations/informationsService';

class InformationsController {
	public getInformations: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await informationsService.find();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateInformations: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await informationsService.update(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const informationsController = new InformationsController();
