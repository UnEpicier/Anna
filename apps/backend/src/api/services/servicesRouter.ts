import { Router } from 'express';
import { servicesController } from './servicesController';

export const servicesRouter: Router = Router();

servicesRouter.get('/', servicesController.getServices);

servicesRouter.get('/:id', servicesController.getServiceById);

servicesRouter.post('/', servicesController.createService);

servicesRouter.put('/', servicesController.updateService);

servicesRouter.delete('/:id', servicesController.deleteService);
