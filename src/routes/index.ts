import { Router, Request, Response } from 'express';
import playerController from 'controller/player';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

/* Player routes */
router.get('/players', playerController.getAll);
router.get('/players/:rdgaNumber', playerController.getByRdgaNumber);
router.post('/players', playerController.createPlayer);

export default router;
