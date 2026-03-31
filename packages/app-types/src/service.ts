import { z } from 'zod';

export type Service = z.infer<typeof ServiceSchema>;
export const ServiceSchema = z.object({
	id: z.number(),
	title: z.string(),
	emoji: z.string(),
	shortDescription: z.string(),
	price: z.number(),
	duration: z.string(),
	description: z.string(),
	enabled: z.boolean().default(true),
	createdAt: z.date(),
	updatedAt: z.date(),
});
