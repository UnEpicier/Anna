import type { Request, RequestHandler, Response } from 'express';

import { leaveService } from '@/api/leave/leaveService';

class LeaveController {
	public getLeave: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await leaveService.find();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createLeave: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await leaveService.create(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateInformations: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await leaveService.update(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteLeave: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await leaveService.delete();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const leaveController = new LeaveController();
