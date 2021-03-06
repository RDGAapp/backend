import { Router, Request, Response } from 'express';
import playerController from 'controller/player';
import { response400 } from 'helpers/responses';

const router = Router();

router.get('/', playerController.getAll);
router.post('/', playerController.create);
router.patch('/:rdgaNumber/rdgaRating', playerController.updateRdgaRating);

router.route('/:rdgaNumber')
  .get(playerController.getByRdgaNumber)
  .put(playerController.update)
  .delete(playerController.delete);

router.param('rdgaNumber', (request: Request, response: Response, next, rdgaNumberParam) => {
  const rdgaNumber = Number(rdgaNumberParam);
  if (isNaN(rdgaNumber)) return response400(response, 'Номер РДГА', 'числом', 'м');
  request.rdgaNumber = rdgaNumber;
  next();
});

export default router;
