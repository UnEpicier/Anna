import  {z} from 'zod';

export type Response = z.infer<typeof ResponseSchema>;
export const ResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		success: z.boolean(),
		message: z.string(),
		responseObject: dataSchema.optional(),
		statusCode: z.number(),
	});