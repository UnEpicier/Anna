import express, { type Request, type Response, type Router } from "express";

import { ServiceResponse } from "@/commons/models/serviceResponse";

export const healthCheckRouter: Router = express.Router();

healthCheckRouter.get("/", (_req: Request, res: Response) => {
	const serviceResponse = ServiceResponse.success("Service is healthy", null);
	res.status(serviceResponse.statusCode).send(serviceResponse);
});
