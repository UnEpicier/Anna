import { z } from "zod";

export type Leave = z.infer<typeof LeaveModel>;
export const LeaveModel = z.object({
	id: z.number(),
	from: z.date(),
	to: z.date(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
