import { Router } from 'express';
import tournamentController from 'controller/tournament';
import { z } from 'zod';
import { ITournamentDb } from 'types/tournamentDb';
import { RdgaRequest } from 'controller/base';

const router = Router();

router
  .route('/')
  .get((request, response) => tournamentController.getAll(request, response))
  .post((request, response) => tournamentController.create(request, response));

router
  .route('/:tournamentCode')
  .get((request, response) =>
    tournamentController.getByPrimaryKey(request, response),
  )
  .put((request, response) => tournamentController.update(request, response))
  .delete((request, response) =>
    tournamentController.delete(request, response),
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
