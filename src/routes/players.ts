import { Router } from 'express';
import playerController from 'controller/player';
import { z } from 'zod';
import { RdgaRequest } from 'controller/base';
import { IPlayerDb } from 'types/playerDb';

const router = Router();

router
  .route('/')
  .get((request, response) => playerController.getAll(request, response))
  .post((request, response) => playerController.create(request, response));

router.patch('/:rdgaNumber/rdgaRating', (request, response) =>
  playerController.updateRdgaRating(request, response),
);
router.patch('/:rdgaNumber/activate', (request, response) =>
  playerController.activatePlayerForCurrentYear(request, response),
);

router
  .route('/:rdgaNumber')
  .get((request, response) =>
    playerController.getByPrimaryKey(request, response),
  )
  .put((request, response) => playerController.update(request, response))
  .delete((request, response) => playerController.delete(request, response));

router
  .route('/rdgaRating/multiple')
  .put((request, response) =>
    playerController.multipleUpdateRdgaRating(request, response),
  );

router.param(
  'rdgaNumber',
  (
    request: RdgaRequest<IPlayerDb, 'rdga_number'>,
    _response,
    next,
    rdgaNumberParam,
  ) => {
    const result = z.number().positive().safeParse(Number(rdgaNumberParam));
    let primaryKey = 0;
    if (result.success) {
      primaryKey = result.data;
    }
    request.primaryKeyValue = primaryKey;
    next();
  },
);

export default router;
