import type { Request, RequestHandler, Response } from 'express';

import { leaveService } from '@/api/leave/leaveService';

class LeaveController {
	public getLeave: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await leaveService.findForFrontend();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getAllLeaves: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await leaveService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createLeave: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await leaveService.create(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateLeave: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const id = Number(req.params.id);
		const serviceResponse = await leaveService.update(id, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteLeave: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const id = Number(req.params.id);
		const serviceResponse = await leaveService.delete(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const leaveController = new LeaveController();
