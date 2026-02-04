import { Router } from "express";
import { informationsController } from "./informationsController";

export const informationsRouter: Router = Router();

informationsRouter.get("/", informationsController.getInformations);

informationsRouter.put("/", informationsController.updateInformations);
