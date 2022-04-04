import { Router, Request, Response } from 'express';
import playerService from 'service/player';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.get('/players', playerService.getAll);

export default router;
