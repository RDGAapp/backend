import { Request, Response, Router } from 'express';
import tournamentsController from 'controller/tournaments';
import { response400 } from 'helpers/responses';

const router = Router();

router
  .route('/')
  .get(tournamentsController.getAll)
  .post(tournamentsController.create);

router
  .route('/:tournamentCode')
  .put(tournamentsController.update)
  .delete(tournamentsController.delete);

router.param(
  'tournamentCode',
  (request: Request, response: Response, next, tournamentCodeParam) => {
    if (!tournamentCodeParam) {
      return response400(response, 'Код турнира', 'строкой', 'м');
    }

    request.tournamentCode = tournamentCodeParam;
    next();
  },
);

export default router;
