import type { Request, RequestHandler, Response } from 'express';

import { blogService } from '@/api/blog/blogService';

class BlogController {
	public getCategories: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await blogService.findCategories(
			req.query['include-posts'] === 'true'
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getCategory: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await blogService.findCategory(
			<string>req.params.id,
			req.query['include-posts'] === 'true'
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getPosts: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findPosts(
			req.query['include-categories'] === 'true'
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getPost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findPost(
			<string>req.params.uri,
			req.query['include-categories'] === 'true'
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createCategory: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await blogService.createCategory(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createPost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.createPost(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateCategory: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await blogService.updateCategory(
			<string>req.params.id,
			req.body
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updatePost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.updatePost(
			<string>req.params.id,
			req.body
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteCategory: RequestHandler = async (
		req: Request,
		res: Response
	) => {
		const serviceResponse = await blogService.deleteCategory(
			<string>req.params.id
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deletePost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.deletePost(
			<string>req.params.id
		);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const blogController = new BlogController();
