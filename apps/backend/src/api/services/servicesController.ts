import type { Request, RequestHandler, Response } from 'express';

import { servicesService } from '@/api/services/servicesService';

class ServicesController {
	public getServices: RequestHandler = async (
		_req: Request,
		res: Response
	) => {
		const serviceResponse = await servicesService.findAll();
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getServiceById: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await servicesService.find(
			<string>req.params.id
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createService: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await servicesService.createMany(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateService: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await servicesService.updateMany(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteService: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await servicesService.delete(
			<string>req.params.id
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const servicesController = new ServicesController();
