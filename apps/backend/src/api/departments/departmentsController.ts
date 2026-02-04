import type { Request, RequestHandler, Response } from "express";

import { departmentsService } from "@/api/departments/departmentsService";

class DepartmentsController {
	public getDepartments: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await departmentsService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getActiveDepartments: RequestHandler = async (_req: Request, res: Response) => {
		const serviceResponse = await departmentsService.findActives();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateDepartment: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await departmentsService.update(req.params.id, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const departmentsController = new DepartmentsController();
