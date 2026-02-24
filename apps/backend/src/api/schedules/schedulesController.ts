import type { Request, RequestHandler, Response } from "express";

import { schedulesService } from "@/api/schedules/schedulesService";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

class SchedulesController {
	public getSchedules: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await schedulesService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateSchedule: RequestHandler = async (req: Request, res: Response) => {
		if (!days.includes((<string>req.params.day).toLowerCase())) {
			return res.status(400).send({
				success: false,
				message: "Invalid day parameter",
				statusCode: 400,
			});
		}

		const serviceResponse = await schedulesService.update(<string>req.params.day, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const schedulesController = new SchedulesController();
