import { Router } from 'express';
import postController from 'controller/post';
import { z } from 'zod';
import { RdgaRequest } from 'controller/base';
import { IBlogPostDb } from 'types/postDb';
import { getPrimaryKeyFromParam } from 'helpers/routerHelper';

const router = Router();

router
  .route('/')
  .get((request, response) => postController.getAllPaginated(request, response))
  .post((request, response) => postController.create(request, response));

router
  .route('/:postCode')
  .get((request, response) => postController.getByPrimaryKey(request, response))
  .put((request, response) => postController.update(request, response))
  .delete((request, response) => postController.delete(request, response));

router.param(
  'postCode',
  (
    request: RdgaRequest<IBlogPostDb, 'code'>,
    _response,
    next,
    postCodeParam,
  ) => {
    request.primaryKeyValue = getPrimaryKeyFromParam(postCodeParam, z.string());
    next();
  },
);

export default router;
