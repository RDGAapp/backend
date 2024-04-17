import playerRoleMapping from 'mapping/playerRole';
import roleMapping from 'mapping/role';
import { Table } from 'types/db';
import BaseDao from './base';
import { IPlayerRole } from 'types/playerRole';
import { IPlayerRoleDb } from 'types/playerRoleDb';
import db from 'database';

class RoleDao extends BaseDao<
  IPlayerRole,
  IPlayerRoleDb,
  'player_rdga_number'
> {
  #roleTableName = Table.Role;

  constructor() {
    super(Table.PlayerRoles, playerRoleMapping, 'player_rdga_number');
  }

  async getAllByPlayer(
    rdgaNumber: IPlayerRole['playerRdgaNumber'],
  ): Promise<IPlayerRole[]> {
    return db(this._tableName)
      .where({ player_rdga_number: rdgaNumber })
      .select(this._mapping);
  }

  async removeRoleFromPlayer(
    rdgaNumber: IPlayerRole['playerRdgaNumber'],
    roleCode: IPlayerRole['roleCode'],
  ) {
    return db(this._tableName)
      .where({ player_rdga_number: rdgaNumber, role_code: roleCode })
      .del();
  }

  async getPlayerPermissions(rdgaNumber: IPlayerRole['playerRdgaNumber']) {
    return db(this._tableName)
      .leftJoin(
        this.#roleTableName,
        `${this._tableName}.role_code`,
        `${this.#roleTableName}.code`,
      )
      .where({ player_rdga_number: rdgaNumber })
      .select({ ...this._mapping, ...roleMapping });
  }
}

export default new RoleDao();
