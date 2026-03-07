import type { ServiceResponse } from '@/commons/models/serviceResponse';
import app from '@/server';
import type { BlogCategory, BlogPost } from '@repo/app-types';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { categories, posts } from '../../../../prisma/data/blog';

describe('Blog API Endpoints', () => {
	describe('GET /blog/categories', () => {
		it('should return categories object', async () => {
			// Act
			const response = await request(app).get('/blog/categories');
			const responseBody: ServiceResponse<BlogCategory[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Blog categories found');
			for (let i = 0; i < responseBody.responseObject.length; i++) {
				compareCategory(categories[i], responseBody.responseObject[i]);
			}
		});
	});

	describe('GET /blog/categories/:id', () => {
		it('should return a service object', async () => {
			// Act
			const response = await request(app).get(
				`/blog/categories/${categories[0].id}`
			);
			const responseBody: ServiceResponse<BlogCategory> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Blog category found');
			compareCategory(categories[0], responseBody.responseObject);
		});

		it('should return 400 for invalid id', async () => {
			// Act
			const response = await request(app).get(
				'/blog/categories/invalid-id'
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing category', async () => {
			// Act
			const response = await request(app).get('/blog/categories/9999');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('No blog category found');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('GET /blog/posts', () => {
		it('should return posts object', async () => {
			// Act
			const response = await request(app).get('/blog/posts');
			const responseBody: ServiceResponse<BlogPost[]> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Blog posts found');
			for (let i = 0; i < responseBody.responseObject.length; i++) {
				comparePost(posts[i], responseBody.responseObject[i]);
			}
		});
	});

	describe('GET /blog/posts/:url', () => {
		it('should return a service object', async () => {
			// Act
			const response = await request(app).get(
				`/blog/posts/${posts[0].uri}`
			);
			const responseBody: ServiceResponse<BlogPost> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain('Blog post found');
			comparePost(posts[0], responseBody.responseObject);
		});

		it('should return 404 for non-existing post', async () => {
			// Act
			const response = await request(app).get('/blog/posts/9999');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('No blog post found');
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('POST /blog/categories', () => {
		it('should create a new category', async () => {
			// Arrange
			const newCategory: Pick<BlogCategory, 'name'> = {
				name: 'New Category',
			};

			// Act
			const response = await request(app)
				.post('/blog/categories')
				.send(newCategory);
			const responseBody: ServiceResponse<BlogCategory> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog category created successfully'
			);
			expect(responseBody.responseObject.name).toEqual(newCategory.name);
		});

		it('should return 400 for missing required fields', async () => {
			// Arrange
			const invalidCategory: Partial<BlogCategory> = {};

			// Act
			const response = await request(app)
				.post('/blog/categories')
				.send(invalidCategory);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid data provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 409 for existing category', async () => {
			// Arrange
			const existingCategory: Pick<BlogCategory, 'name'> = {
				name: categories[0].name,
			};

			// Act
			const response = await request(app)
				.post('/blog/categories')
				.send(existingCategory);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'Blog category already exists'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('POST /blog/posts', () => {
		it('should create a new post', async () => {
			// Arrange
			const newPost: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> = {
				title: 'New Post',
				uri: 'new-post',
				excerpt: 'This is a new post',
				content: [
					{
						type: 'heading',
						level: 2,
						text: 'Introduction',
					},
					{
						type: 'paragraph',
						text: 'This is the content of the new post',
					},
				],
				illustrationUrl: 'http://illustration-url',
				visible: true,
			};

			// Act
			const response = await request(app)
				.post('/blog/posts')
				.send(newPost);
			const responseBody: ServiceResponse<BlogPost> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CREATED);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog post created successfully'
			);
			expect(responseBody.responseObject).toMatchObject(newPost);
		});

		it('should return 400 for missing body', async () => {
			// Act
			const response = await request(app).post('/blog/posts');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid data provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 400 for missing fields', async () => {
			// Arrange
			const invalidPost: Partial<BlogPost> = {
				title: 'Invalid Post',
			};

			// Act
			const response = await request(app)
				.post('/blog/posts')
				.send(invalidPost);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid data provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 409 for existing post title', async () => {
			// Arrange
			const existingPost: Omit<
				BlogPost,
				'id' | 'createdAt' | 'updatedAt'
			> = {
				title: posts[0].title,
				uri: 'unique-post-url',
				excerpt: 'This post title already exists',
				content: [],
				illustrationUrl: 'http://illustration-url',
				visible: true,
			};

			// Act
			const response = await request(app)
				.post('/blog/posts')
				.send(existingPost);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'Blog post with the same title already exists'
			);
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 409 for existing post URL', async () => {
			// Arrange
			const existingPost: Omit<
				BlogPost,
				'id' | 'createdAt' | 'updatedAt'
			> = {
				title: 'Existing Post',
				uri: posts[0].uri,
				excerpt: 'This post URL already exists',
				content: [],
				illustrationUrl: 'http://illustration-url',
				visible: true,
			};

			// Act
			const response = await request(app)
				.post('/blog/posts')
				.send(existingPost);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.CONFLICT);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'Blog post with the same uri already exists'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('PUT /blog/categories/:id', () => {
		it('should update an existing category', async () => {
			// Arrange
			const updatedCategory: Partial<BlogCategory> = {
				name: 'Updated Category Name',
			};

			// Act
			const response = await request(app)
				.put(`/blog/categories/${categories[0].id}`)
				.send(updatedCategory);
			const responseBody: ServiceResponse<BlogCategory> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog category updated successfully'
			);
			expect(responseBody.responseObject.name).toEqual(
				updatedCategory.name
			);
		});

		it('should return 400 for invalid id', async () => {
			// Arrange
			const updatedCategory: Partial<BlogCategory> = {
				name: 'Updated Category Name',
			};

			// Act
			const response = await request(app)
				.put('/blog/categories/invalid-id')
				.send(updatedCategory);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing category', async () => {
			// Arrange
			const updatedCategory: Partial<BlogCategory> = {
				name: 'Updated Category Name',
			};

			// Act
			const response = await request(app)
				.put('/blog/categories/9999')
				.send(updatedCategory);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'No blog category found to update'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('PUT /blog/posts/:id', () => {
		it('should update an existing post', async () => {
			// Arrange
			const updatedPost: Partial<BlogPost> = {
				title: 'Updated Post Title',
			};

			// Act
			const response = await request(app)
				.put(`/blog/posts/${posts[0].id}`)
				.send(updatedPost);
			const responseBody: ServiceResponse<BlogPost> = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog post updated successfully'
			);
			expect(responseBody.responseObject.title).toEqual(
				updatedPost.title
			);
		});

		it('should return 400 for invalid id', async () => {
			// Arrange
			const updatedPost: Partial<BlogPost> = {
				title: 'Updated Post Title',
			};

			// Act
			const response = await request(app)
				.put('/blog/posts/invalid-id')
				.send(updatedPost);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing post', async () => {
			// Arrange
			const updatedPost: Partial<BlogPost> = {
				title: 'Updated Post Title',
			};

			// Act
			const response = await request(app)
				.put('/blog/posts/9999')
				.send(updatedPost);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'No blog post found to update'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('DELETE /blog/categories/:id', () => {
		it('should delete an existing category', async () => {
			// Act
			const response = await request(app).delete(
				`/blog/categories/${categories[0].id}`
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog category deleted successfully'
			);
		});

		it('should return 400 for invalid id', async () => {
			// Act
			const response = await request(app).delete(
				'/blog/categories/invalid-id'
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing category', async () => {
			// Act
			const response = await request(app).delete('/blog/categories/9999');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'No blog category found to delete'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});

	describe('DELETE /blog/posts/:id', () => {
		it('should delete an existing post', async () => {
			// Act
			const response = await request(app).delete(
				`/blog/posts/${posts[0].id}`
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.OK);
			expect(responseBody.success).toBeTruthy();
			expect(responseBody.message).toContain(
				'Blog post deleted successfully'
			);
		});

		it('should return 400 for invalid id', async () => {
			// Act
			const response = await request(app).delete(
				'/blog/posts/invalid-id'
			);
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain('Invalid ID provided');
			expect(responseBody.responseObject).toBeNull();
		});

		it('should return 404 for non-existing post', async () => {
			// Act
			const response = await request(app).delete('/blog/posts/9999');
			const responseBody: ServiceResponse = response.body;

			// Assert
			expect(response.statusCode).toEqual(StatusCodes.NOT_FOUND);
			expect(responseBody.success).toBeFalsy();
			expect(responseBody.message).toContain(
				'No blog post found to delete'
			);
			expect(responseBody.responseObject).toBeNull();
		});
	});
});

function compareCategory(
	mockCategory: BlogCategory,
	responseCategory: BlogCategory
) {
	if (!mockCategory || !responseCategory) {
		throw new Error(
			'Invalid test data: mockCategory or responseCategory is undefined'
		);
	}

	expect(responseCategory.id).toEqual(mockCategory.id);
	expect(responseCategory.name).toEqual(mockCategory.name);
	expect(responseCategory.posts).toEqual(mockCategory.posts);
}

function comparePost(mockPost: BlogPost, responsePost: BlogPost) {
	if (!mockPost || !responsePost) {
		throw new Error(
			'Invalid test data: mockPost or responsePost is undefined'
		);
	}

	expect(responsePost.id).toEqual(mockPost.id);
	expect(responsePost.title).toEqual(mockPost.title);
	expect(responsePost.uri).toEqual(mockPost.uri);
	expect(responsePost.excerpt).toEqual(mockPost.excerpt);
	expect(responsePost.content).toEqual(mockPost.content);
	expect(responsePost.illustrationUrl).toEqual(mockPost.illustrationUrl);
	expect(responsePost.visible).toEqual(mockPost.visible);
}
