import { Router } from 'express';
import { schedulesController } from './schedulesController';

export const schedulesRouter: Router = Router();

schedulesRouter.get('/', schedulesController.getSchedules);

schedulesRouter.put('/', schedulesController.updateSchedules);
