import { db } from 'database';
import playerMapping from 'mapping/player';
import { IPlayer, IPlayerBase } from 'types/player';
import { IPlayerDb } from 'types/playerDb';
import BaseDao from './base';
import { authData, player } from 'database/schema';
import { and, asc, count, desc, eq, gt, ilike } from 'drizzle-orm';

class PlayerDao extends BaseDao<'rdgaNumber'> {
  #authTable;

  constructor() {
    super(player, 'rdgaNumber');
    this.#authTable = authData;
    this._perPageRecords = 30;
  }

  async getAllPaginated(
    pageNumber: number,
    surname: IPlayerDb['surname'],
    town: IPlayerDb['town'],
    onlyActive: boolean,
  ) {
    const queries = [];

    if (surname) {
      queries.push(ilike(player.surname, `%${surname}%`));
    }
    if (town) {
      queries.push(eq(player.town, town));
    }

    if (onlyActive) {
      queries.push(gt(player.activeTo, 'now()'));
    }

    return db
      .select({ total: count(), records: player })
      .from(this._table)
      .leftJoin(this.#authTable, eq(player.rdgaNumber, authData.rdgaNumber))
      .where(and(...queries))
      .orderBy(desc(player.rdgaRating), asc(player.rdgaNumber))
      .limit(this._perPageRecords)
      .offset((pageNumber - 1) * this._perPageRecords);
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

  async updateRdgaRating(
    rdgaNumber: IPlayerDb['rdga_number'],
    rdgaRating: IPlayerDb['rdga_rating'],
    ratingDifference: IPlayerDb['rdga_rating_change'],
  ): Promise<IPlayerDb> {
    const updatedPlayer = await db(this._tableName)
      .where({ rdga_number: rdgaNumber })
      .update({ rdga_rating: rdgaRating, rdga_rating_change: ratingDifference })
      .returning('*');

    return updatedPlayer[0];
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
