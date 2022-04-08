import { Router, Request, Response } from 'express';
import playerController from 'controller/player';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.get('/players', playerController.getAll);

export default router;
