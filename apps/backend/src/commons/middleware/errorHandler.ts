import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ServiceResponse } from '@/commons/models/serviceResponse';
import { env } from '../utils/envConfig';

const unexpectedRequest: RequestHandler = (_req, res) => {
	res.status(StatusCodes.NOT_FOUND).send('Not Found');
};

const addErrorToRequestLog: ErrorRequestHandler = (err, _req, res, _next) => {
	if (env.isDevelopment) console.error(err);
	res.locals.err = err;
	res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(
		ServiceResponse.failure(
			'An unexpected error occurred',
			null,
			StatusCodes.INTERNAL_SERVER_ERROR
		)
	);
};

export default (): [RequestHandler, ErrorRequestHandler] => [
	unexpectedRequest,
	addErrorToRequestLog,
];
