import prisma from "@/libs/prisma";
import {
	type BlogCategory,
	BlogCategoryBaseSchema,
	type BlogPost,
	BlogPostBaseSchema,
	BlogPostContentSchema,
} from "@repo/app-types";

export const categories: BlogCategory[] = [
	{
		id: 1,
		name: "Technology",
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 2,
		name: "Health",
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 3,
		name: "Travel",
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
];

export const posts: BlogPost[] = [
	{
		id: 1,
		title: "The Future of AI Technology",
		uri: "future-of-ai-technology",
		content: [
			{
				type: "heading",
				level: 2,
				text: "The Future of AI Technology",
			},
			{
				type: "paragraph",
				text: "Artificial Intelligence (AI) is rapidly evolving and transforming various industries. From healthcare to finance, AI is making significant strides in improving efficiency and decision-making processes.",
			},
			{
				type: "heading",
				level: 3,
				text: "Advancements in AI",
			},
			{
				type: "paragraph",
				text: "Recent advancements in AI include natural language processing, computer vision, and machine learning algorithms. These technologies are enabling machines to understand and interpret human language, recognize images, and learn from data more effectively.",
			},
		],
		categories: [categories[0]],
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
		excerpt: "Exploring the advancements and future prospects of AI technology.",
		illustrationUrl: "https://example.com/ai-future.jpg",
		visible: true,
	},
	{
		id: 2,
		title: "Top 10 Travel Destinations for 2024",
		uri: "top-10-travel-destinations-2024",
		content: [
			{
				type: "heading",
				level: 2,
				text: "Top 10 Travel Destinations for 2024",
			},
			{
				type: "paragraph",
				text: "As travel restrictions ease, many are eager to explore new destinations. Here are the top 10 travel spots to consider for your 2024 adventures.",
			},
		],
		categories: [categories[1], categories[2]],
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
		excerpt: "Discover the must-visit travel destinations for the year 2024.",
		illustrationUrl: "https://example.com/travel-2024.jpg",
		visible: true,
	},
];

export class BlogRepository {
	//! FIND METHODS

	async findAllCategoriesAsync(includePosts: boolean): Promise<BlogCategory[]> {
		const categories = await prisma.blogCategories.findMany({
			include: {
				posts: includePosts,
			},
		});

		return categories.map((category) => ({
			...category,
			posts: includePosts ? category.posts.map((post) => BlogPostBaseSchema.parse(post)) : undefined,
		}));
	}

	async findCategoryAsync(id: number, includePosts: boolean): Promise<BlogCategory | null> {
		const category = await prisma.blogCategories.findFirst({
			where: {
				id,
			},
			include: {
				posts: includePosts,
			},
		});

		if (!category) {
			return null;
		}

		return {
			...category,
			posts: includePosts ? category.posts.map((post) => BlogPostBaseSchema.parse(post)) : undefined,
		};
	}

	async findAllPostsAsync(includeCategories: boolean): Promise<BlogPost[]> {
		const posts = await prisma.blogPosts.findMany({
			include: {
				categories: includeCategories,
			},
		});

		return posts.map((post) => {
			let parsedCategories: BlogCategory[] | undefined;
			if (includeCategories) {
				parsedCategories = post.categories.map((category) => BlogCategoryBaseSchema.parse(category));
			}

			return {
				...post,
				content: BlogPostContentSchema.parse(post.content),
				categories: parsedCategories,
			};
		});
	}

	async findPostAsync(uri: string, includeCategories: boolean): Promise<BlogPost | null> {
		const post = await prisma.blogPosts.findFirst({
			where: {
				uri,
			},
			include: {
				categories: includeCategories,
			},
		});

		if (!post) {
			return null;
		}

		let parsedCategories: BlogCategory[] | undefined;
		if (includeCategories) {
			parsedCategories = post.categories.map((category) => BlogCategoryBaseSchema.parse(category));
		}

		return {
			...post,
			content: BlogPostContentSchema.parse(post.content),
			categories: parsedCategories,
		};
	}

	//! CREATE METHODS

	async createCategoryAsync(name: string): Promise<BlogCategory> {
		return prisma.blogCategories.create({
			data: {
				name: name,
			},
		});
	}

	async createPostAsync({
		categories,
		...restData
	}: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
		const categoryConnectOrCreate = categories?.map((category: BlogCategory) => ({
			where: { id: category.id },
			create: { name: category.name },
		}));

		const post = await prisma.blogPosts.create({
			data: {
				...restData,
				categories: {
					connectOrCreate: categoryConnectOrCreate,
				},
			},
			include: {
				categories: true,
			},
		});

		return {
			...post,
			content: BlogPostContentSchema.parse(post.content),
		};
	}

	//! UPDATE METHODS

	async updateCategoryAsync(id: number, name: string): Promise<BlogCategory> {
		return prisma.blogCategories.update({
			where: {
				id,
			},
			data: {
				name,
			},
		});
	}

	async updatePostAsync(
		id: number,
		{ categories, ...restData }: Omit<BlogPost, "id" | "createdAt" | "updatedAt">,
	): Promise<BlogPost> {
		const categoryConnectOrCreate = categories?.map((category: BlogCategory) => ({
			where: { id: category.id },
			create: { name: category.name },
		}));

		const post = await prisma.blogPosts.update({
			where: {
				id,
			},
			data: {
				...restData,
				categories: {
					connectOrCreate: categoryConnectOrCreate,
				},
			},
			include: {
				categories: true,
			},
		});

		return {
			...post,
			content: BlogPostContentSchema.parse(post.content),
		};
	}

	//! DELETE METHODS

	async deleteCategoryAsync(id: number) {
		return prisma.blogCategories.delete({
			where: {
				id,
			},
		});
	}

	async deletePostAsync(id: number) {
		return prisma.blogPosts.delete({
			where: {
				id,
			},
		});
	}
}
