import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { leaveController } from './leaveController';

export const leaveRouter: Router = Router();

leaveRouter.get('/', leaveController.getLeave);

leaveRouter.get('/all', requireAuth, leaveController.getAllLeaves);

leaveRouter.post('/', requireAuth, leaveController.createLeave);

leaveRouter.put('/:id', requireAuth, leaveController.updateLeave);

leaveRouter.delete('/:id', requireAuth, leaveController.deleteLeave);
