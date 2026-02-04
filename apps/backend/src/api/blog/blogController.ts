import type { Request, RequestHandler, Response } from "express";

import { blogService } from "@/api/blog/blogService";

class BlogController {
	public getCategories: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findCategories(req.query.includePosts === "true");
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getCategory: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findCategory(req.params.id, req.query.includePosts === "true");
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getPosts: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findPosts(req.query.includeCategories === "true");
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public getPost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.findPost(req.params.url, req.query.includeCategories === "true");
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createCategory: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.createCategory(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public createPost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.createPost(req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updateCategory: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.updateCategory(req.params.id, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public updatePost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.updatePost(req.params.id, req.body);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deleteCategory: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.deleteCategory(req.params.id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

	public deletePost: RequestHandler = async (req: Request, res: Response) => {
		const serviceResponse = await blogService.deletePost(req.params.id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};
}

export const blogController = new BlogController();
