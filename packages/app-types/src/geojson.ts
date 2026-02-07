import { z } from "zod";

export type GeoJson = z.infer<typeof GeoJsonSchema>;
export const GeoJsonSchema = z.object({
	type: z.literal("Feature"),
	geometry: z.object({
		type: z.string(),
		coordinates: z.any(),
	}),
	properties: z.record(z.string(), z.any()),
});