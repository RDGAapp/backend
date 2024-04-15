import { Router } from 'express';
import roleController from 'controller/role';
import { z } from 'zod';
import { RdgaRequest } from 'controller/base';
import { IRoleDb } from 'types/roleDb';

const router = Router();

router
  .route('/')
  .get((request, response) => roleController.getAll(request, response));

router
  .route('/:roleCode')
  .get((request, response) =>
    roleController.getByPrimaryKey(request, response),
  );

router.param(
  'roleCode',
  (request: RdgaRequest<IRoleDb, 'code'>, _response, next, postCodeParam) => {
    const result = z.string().safeParse(postCodeParam);
    let postCode = '';
    if (result.success) {
      postCode = result.data;
    }

    request.primaryKeyValue = postCode;
    next();
  },
);

export default router;
