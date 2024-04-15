import playerRoleMapping from 'mapping/playerRole';
import { Table } from 'types/db';
import BaseDao from './base';
import { IPlayerRole } from 'types/playerRole';
import { IPlayerRoleDb } from 'types/playerRoleDb';
import db from 'database';

class RoleDao extends BaseDao<IPlayerRole, IPlayerRoleDb, 'id'> {
  constructor() {
    super(Table.PlayerRoles, playerRoleMapping, 'id');
  }

  async getAllByPlayer(rdgaNumber: number): Promise<IPlayerRole[]> {
    return db(this._tableName)
      .where({ player_rdga_number: rdgaNumber })
      .select(playerRoleMapping);
  }
}

export default new RoleDao();
