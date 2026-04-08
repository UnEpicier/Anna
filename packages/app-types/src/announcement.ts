import { z } from 'zod';

export type Announcement = z.infer<typeof AnnouncementSchema>;
export const AnnouncementSchema = z.object({
	id: z.number(),
	enabled: z.boolean(),
	title: z.string().nullable(),
	message: z.string(),
	ctaLabel: z.string().nullable(),
	ctaUrl: z.string().nullable(),
	ctaOpenInNewTab: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
