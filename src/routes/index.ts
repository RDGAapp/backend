import { Router, Request, Response } from 'express';
import playerRouter from 'routes/players';
import tournamentsRouter from 'routes/tournaments';
import postsRouter from 'routes/posts';
import authorizationRouter from 'routes/authorization';
import rolesRouter from 'routes/roles';
import playerController from 'controller/player';

const router = Router();

router.get('/coffee', (_req: Request, res: Response) => {
  res.status(418).send("I'm a teapot");
});

router.use('/players', playerRouter);
router.use('/tournaments', tournamentsRouter);
router.use('/posts', postsRouter);
router.use('/authorization', authorizationRouter);
router.use('/roles', rolesRouter);

router.post('/bitrix/update', (request, response) =>
  playerController.updatePlayerFromBitrix(request, response),
);

export default router;
