import { z } from 'zod';

export const ResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		message: z.string(),
		responseObject: dataSchema.optional(),
		statusCode: z.number(),
	});

export type ResponseObject<T> =
	| {
	success: true;
	message: string;
	responseObject: T;
	statusCode: number;
}
	| {
	success: false;
	message: string;
	responseObject?: never;
	statusCode: number;
};