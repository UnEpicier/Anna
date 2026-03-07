import { z } from 'zod';

export type Schedule = z.infer<typeof ScheduleSchema>;
export const ScheduleSchema = z.object({
	day: z.string(),
	startTime: z.date(),
	endTime: z.date(),
	open: z.boolean().default(true),
	createdAt: z.date(),
	updatedAt: z.date(),
});
