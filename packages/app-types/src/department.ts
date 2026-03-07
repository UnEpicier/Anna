import { z } from 'zod';
import { GeoJsonSchema } from './geojson.js';

export type Department = z.infer<typeof DepartmentSchema>;
export const DepartmentSchema = z.object({
	code: z.string(),
	name: z.string(),
	geojson: GeoJsonSchema,
	active: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});
