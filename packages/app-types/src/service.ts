import { z } from 'zod';

function isSingleEmoji(str: string): boolean {
	const segmenter = new Intl.Segmenter();
	const segments = [...segmenter.segment(str)];
	return segments.length === 1 && /\p{Extended_Pictographic}/u.test(str);
}

export type Service = z.infer<typeof ServiceSchema>;
export const ServiceSchema = z.object({
	id: z.number(),
	title: z.string(),
	emoji: z
		.string()
		.refine(isSingleEmoji, { message: 'Must be a single emoji' }),
	shortDescription: z.string(),
	price: z.number(),
	duration: z.string(),
	description: z.string(),
	enabled: z.boolean().default(true),
	createdAt: z.date(),
	updatedAt: z.date(),
});
