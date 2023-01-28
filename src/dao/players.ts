import db from 'database';
import { IWithPagination } from 'knex-paginate';
import playerMapping from 'mapping/player';

class PlayerDao {
  #tableName;

  constructor() {
    this.#tableName = 'players';
  }

  async getAll(
    pageNumber: number,
    surname: string,
    town: string,
  ): Promise<IWithPagination<Player[]>> {
    let query = db(this.#tableName);

    if (surname) {
      query = query.where('surname', 'ilike', `%${surname}%`);
    }
    if (town) {
      query = query.where({ town });
    }

    return query
      .select(playerMapping)
      .orderBy('rdga_rating', 'desc')
      .orderBy('rdga_number', 'asc')
      .paginate({
        perPage: 30,
        currentPage: pageNumber,
        isLengthAware: true,
      });
  }

  async getByRdgaNumber(rdgaNumber: number): Promise<Player | null> {
    const player = await db(this.#tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber });

    return player?.[0] ?? null;
  }

  async getByRdgaPdgaMetrixNumber(
    rdgaNumber?: number,
    pdgaNumber?: number | null,
    metrixNumber?: number | null,
  ): Promise<Player[]> {
    const player = await db(this.#tableName)
      .select(playerMapping)
      .where({ rdga_number: rdgaNumber })
      .orWhere({ pdga_number: pdgaNumber || 0 })
      .orWhere({ metrix_number: metrixNumber || 0 });

    return player;
  }

  async create(player: PlayerDb): Promise<number> {
    const createdPlayer = await db(this.#tableName)
      .insert(player)
      .returning('rdga_number');

    return createdPlayer[0].rdga_number;
  }

  async update(player: PlayerDb): Promise<PlayerDb> {
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
  ): Promise<PlayerDb> {
    const updatedPlayer = await db(this.#tableName)
      .where({ rdga_number: rdgaNumber })
      .update({ rdga_rating: rdgaRating, rdga_rating_change: ratingDifference })
      .returning('*');

    return updatedPlayer[0];
  }
}

export default new PlayerDao();
