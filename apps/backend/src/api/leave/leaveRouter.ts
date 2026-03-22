import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { leaveController } from './leaveController';

export const leaveRouter: Router = Router();

leaveRouter.get('/', leaveController.getLeave);

leaveRouter.post('/', requireAuth, leaveController.createLeave);

leaveRouter.put('/', requireAuth, leaveController.updateLeave);

leaveRouter.delete('/', requireAuth, leaveController.deleteLeave);
