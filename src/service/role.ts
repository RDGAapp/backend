import roleDao from 'dao/role';
import dbObjectToObject from 'helpers/dbObjectToObject';
import objectToDbObject from 'helpers/objectToDbObject';
import roleMapping from 'mapping/role';
import { IRole } from 'types/role';
import { IRoleDb } from 'types/roleDb';

class RoleService {
  async getAll(): Promise<IRole[]> {
    const posts = await roleDao.getAll();

    return posts;
  }

  async create(role: IRole): Promise<string> {
    const roleDb = objectToDbObject<IRole, IRoleDb>(role, roleMapping);

    const createdRole = await roleDao.create(roleDb);

    return createdRole.name;
  }

  async update(post: IRole): Promise<IRole> {
    const roleDb = objectToDbObject<IRole, IRoleDb>(post, roleMapping);

    const updatedRoleDb = await roleDao.update(roleDb);

    const updatedRole = dbObjectToObject<IRoleDb, IRole>(
      updatedRoleDb,
      roleMapping,
    );
    return updatedRole;
  }

  async delete(code: string): Promise<void> {
    await roleDao.delete(code);
  }

  async getByCode(code: string): Promise<IRole> {
    return roleDao.getByPrimaryKey(code);
  }
}

export default new RoleService();
