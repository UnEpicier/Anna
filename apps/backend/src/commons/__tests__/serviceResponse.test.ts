import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/commons/models/serviceResponse';

describe('ServiceResponse', () => {
	describe('success', () => {
		it('creates a success response with default 200 status code', () => {
			const response = ServiceResponse.success('OK', { id: 1 });

			expect(response.success).toBe(true);
			expect(response.message).toBe('OK');
			expect(response.responseObject).toEqual({ id: 1 });
			expect(response.statusCode).toBe(StatusCodes.OK);
		});

		it('creates a success response with custom status code', () => {
			const response = ServiceResponse.success(
				'Created',
				{ id: 1 },
				StatusCodes.CREATED
			);

			expect(response.success).toBe(true);
			expect(response.statusCode).toBe(StatusCodes.CREATED);
		});

		it('accepts null as responseObject', () => {
			const response = ServiceResponse.success('Deleted', null);

			expect(response.success).toBe(true);
			expect(response.responseObject).toBeNull();
		});
	});

	describe('failure', () => {
		it('creates a failure response with default 400 status code', () => {
			const response = ServiceResponse.failure('Bad Request', null);

			expect(response.success).toBe(false);
			expect(response.message).toBe('Bad Request');
			expect(response.responseObject).toBeNull();
			expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
		});

		it('creates a failure response with custom status code', () => {
			const response = ServiceResponse.failure(
				'Not Found',
				null,
				StatusCodes.NOT_FOUND
			);

			expect(response.success).toBe(false);
			expect(response.statusCode).toBe(StatusCodes.NOT_FOUND);
		});

		it('creates a failure response with 500 status code', () => {
			const response = ServiceResponse.failure(
				'Internal Error',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);

			expect(response.success).toBe(false);
			expect(response.statusCode).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
		});
	});
});
