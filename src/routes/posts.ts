import { Request, Response, Router } from 'express';
import postsController from 'controller/posts';
import { response400Schema } from 'helpers/responses';
import { z } from 'zod';

const router = Router();

router.route('/').get(postsController.getAll).post(postsController.create);

router
  .route('/:postCode')
  .get(postsController.getByCode)
  .put(postsController.update)
  .delete(postsController.delete);

router.param(
  'postCode',
  (request: Request, response: Response, next, postCodeParam) => {
    const result = z.string().safeParse(postCodeParam);
    if (!result.success) {
      return response400Schema(response, result.error);
    }

    request.postCode = result.data;
    next();
  },
);

export default router;
