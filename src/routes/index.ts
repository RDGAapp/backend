import { Router, Request, Response } from 'express';
import playerRouter from 'routes/players';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.use('/players', playerRouter);

export default router;
