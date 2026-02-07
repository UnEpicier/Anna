import { z } from "zod";

export type Leave = z.infer<typeof LeaveSchema>;
export const LeaveSchema = z.object({
	id: z.number(),
	from: z.date(),
	to: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
