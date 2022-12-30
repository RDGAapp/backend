import { Router } from 'express';
import tournamentsController from 'controller/tournaments';

const router = Router();

router
  .route('/')
  .get(tournamentsController.getAll)
  .post(tournamentsController.create);

export default router;
