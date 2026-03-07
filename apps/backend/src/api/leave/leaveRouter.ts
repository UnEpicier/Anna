import { Router } from 'express';
import { leaveController } from './leaveController';

export const leaveRouter: Router = Router();

leaveRouter.get('/', leaveController.getLeave);

leaveRouter.post('/', leaveController.createLeave);

leaveRouter.put('/', leaveController.updateInformations);

leaveRouter.delete('/', leaveController.deleteLeave);
