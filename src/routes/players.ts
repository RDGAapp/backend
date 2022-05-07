import { Router } from 'express';
import playerController from 'controller/player';

const router = Router();

router.get('/', playerController.getAll);
router.get('/:rdgaNumber', playerController.getByRdgaNumber);
router.post('/', playerController.create);
router.put('/:rdgaNumber', playerController.update);
router.delete('/:rdgaNumber', playerController.delete);
router.patch('/:rdgaNumber/rdgaRating', playerController.updateRdgaRating);

export default router;
