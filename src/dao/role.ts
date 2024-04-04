import roleMapping from 'mapping/role';
import { Table } from 'types/db';
import { IRole } from 'types/role';
import { IRoleDb } from 'types/roleDb';
import BaseDao from './base';

class RoleDao extends BaseDao<IRole, IRoleDb, 'code'> {
  constructor() {
    super(Table.Role, roleMapping, 'code');
  }
}

export default new RoleDao();
