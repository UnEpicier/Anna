import { z } from "zod";

// Schemas de base sans relations
export const BlogCategoryBaseSchema = z.object({
	id: z.number(),
	name: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const BlogPostParagraphContentSchema = z.object({
	type: z.literal("paragraph"),
	text: z.string().min(10, "Paragraph must be at least 10 characters long"),
});

export const BlogPostTitleContentSchema = z.object({
	type: z.literal("heading"),
	level: z.number().min(2).max(6),
	text: z
		.string()
		.min(5, "Title must be at least 5 characters long")
		.max(100, "Title must be at most 100 characters long"),
});

export const BlogPostContentSchema = z.array(z.union([BlogPostParagraphContentSchema, BlogPostTitleContentSchema]));

export const BlogPostBaseSchema = z.object({
	id: z.number(),
	title: z.string(),
	uri: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URI must be URL-friendly"),
	illustrationUrl: z.url(),
	excerpt: z.string(),
	content: BlogPostContentSchema,
	visible: z.boolean().default(true),
	createdAt: z.date(),
	updatedAt: z.date(),
});

// Schemas avec relations selon le contexte
export const BlogPostSchema = BlogPostBaseSchema.extend({
	categories: z.array(BlogCategoryBaseSchema).optional(),
});

export const BlogCategorySchema = BlogCategoryBaseSchema.extend({
	posts: z.array(BlogPostBaseSchema).optional(),
});

// Types TypeScript
export type BlogCategory = z.infer<typeof BlogCategorySchema>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
