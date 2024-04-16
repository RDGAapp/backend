import playerRoleMapping from 'mapping/playerRole';
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
  constructor() {
    super(Table.PlayerRoles, playerRoleMapping, 'player_rdga_number');
  }

  async getAllByPlayer(
    rdgaNumber: IPlayerRole['playerRdgaNumber'],
  ): Promise<IPlayerRole[]> {
    return db(this._tableName)
      .where({ player_rdga_number: rdgaNumber })
      .select(playerRoleMapping);
  }

  async removeRoleFromPlayer(
    rdgaNumber: IPlayerRole['playerRdgaNumber'],
    roleCode: IPlayerRole['roleCode'],
  ) {
    return db(this._tableName)
      .where({ player_rdga_number: rdgaNumber, role_code: roleCode })
      .del();
  }
}

export default new RoleDao();
