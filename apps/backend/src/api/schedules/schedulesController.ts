import type { Request, RequestHandler, Response } from 'express';

import { schedulesService } from '@/api/schedules/schedulesService';

class SchedulesController {
	public getSchedules: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await schedulesService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateSchedule: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await schedulesService.update(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const schedulesController = new SchedulesController();
