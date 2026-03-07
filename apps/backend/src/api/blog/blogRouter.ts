import { Router } from 'express';
import { blogController } from './blogController';

export const blogRouter: Router = Router();

blogRouter.get('/categories', blogController.getCategories);

blogRouter.get('/categories/:id', blogController.getCategory);

blogRouter.post('/categories', blogController.createCategory);

blogRouter.put('/categories/:id', blogController.updateCategory);

blogRouter.delete('/categories/:id', blogController.deleteCategory);

blogRouter.get('/posts', blogController.getPosts);

blogRouter.get('/posts/:uri', blogController.getPost);

blogRouter.post('/posts', blogController.createPost);

blogRouter.put('/posts/:id', blogController.updatePost);

blogRouter.delete('/posts/:id', blogController.deletePost);
