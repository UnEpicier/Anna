import {
	type BlogCategory,
	type BlogPost,
	BlogPostSchema,
} from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import { BlogRepository } from '@/api/blog/blogRepository';
import { ServiceResponse } from '@/commons/models/serviceResponse';

export class BlogService {
	private blogRepository: BlogRepository;

	constructor(repository: BlogRepository = new BlogRepository()) {
		this.blogRepository = repository;
	}

	async findCategories(
		includePosts: boolean = false
	): Promise<ServiceResponse<BlogCategory[]>> {
		try {
			const categories =
				await this.blogRepository.findAllCategoriesAsync(includePosts);
			if (!categories) {
				return ServiceResponse.failure(
					'No blog categories found',
					[],
					StatusCodes.NOT_FOUND
				);
			}

			if (categories.length === 0) {
				return ServiceResponse.success(
					'No blog categories available',
					[],
					StatusCodes.NO_CONTENT
				);
			}

			return ServiceResponse.success<BlogCategory[]>(
				'Blog categories found',
				categories
			);
		} catch (error) {
			const errorMessage = `Error finding blog categories: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving blog categories.',
				[],
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async findCategory(
		id: string,
		includePosts: boolean = false
	): Promise<ServiceResponse<BlogCategory | null>> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const category = await this.blogRepository.findCategoryAsync(
				parsedId,
				includePosts
			);
			if (!category) {
				return ServiceResponse.failure(
					'No blog category found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<BlogCategory>(
				'Blog category found',
				category
			);
		} catch (error) {
			const errorMessage = `Error finding blog category: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving blog category.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async findPosts(
		includeCategories: boolean = false
	): Promise<ServiceResponse<BlogPost[]>> {
		try {
			const posts =
				await this.blogRepository.findAllPostsAsync(includeCategories);
			if (!posts) {
				return ServiceResponse.failure(
					'No blog posts found',
					[],
					StatusCodes.NOT_FOUND
				);
			}

			if (posts.length === 0) {
				return ServiceResponse.success(
					'No blog posts available',
					[],
					StatusCodes.NO_CONTENT
				);
			}

			return ServiceResponse.success<BlogPost[]>(
				'Blog posts found',
				posts
			);
		} catch (error) {
			const errorMessage = `Error finding blog posts: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving blog posts.',
				[],
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async findPost(
		uri: string,
		includeCategories: boolean = false
	): Promise<ServiceResponse<BlogPost | null>> {
		try {
			const post = await this.blogRepository.findPostAsync(
				uri,
				includeCategories
			);
			if (!post) {
				return ServiceResponse.failure(
					'No blog post found',
					null,
					StatusCodes.NOT_FOUND
				);
			}
			return ServiceResponse.success<BlogPost>('Blog post found', post);
		} catch (error) {
			const errorMessage = `Error finding blog post: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while retrieving blog post.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async createCategory(data: {
		name: string;
	}): Promise<ServiceResponse<BlogCategory | null>> {
		if (!data || !data.name || data.name.trim() === '') {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const existingCategory =
				await this.blogRepository.findAllCategoriesAsync(false);

			if (existingCategory.some((cat) => cat.name === data.name)) {
				return ServiceResponse.failure(
					'Blog category already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

			const newCategory = await this.blogRepository.createCategoryAsync(
				data.name
			);
			return ServiceResponse.success<BlogCategory>(
				'Blog category created successfully',
				newCategory,
				StatusCodes.CREATED
			);
		} catch (error) {
			const errorMessage = `Error creating blog category: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while creating blog category.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async createPost(
		data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ServiceResponse<BlogPost | null>> {
		if (!data) {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		const success = BlogPostSchema.omit({
			id: true,
			createdAt: true,
			updatedAt: true,
		}).safeParse(data);

		if (!success.success) {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const existingPosts =
				await this.blogRepository.findAllPostsAsync(false);

			if (existingPosts.some((post) => post.title === data.title)) {
				return ServiceResponse.failure(
					'Blog post with the same title already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

			const uri = data.uri.replace(/\s+/g, '-').toLowerCase();
			if (existingPosts.some((post) => post.uri === uri)) {
				return ServiceResponse.failure(
					'Blog post with the same uri already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

			const newPost = await this.blogRepository.createPostAsync({
				...data,
				uri,
			});
			return ServiceResponse.success<BlogPost>(
				'Blog post created successfully',
				newPost,
				StatusCodes.CREATED
			);
		} catch (error) {
			const errorMessage = `Error creating blog post: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while creating blog post.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async updateCategory(
		id: string,
		data: Pick<BlogCategory, 'name'>
	): Promise<ServiceResponse<BlogCategory | null>> {
		if (!data || !data.name || data.name.trim() === '') {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const existingCategory =
				await this.blogRepository.findAllCategoriesAsync(false);

			if (!existingCategory.find((cat) => cat.id === parsedId)) {
				return ServiceResponse.failure(
					'No blog category found to update',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			if (existingCategory.some((cat) => cat.name === data.name)) {
				return ServiceResponse.failure(
					'Blog category already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

			const updatedInformations =
				await this.blogRepository.updateCategoryAsync(
					parsedId,
					data.name
				);
			return ServiceResponse.success<BlogCategory>(
				'Blog category updated successfully',
				updatedInformations
			);
		} catch (error) {
			const errorMessage = `Error updating blog category: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating blog category.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async updatePost(
		id: string,
		data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>
	): Promise<ServiceResponse<BlogPost | null>> {
		if (!data) {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		const success = BlogPostSchema.omit({
			id: true,
			createdAt: true,
			updatedAt: true,
		})
			.partial()
			.safeParse(data);

		if (!success.success) {
			return ServiceResponse.failure(
				'Invalid data provided',
				null,
				StatusCodes.BAD_REQUEST
			);
		}

		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const existingPosts =
				await this.blogRepository.findAllPostsAsync(false);

			if (!existingPosts.find((post) => post.id === parsedId)) {
				return ServiceResponse.failure(
					'No blog post found to update',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			if (existingPosts.some((post) => post.title === data.title)) {
				return ServiceResponse.failure(
					'Blog post with the same title already exists',
					null,
					StatusCodes.CONFLICT
				);
			}

			let updatedData = { ...data };

			if (data.uri) {
				const uri = data.uri.replace(/\s+/g, '-').toLowerCase();
				if (existingPosts.some((post) => post.uri === uri)) {
					return ServiceResponse.failure(
						'Blog post with the same url already exists',
						null,
						StatusCodes.CONFLICT
					);
				}

				updatedData = { ...data, uri };
			}

			const updatedPost = await this.blogRepository.updatePostAsync(
				parsedId,
				updatedData
			);
			return ServiceResponse.success<BlogPost>(
				'Blog post updated successfully',
				updatedPost
			);
		} catch (error) {
			const errorMessage = `Error updating blog post: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while updating blog post.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async deleteCategory(id: string): Promise<ServiceResponse<null>> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const existingCategory =
				await this.blogRepository.findCategoryAsync(parsedId, false);

			if (!existingCategory) {
				return ServiceResponse.failure(
					'No blog category found to delete',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			await this.blogRepository.deleteCategoryAsync(parsedId);
			return ServiceResponse.success<null>(
				'Blog category deleted successfully',
				null
			);
		} catch (error) {
			const errorMessage = `Error deleting blog category: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while deleting blog category.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}

	async deletePost(id: string): Promise<ServiceResponse<null>> {
		try {
			const parsedId = parseInt(id, 10);
			if (!parsedId || parsedId <= 0) {
				return ServiceResponse.failure(
					'Invalid ID provided',
					null,
					StatusCodes.BAD_REQUEST
				);
			}

			const existingPost =
				await this.blogRepository.findAllPostsAsync(false);

			if (!existingPost.find((post) => post.id === parsedId)) {
				return ServiceResponse.failure(
					'No blog post found to delete',
					null,
					StatusCodes.NOT_FOUND
				);
			}

			await this.blogRepository.deletePostAsync(parsedId);
			return ServiceResponse.success<null>(
				'Blog post deleted successfully',
				null
			);
		} catch (error) {
			const errorMessage = `Error deleting blog post: ${(error as Error).message}`;
			console.error(errorMessage);
			return ServiceResponse.failure(
				'An error occurred while deleting blog post.',
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
		}
	}
}

export const blogService = new BlogService();
