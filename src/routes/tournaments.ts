import { Request, Response, Router } from 'express';
import tournamentsController from 'controller/tournaments';
import { response400Schema } from 'helpers/responses';
import { z } from 'zod';

const router = Router();

router
  .route('/')
  .get(tournamentsController.getAll)
  .post(tournamentsController.create);

router
  .route('/:tournamentCode')
  .get(tournamentsController.getByCode)
  .put(tournamentsController.update)
  .delete(tournamentsController.delete);

router.param(
  'tournamentCode',
  (request: Request, response: Response, next, tournamentCodeParam) => {
    const result = z.string().safeParse(tournamentCodeParam);
    if (!result.success) {
      return response400Schema(response, result.error);
    }

    request.tournamentCode = result.data;
    next();
  },
);

export default router;
