import { requireAuth } from '@/commons/middleware/requireAuth';
import { Router } from 'express';
import { servicesController } from './servicesController';

export const servicesRouter: Router = Router();

servicesRouter.get('/', servicesController.getServices);

servicesRouter.post('/', requireAuth, servicesController.createService);

servicesRouter.put('/', requireAuth, servicesController.updateService);

servicesRouter.delete('/:id', requireAuth, servicesController.deleteService);
