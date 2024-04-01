import db from 'database';
import { IWithPagination } from 'knex-paginate';
import playerMapping from 'mapping/player';
import { Table } from 'types/db';
import { IPlayer, IPlayerBase } from 'types/player';
import { IPlayerDb } from 'types/playerDb';

class PlayerDao {
  #tableName;
  #authTableName;

  constructor() {
    this.#tableName = Table.Player;
    this.#authTableName = Table.AuthData;
  }

  async getAll(
    pageNumber: number,
    surname: string,
    town: string,
    onlyActive: boolean,
  ): Promise<IWithPagination<IPlayer[]>> {
    let query = db(this.#tableName).leftJoin(
      this.#authTableName,
      `${this.#tableName}.rdga_number`,
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
        rdgaNumber: `${this.#tableName}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      })
      .orderBy('rdga_rating', 'desc')
      .orderBy(`${this.#tableName}.rdga_number`, 'asc')
      .paginate({
        perPage: 30,
        currentPage: pageNumber,
        isLengthAware: true,
      });
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<IPlayer | null> {
    const player = await db(this.#tableName)
      .leftJoin(
        this.#authTableName,
        `${this.#tableName}.rdga_number`,
        `${this.#authTableName}.rdga_number`,
      )
      .select({
        ...playerMapping,
        rdgaNumber: `${this.#tableName}.rdga_number`,
        avatarUrl: 'telegram_photo_url',
      })
      .where({ [`${this.#tableName}.rdga_number`]: rdgaNumber });

    return player?.[0] ?? null;
  }

  async getByRdgaPdgaMetrixNumber(
    rdgaNumber?: number,
    pdgaNumber?: number | null,
    metrixNumber?: number | null,
  ): Promise<IPlayerBase[]> {
    const player = await db(this.#tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber })
      .orWhere({ pdga_number: pdgaNumber || 0 })
      .orWhere({ metrix_number: metrixNumber || 0 });

    return player;
  }

  async create(player: IPlayerDb): Promise<number> {
    const createdPlayer = await db(this.#tableName)
      .insert(player)
      .returning('rdga_number');

    return createdPlayer[0].rdga_number;
  }

  async update(player: IPlayerDb): Promise<IPlayerDb> {
    const updatedPlayer = await db(this.#tableName)
      .where({ rdga_number: player.rdga_number })
      .update(player)
      .returning('*');

    return updatedPlayer[0];
  }

  async delete(rdgaNumber: number): Promise<void> {
    await db(this.#tableName).where({ rdga_number: rdgaNumber }).del();
  }

  async updateRdgaRating(
    rdgaNumber: number,
    rdgaRating: number,
    ratingDifference: number,
  ): Promise<IPlayerDb> {
    const updatedPlayer = await db(this.#tableName)
      .where({ rdga_number: rdgaNumber })
      .update({ rdga_rating: rdgaRating, rdga_rating_change: ratingDifference })
      .returning('*');

    return updatedPlayer[0];
  }

  async activatePlayerForCurrentYear(rdgaNumber: number): Promise<IPlayerDb> {
    const updatedPlayer = await db(this.#tableName)
      .where({ rdga_number: rdgaNumber })
      .update({
        active_to: `${new Date().getFullYear() + 1}-01-01T00:00:00.000Z`,
      })
      .returning('*');

    return updatedPlayer[0];
  }
}

export default new PlayerDao();
