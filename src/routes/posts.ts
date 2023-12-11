import { Request, Response, Router } from 'express';
import postsController from 'controller/posts';
import { response400 } from 'helpers/responses';

const router = Router();

router
  .route('/')
  .get(postsController.getAll)
  .post(postsController.create);

router
  .route('/:postCode')
  .get(postsController.getByCode)
  .put(postsController.update)
  .delete(postsController.delete);

router.param(
  'postCode',
  (request: Request, response: Response, next, postCodeParam) => {
    if (!postCodeParam) {
      return response400(response, 'Код публикации', 'строкой', 'м');
    }

    request.postCode = postCodeParam;
    next();
  },
);

export default router;
