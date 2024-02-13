import { Router, Request, Response } from 'express';
import playerController from 'controller/players';
import { response400Schema } from 'helpers/responses';
import { z } from 'zod';

const router = Router();

router.route('/').get(playerController.getAll).post(playerController.create);

router.patch('/:rdgaNumber/rdgaRating', playerController.updateRdgaRating);
router.patch(
  '/:rdgaNumber/activate',
  playerController.activatePlayerForCurrentYear,
);

router
  .route('/:rdgaNumber')
  .get(playerController.getByRdgaNumber)
  .put(playerController.update)
  .delete(playerController.delete);

router
  .route('/rdgaRating/multiple')
  .put(playerController.multipleUpdateRdgaRating);

router.param(
  'rdgaNumber',
  (request: Request, response: Response, next, rdgaNumberParam) => {
    const result = z.number().positive().safeParse(Number(rdgaNumberParam));
    if (!result.success)
      return response400Schema(response, result.error);
    request.rdgaNumber = result.data;
    next();
  },
);

export default router;
