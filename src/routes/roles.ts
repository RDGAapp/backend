import { Router } from 'express';
import roleController from 'controller/role';
import { z } from 'zod';
import { RdgaRequest } from 'controller/base';
import { IRoleDb } from 'types/roleDb';
import { getPrimaryKeyFromParam } from 'helpers/routerHelper';

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
  (request: RdgaRequest<IRoleDb, 'code'>, _response, next, roleCodeParam) => {
    request.primaryKeyValue = getPrimaryKeyFromParam(roleCodeParam, z.string());
    next();
  },
);

export default router;
