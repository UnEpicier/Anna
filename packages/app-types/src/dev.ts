import { z } from 'zod';

export type UpServices = z.infer<typeof UpServicesSchema>;
export const UpServicesSchema = z.object({
	redis: z.boolean(),
	postgres: z.boolean(),
});
