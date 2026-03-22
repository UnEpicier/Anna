import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { departmentsController } from './departmentsController';

export const departmentsRouter: Router = Router();

departmentsRouter.get('/', requireAuth, departmentsController.getDepartments);

departmentsRouter.get('/actives', departmentsController.getActiveDepartments);

departmentsRouter.put('/', requireAuth, departmentsController.updateDepartment);
