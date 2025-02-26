import db from 'database';
import { IWithPagination } from 'knex-paginate';
import playerMapping from 'mapping/player';
import { Table } from 'types/db';
import { IPlayer, IPlayerBase } from 'types/player';
import { IPlayerDb } from 'types/playerDb';
import BaseDao from './base';

class PlayerDao extends BaseDao<IPlayerBase, IPlayerDb, 'rdga_number'> {
  #authTableName;

  constructor() {
    super(Table.Player, playerMapping, 'rdga_number');
    this.#authTableName = Table.AuthData;
    this._perPageRecords = 30;
  }

  async getAllPaginated(
    pageNumber: number,
    surname: IPlayerDb['surname'],
    town: IPlayerDb['town'],
    onlyActive: boolean,
  ): Promise<IWithPagination<IPlayer>> {
    let query = db(this._tableName).leftJoin(
      this.#authTableName,
      `${this._tableName}.rdga_number`,
      `${this.#authTableName}.rdga_number`,
    );

    if (surname) {
      query = query.where('surname', 'ilike', `%${surname}%`);
    }
    if (town) {
      query = query.where({ town });
    }

    if (onlyActive) {
      query = query.where('active_to', '>', 'now()');
    }

    return query
      .select({
        ...playerMapping,
        rdgaNumber: `${this._tableName}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      })
      .orderBy(`${this._tableName}.rdga_number`, 'asc')
      .paginate({
        perPage: this._perPageRecords,
        currentPage: pageNumber,
        isLengthAware: true,
      });
  }

  async getByPrimaryKey(
    rdgaNumber: IPlayerDb['rdga_number'],
  ): Promise<IPlayer> {
    const player = await db(this._tableName)
      .leftJoin(
        this.#authTableName,
        `${this._tableName}.rdga_number`,
        `${this.#authTableName}.rdga_number`,
      )
      .select({
        ...playerMapping,
        rdgaNumber: `${this._tableName}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      })
      .where({ [`${this._tableName}.rdga_number`]: rdgaNumber });

    return player?.[0];
  }

  async getByRdgaPdgaMetrixNumber(
    rdgaNumber?: IPlayerDb['rdga_number'],
    pdgaNumber?: IPlayerDb['pdga_number'],
    metrixNumber?: IPlayerDb['metrix_number'],
  ): Promise<IPlayerBase[]> {
    const player = await db(this._tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber })
      .orWhere({ pdga_number: pdgaNumber || 0 })
      .orWhere({ metrix_number: metrixNumber || 0 });

    return player;
  }

  async activatePlayerForCurrentYear(
    rdgaNumber: IPlayerDb['rdga_number'],
  ): Promise<IPlayerDb> {
    const updatedPlayer = await db(this._tableName)
      .where({ rdga_number: rdgaNumber })
      .update({
        active_to: `${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`,
      })
      .returning('*');

    return updatedPlayer[0];
  }
}

export default new PlayerDao();
