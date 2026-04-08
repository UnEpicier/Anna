import { z } from 'zod';

export type PopupMessage = z.infer<typeof PopupMessageSchema>;
export const PopupMessageSchema = z.object({
	id: z.number(),
	enabled: z.boolean(),
	title: z.string().nullable(),
	message: z.string(),
	ctaLabel: z.string().nullable(),
	ctaUrl: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
