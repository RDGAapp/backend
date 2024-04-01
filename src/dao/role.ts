import db from 'database';
import roleMapping from 'mapping/role';
import { Table } from 'types/db';
import { IRole } from 'types/role';
import { IRoleDb } from 'types/roleDb';

class RoleDao {
  #tableName;

  constructor() {
    this.#tableName = Table.Role;
  }

  async getAll(): Promise<IRole[]> {
    const query = db(this.#tableName);

    const results = query.select(roleMapping);

    return results;
  }

  async create(post: IRoleDb): Promise<string> {
    const createdPost = await db(this.#tableName)
      .insert(post)
      .returning('name');

    return createdPost[0].name;
  }

  async update(role: IRoleDb): Promise<IRoleDb> {
    const updatedRole = await db(this.#tableName)
      .where({ code: role.code })
      .update(role)
      .returning('*');

    return updatedRole[0];
  }

  async delete(code: string): Promise<void> {
    await db(this.#tableName).where({ code }).del();
  }

  async getByCode(code: string): Promise<IRole> {
    const role = await db(this.#tableName).select(roleMapping).where({ code });

    return role[0];
  }
}

export default new RoleDao();
