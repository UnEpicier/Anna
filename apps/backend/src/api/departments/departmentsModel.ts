import { z } from "zod";

export const GeoJsonSchema = z.object({
	type: z.literal("Feature"),
	geometry: z.object({
		type: z.string(),
		coordinates: z.any(),
	}),
	properties: z.record(z.string(), z.any()),
});

export type Department = z.infer<typeof DepartmentSchema>;
export const DepartmentSchema = z.object({
	code: z.string(),
	name: z.string(),
	geojson: GeoJsonSchema,
	active: z.boolean().default(false),
	createdAt: z.date(),
	updatedAt: z.date(),
});
