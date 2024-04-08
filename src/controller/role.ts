import roleService from 'service/role';
import roleDao from 'dao/role';
import { rolePutSchema, roleSchema } from 'schemas';
import { IRoleDb } from 'types/roleDb';
import { IRole } from 'types/role';
import BaseController from './base';

class RoleController extends BaseController<
  IRole,
  IRoleDb,
  'code',
  'code',
  typeof roleService,
  typeof roleDao
> {
  constructor() {
    super(roleService, 'code', 'code', roleSchema, rolePutSchema);
  }
}

export default new RoleController();
