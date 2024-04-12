import { Router } from 'express';
import tournamentsController from 'controller/tournament';
import { z } from 'zod';
import { ITournamentDb } from 'types/tournamentDb';
import { RdgaRequest } from 'controller/base';

const router = Router();

router
  .route('/')
  .get((request, response) => tournamentsController.getAll(request, response))
  .post((request, response) => tournamentsController.create(request, response));

router
  .route('/:tournamentCode')
  .get((request, response) =>
    tournamentsController.getByPrimaryKey(request, response),
  )
  .put((request, response) => tournamentsController.update(request, response))
  .delete((request, response) =>
    tournamentsController.delete(request, response),
  );

router.param(
  'tournamentCode',
  (
    request: RdgaRequest<ITournamentDb, 'code'>,
    _response,
    next,
    tournamentCodeParam,
  ) => {
    const result = z.string().safeParse(tournamentCodeParam);
    let tournamentCode = '';
    if (result.success) {
      tournamentCode = result.data;
    }

    request.primaryKeyValue = tournamentCode;
    next();
  },
);

export default router;
