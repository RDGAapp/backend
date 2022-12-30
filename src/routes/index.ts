import { Router, Request, Response } from 'express';
import playerRouter from 'routes/players';
import tournamentsRouter from 'routes/tournaments';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.use('/players', playerRouter);
router.use('/tournaments', tournamentsRouter);

export default router;
