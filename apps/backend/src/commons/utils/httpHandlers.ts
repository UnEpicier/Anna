import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ZodError, type ZodSchema } from 'zod';

import { ServiceResponse } from '@/commons/models/serviceResponse';

export const validateRequest =
	(schema: ZodSchema) =>
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.parseAsync({
				body: req.body,
				query: req.query,
				params: req.params,
			});
			next();
		} catch (err) {
			if (!(err instanceof ZodError)) {
				return next(err);
			}

			const errors = err.issues.map((e) => {
				const fieldPath = e.path.length > 0 ? e.path.join('.') : 'root';
				return `${fieldPath}: ${e.message}`;
			});

			const errorMessage =
				errors.length === 1
					? `Invalid input: ${errors[0]}`
					: `Invalid input (${errors.length} errors): ${errors.join('; ')}`;

			const serviceResponse = ServiceResponse.failure(
				errorMessage,
				null,
				StatusCodes.BAD_REQUEST
			);
			res.status(serviceResponse.statusCode).send(serviceResponse);
		}
	};
