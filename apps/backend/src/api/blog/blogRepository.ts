import prisma from '@/libs/prisma';
import {
	type BlogCategory,
	BlogCategoryBaseSchema,
	type BlogPost,
	BlogPostBaseSchema,
	BlogPostContentSchema,
} from '@repo/app-types';

export class BlogRepository {
	//! FIND METHODS

	async findAllCategoriesAsync(
		includePosts: boolean
	): Promise<BlogCategory[]> {
		const categories = await prisma.blogCategories.findMany({
			include: {
				posts: includePosts,
			},
		});

		return categories.map((category) => ({
			...category,
			posts: includePosts
				? category.posts.map((post) => BlogPostBaseSchema.parse(post))
				: undefined,
		}));
	}

	async findCategoryAsync(
		id: number,
		includePosts: boolean
	): Promise<BlogCategory | null> {
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
			posts: includePosts
				? category.posts.map((post) => BlogPostBaseSchema.parse(post))
				: undefined,
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
				parsedCategories = post.categories.map((category) =>
					BlogCategoryBaseSchema.parse(category)
				);
			}

			return {
				...post,
				content: BlogPostContentSchema.parse(post.content),
				categories: parsedCategories,
			};
		});
	}

	async findPostAsync(
		uri: string,
		includeCategories: boolean
	): Promise<BlogPost | null> {
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
			parsedCategories = post.categories.map((category) =>
				BlogCategoryBaseSchema.parse(category)
			);
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
	}: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> {
		const categoryConnectOrCreate = categories?.map(
			(category: BlogCategory) => ({
				where: { id: category.id },
				create: { name: category.name },
			})
		);

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
		{
			categories,
			...restData
		}: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<BlogPost> {
		const categoryConnectOrCreate = categories?.map(
			(category: BlogCategory) => ({
				where: { id: category.id },
				create: { name: category.name },
			})
		);

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
