import { Router, Request, Response } from 'express';
import playerRouter from 'routes/players';
import tournamentsRouter from 'routes/tournaments';
import postsRouter from 'routes/posts';

const router = Router();

router.get('/coffee', (req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.use('/players', playerRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/posts', postsRouter);

export default router;
