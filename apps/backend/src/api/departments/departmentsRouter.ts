import { Router } from 'express';
import { departmentsController } from './departmentsController';

export const departmentsRouter: Router = Router();

departmentsRouter.get('/', departmentsController.getDepartments);

departmentsRouter.get('/actives', departmentsController.getActiveDepartments);

departmentsRouter.put('/', departmentsController.updateDepartment);
