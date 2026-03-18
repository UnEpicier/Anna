import { z } from 'zod';

export type Informations = z.infer<typeof InformationSchema>;
export const InformationSchema = z.object({
	id: z.number(),
	email: z.email(),
	phone: z.string(),
	address: z.string().nullable(),
	actionAddress: z.string(),
	actionLong: z.number(),
	actionLat: z.number(),
	actionRadius: z.number(),
	facebook: z.string().nullable(),
	instagram: z.string().nullable(),
	notifyLeave: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
