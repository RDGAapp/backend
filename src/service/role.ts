import roleDao, { RoleDao } from 'dao/role';
import roleMapping from 'mapping/role';
import { IRole } from 'types/role';
import { IRoleDb } from 'types/roleDb';
import BaseService from './base';

class RoleService extends BaseService<IRole, IRoleDb, RoleDao> {
  constructor() {
    super(roleDao, roleMapping);
  }
}

export default new RoleService();
